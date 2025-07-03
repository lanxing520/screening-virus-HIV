class AudioPlayer {
  private audio: HTMLAudioElement | null = null
  private isPlaying: boolean = false
  private currentFilePath: string | null = null
  private static instances: AudioPlayer[] = []
  private onEndedCallback: (() => void) | null = null // 新增：用于存储回调

  constructor() {
    AudioPlayer.instances.push(this)
  }
  /**
   * 加载并准备播放音频文件
   * @param filePath - 音频文件的URL或base64数据
   */
  private load(filePath: string): void {
    if (this.audio) {
      this.audio.pause()
      this.audio = null
    }

    this.audio = new Audio(filePath)
    this.audio.preload = "auto"
    this.currentFilePath = filePath

    this.audio.onerror = (error) => {
      this.isPlaying = false
      console.error("音频播放出错:", error)
      this.handleError(error)
    }

    this.audio.onended = () => {
      this.isPlaying = false
      if (this.onEndedCallback) {
        this.onEndedCallback()
      }
    }
  }
  /**
   * 播放音频（如果传入新文件路径会自动切换）
   * @param filePath - 可选，音频文件的URL或base64数据
   */
  play(filePath?: string): void {
    if (filePath === this.currentFilePath) return
    // 如果有传入新文件路径或当前没有加载音频
    if (filePath && filePath !== this.currentFilePath) {
      this.stop() // 停止当前播放
      this.load(filePath) // 加载新音频
      this.currentFilePath = filePath
    }

    if (!this.audio) {
      console.warn("没有加载音频文件")
      return
    }

    if (this.isPlaying) {
      this.resume()
      return
    }

    this.audio
      .play()
      .then(() => {
        console.log("开始播放音频:", filePath)
        this.isPlaying = true
      })
      .catch((error) => {
        console.error("播放失败:", error)
        this.handleError(error)
      })
  }
  /**
   * 设置音频播放结束时的回调
   * @param callback - 回调函数
   */
  setOnEnded(callback: () => void): void {
    this.onEndedCallback = callback
  }
  /**
   * 暂停播放
   */
  pause(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause()
      this.isPlaying = false
    }
  }

  /**
   * 恢复播放
   */
  resume(): void {
    if (this.audio && !this.isPlaying) {
      this.audio
        .play()
        .then(() => {
          this.isPlaying = true
        })
        .catch((error) => {
          console.error("恢复播放失败:", error)
          this.handleError(error)
        })
    }
  }

  /**
   * 停止播放
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
      this.isPlaying = false
    }
  }
  /**
   * 停止所有正在播放的音频实例
   */
  static stopAll(): void {
    for (const instance of AudioPlayer.instances) {
      instance.stop()
    }
  }
  /**
   * 设置音量
   * @param volume - 音量值 (0.0 到 1.0)
   */
  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume))
    }
  }

  /**
   * 获取当前是否正在播放
   */
  isPlayingStatus(): boolean {
    return this.isPlaying
  }

  /**
   * 销毁播放器释放资源
   */
  destroy(): void {
    if (this.audio) {
      this.audio.pause()
      this.audio.onerror = null
      this.audio.onended = null
      this.audio = null
    }

    // 从 instances 中移除自身
    const index = AudioPlayer.instances.indexOf(this)
    if (index > -1) {
      AudioPlayer.instances.splice(index, 1)
    }

    this.currentFilePath = null
    this.isPlaying = false
  }

  /**
   * 错误处理
   * @param error - 错误信息
   */
  private handleError(error: unknown): void {
    if (error instanceof DOMException) {
      switch (error.code) {
        case DOMException.NOT_SUPPORTED_ERR:
          console.warn("浏览器不支持自动播放音频")
          break
        default:
          console.warn("音频播放异常:", error.message)
      }
    } else {
      console.warn("未知音频播放错误")
    }
  }
}

export { AudioPlayer }
