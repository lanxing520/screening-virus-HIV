import { AnimationGroup, AnimationEvent } from "@babylonjs/core/Legacy/legacy"

export class MultipleAnimationController {
  private _animationGroups: Map<string, AnimationGroup> // 使用唯一标识符存储动画组
  private _currentAnimationGroup: AnimationGroup | null = null
  private _speedRatio: number = 0.2
  private _isPlaying: boolean = false
  private _animationEndObserver: any // 根据实际类型替换为具体类型

  constructor(animationGroups: AnimationGroup[]) {
    const entries = animationGroups.map(
      (group, i) => [(i + 1).toString(), group] as [string, AnimationGroup],
    )
    this._animationGroups = new Map(entries)
  }

  public play(id: string, speed?: number, event?: () => void): void {
    const group = this._animationGroups.get(id)
    if (!group) throw new Error(`AnimationGroup with ID ${id} not found.`)

    // 清理当前动画的状态
    this.stopCurrentAnimation()
    this._currentAnimationGroup = group
    // 提前设置 speedRatio，确保播放时生效
    group.speedRatio = speed ?? this._speedRatio

    // 使用单独的变量保存 observer 引用以便移除
    const onAnimationEnd = () => {
      if (event) event()
      //事件执行完以后移除监听
      if (this._animationEndObserver) {
        group.onAnimationGroupEndObservable.remove(this._animationEndObserver)
      }
    }
    // 添加新的监听器并保存引用
    this._animationEndObserver = group.onAnimationGroupEndObservable.add(onAnimationEnd)
    // 开始播放
    group.play()
    this._isPlaying = true
  }

  public loopPlay(id: string, loopCount: number, speedRatio?: number, event?: () => void): void {
    if (loopCount <= 0) {
      console.warn("循环次数必须大于 0")
      return
    }

    const group = this._animationGroups.get(id)
    if (!group) throw new Error(`AnimationGroup with ID ${id} not found.`)

    let remainingLoops = loopCount
    group.speedRatio = speedRatio ?? this._speedRatio

    // 移除旧监听器，防止重复绑定
    if (this._animationEndObserver) {
      group.onAnimationGroupEndObservable.remove(this._animationEndObserver)
    }

    const onAnimationEnd = () => {
      remainingLoops--
      if (remainingLoops > 0) {
        try {
          group.play()
        } catch (error) {
          console.error("动画播放失败", error)
          this._isPlaying = false
          return
        }
      } else {
        // 清理监听器
        group.onAnimationGroupEndObservable.remove(this._animationEndObserver)
        this._isPlaying = false
        if (event) {
          event()
        }
      }
    }

    // 绑定新监听器
    this._animationEndObserver = group.onAnimationGroupEndObservable.add(onAnimationEnd)

    // 开始播放
    try {
      this._isPlaying = true
      group.play()
    } catch (error) {
      console.error("首次播放动画失败", error)
      this._isPlaying = false
    }
  }
  public pause(): void {
    if (this._currentAnimationGroup) {
      this._currentAnimationGroup.pause()
      this._isPlaying = false
    }
  }

  public isPlaying(): boolean {
    return this._isPlaying
  }

  public getCurrentAnimationId(): string | null {
    return (
      Array.from(this._animationGroups.entries()).find(
        ([, group]) => group === this._currentAnimationGroup,
      )?.[0] || null
    )
  }
  public gotoFrame(id: string, frame: number): void {
    const group = this._animationGroups.get(id)
    if (!group) return
    this._currentAnimationGroup = group
    this._currentAnimationGroup.play()
    if (this._currentAnimationGroup) {
      this._currentAnimationGroup.goToFrame(frame)
    }
    this._currentAnimationGroup.pause()
  }
  public reset(id: string) {
    this.gotoFrame(id, 0)
  }
  public stopCurrentAnimation(): void {
    if (this._currentAnimationGroup) {
      this._currentAnimationGroup.stop()
    }
  }
}

export class AnimationController {
  private _animationGroup: AnimationGroup
  private _speedRatio: number
  private _isPlaying: boolean = false
  private _currentFrame: number = 0
  private _frameHandlers: Map<number, (frame: number) => void> = new Map()
  private _onPlayCallbacks: (() => void)[] = []
  private _onPauseCallbacks: (() => void)[] = []

  constructor(
    animationGroup: AnimationGroup,
    speedRatio: number = 0.2,
    handlers: { frame: number; handler: (currentFrame: number) => void }[] = [],
  ) {
    if (!animationGroup) {
      throw new Error("AnimationController: animationGroup is required")
    }

    this._animationGroup = animationGroup
    this._speedRatio = speedRatio
    this._animationGroup.speedRatio = speedRatio
    this.play()
    this.pause()
    // 初始化事件处理器
    this._initHandlers(handlers)

    // 注册每帧更新回调
    this._registerFrameUpdate()
  }

  /**
   * 初始化事件处理器
   */
  private _initHandlers(handlers: { frame: number; handler: (currentFrame: number) => void }[]) {
    const targetAnimation = this._animationGroup.targetedAnimations[0]?.animation
    if (!targetAnimation) {
      console.warn("AnimationController: target animation is missing")
      return
    }

    handlers.forEach((item) => {
      try {
        this.addFrameHandler(item.frame, item.handler)
      } catch (error) {
        console.error("AnimationController: failed to add handler", error)
      }
    })
  }

  /**
   * 注册每帧更新回调
   */
  private _registerFrameUpdate() {
    this._animationGroup.onAnimationGroupLoopObservable.add(() => {
      this._currentFrame = 0
    })

    this._animationGroup.onAnimationGroupEndObservable.add(() => {
      this._isPlaying = false
    })
  }

  /**
   * 添加帧事件处理器
   */
  public addFrameHandler(frame: number, handler: (currentFrame: number) => void): void {
    const targetAnimation = this._animationGroup.targetedAnimations[0]?.animation
    if (targetAnimation) {
      this._frameHandlers.set(frame, handler)
      const evt = new AnimationEvent(
        frame,
        () => {
          this._currentFrame = frame
          this.pause()
          handler(frame)
        },
        false,
      )
      targetAnimation.addEvent(evt)
    }
  }
  private _recreateAnimationEvents(): void {
    const targetAnimation = this._animationGroup.targetedAnimations[0]?.animation
    if (!targetAnimation) return
    // 重新添加事件
    this._frameHandlers.forEach((handler, frame) => {
      const evt = new AnimationEvent(
        frame,
        () => {
          this._currentFrame = frame
          this.pause()
          handler(frame)
        },
        false,
      )
      targetAnimation.addEvent(evt)
    })
  }
  /**
   * 移除帧事件处理器
   */
  public removeFrameHandler(frame: number): void {
    this._frameHandlers.delete(frame)
    // 需要重新创建动画事件列表
    this._recreateAnimationEvents()
  }

  /**
   * 播放动画
   */
  public play(speedRatio?: number): void {
    this._animationGroup.play()
    if (speedRatio) {
      this._animationGroup.speedRatio = speedRatio
    } else {
      this._animationGroup.speedRatio = this._speedRatio
    }
    this._isPlaying = true
    this._onPlayCallbacks.forEach((cb) => cb())
  }

  /**
   * 暂停动画
   */
  public pause(): void {
    this._animationGroup.pause()
    this._isPlaying = false
    this._onPauseCallbacks.forEach((cb) => cb())
  }

  /**
   * 跳转到指定帧
   */
  public gotoFrame(frame: number): void {
    // this._animationGroup.to=frame
    this._animationGroup.goToFrame(frame)
    this.pause()
    this._currentFrame = frame
  }

  /**
   * 获取当前帧
   */
  public get currentFrame(): number {
    return this._currentFrame
  }

  /**
   * 获取是否正在播放
   */
  public get isPlaying(): boolean {
    return this._isPlaying
  }

  /**
   * 添加播放回调
   */
  public onPlay(callback: () => void): void {
    this._onPlayCallbacks.push(callback)
  }

  /**
   * 添加暂停回调
   */
  public onPause(callback: () => void): void {
    this._onPauseCallbacks.push(callback)
  }

  /**
   * 销毁控制器
   */
  public dispose(): void {
    this._animationGroup.stop()
    this._frameHandlers.clear()
    this._onPlayCallbacks = []
    this._onPauseCallbacks = []
    this._animationGroup.onAnimationGroupLoopObservable.clear()
    this._animationGroup.onAnimationGroupEndObservable.clear()
  }
}
