import { AbstractMesh, AnimationGroup, Vector3, Mesh } from "@babylonjs/core"
import { addHighlight, removeHighlight, click, showMeshes } from "./action"
import { createAnimeGroup } from "./animation"
import type { AnimationStep } from "./interface"
import { experimentScore } from "@/stores/experimentStore.ts"
import { formatDate } from "@/utils/timer.ts"

const store = experimentScore()
export const stepIndex = ref(1)
export const warmTips = ref("")
export const isFinished = ref(false)
export class AnimationStepManager {
  private steps: AnimationStep[] = []
  private currentStepIndex = 0
  private modelInstances: Record<string, AbstractMesh[]> = {}
  private animationGroups: Record<string, AnimationGroup> = {}
  private activeAnimations: AnimationGroup[] = []
  // private stepState: Record<number, any> = {}

  // 新增计分系统相关属性
  private stepScores: {
    startTime: string
    endTime: string
    score: number
    maxScore: number
    repeatCount: number
  }[] = []
  private totalScore = 100
  constructor() {
    isFinished.value = false
  }

  // 注册模型
  registerModel(name: string, mesh: AbstractMesh[]) {
    this.modelInstances[name] = mesh
  }

  // 添加步骤
  addStep(step: AnimationStep) {
    this.steps.push(step)
    // const stepIndex = this.steps.length - 1
    this.stepScores.push({
      startTime: "",
      endTime: "",
      score: 0,
      maxScore: 0, // 分配分数
      repeatCount: 1,
    })
  }
  // Math.floor(this.totalScore / this.steps.length)
  // 跳转到指定步骤
  async goToStep(targetIndex = stepIndex.value - 1) {
    if (targetIndex < 0 || targetIndex >= this.steps.length) return

    if (this.stepScores[this.currentStepIndex]) {
      this.stepScores[this.currentStepIndex].startTime = formatDate(new Date())
    }

    // 停止当前所有动画
    this.stopAllAnimations()
    // 执行离开当前步骤的清理
    const currentStep = this.steps[this.currentStepIndex]
    if (
      currentStep &&
      typeof currentStep.onExit === "function" &&
      this.currentStepIndex !== targetIndex
    ) {
      await currentStep.onExit()
    }
    if (warmTips.value) warmTips.value = ""
    // 更新当前步骤索引
    this.currentStepIndex = targetIndex
    const targetStep = this.steps[targetIndex]

    // 初始化步骤状态
    // if (!this.stepState[targetIndex]) {
    //   this.stepState[targetIndex] = {}
    // }

    // 执行步骤进入逻辑
    if (targetStep.onEnter) {
      await targetStep.onEnter()
      if (targetStep.warmTips) {
        warmTips.value = targetStep.warmTips
      }
    }

    // 设置模型初始状态
    this.setupModelStates(targetStep)

    // 设置交互事件
    this.setupInteractions(targetStep)
  }
  // 新增方法：获取分数报告
  getScoreReport() {
    store.report = []
    this.stepScores.forEach((e, i) => {
      store.report.push({
        index: Number(i),
        ...e,
      })
    })
  }
  public reduceStepScore(index: number) {
    this.stepScores[index - 1].score--
  }
  // 在步骤完成时更新分数（示例）

  private stopAllAnimations() {
    this.activeAnimations.forEach((anim) => anim.stop())
    this.activeAnimations = []
  }

  private setupModelStates(step: AnimationStep) {
    // 设置模型可见性、位置等初始状态
    Object.keys(this.modelInstances).forEach((name) => {
      const model = this.modelInstances[name]
      model[0].setEnabled(step.models[name]?.visible ?? true)
    })

    // 应用模型初始位置/旋转等
    Object.entries(step.models).forEach(([name, config]) => {
      const model = this.modelInstances[name]
      if (!model) return

      if (config.position) model[0].position = Vector3.FromArray(config.position)
      if (config.rotation) model[0].rotation = Vector3.FromArray(config.rotation)
      if (config.scaling) model[0].scaling = Vector3.FromArray(config.scaling)
      if (config?.visible !== undefined) showMeshes(model, config.visible)
    })
  }

  private setupInteractions(step: AnimationStep) {
    // 清除旧的高亮和点击事件
    removeHighlight()

    // 设置新的交互
    step.interactions?.forEach((interaction) => {
      if (!interaction.modelName) return
      const mesh = this.modelInstances[interaction.modelName]
      if (!mesh) return

      // 添加高亮
      addHighlight(mesh as Mesh[])

      // 添加点击事件
      click(
        mesh as Mesh[],
        async () => {
          if (interaction.onClick) {
            await interaction.onClick()
          }
          // 执行关联动画
          if (interaction.animations && interaction.animations.length) {
            const animGroup = createAnimeGroup(
              `step-${this.currentStepIndex}-${interaction.modelName}-ani`,
              interaction.animations,
            )
            if (interaction.animationRange && interaction.animationRange.length === 2) {
              animGroup.normalize(...interaction.animationRange)
            } else {
              animGroup.normalize(0)
            }

            // if (interaction.animationSpeedRatio) {
            //   animGroup.speedRatio = interaction.animationSpeedRatio
            // }

            animGroup.start()
            this.activeAnimations.push(animGroup)

            animGroup.onAnimationGroupEndObservable.add(async () => {
              if (step?.onEnd && typeof step.onEnd === "function") {
                await step.onEnd()
              }
              await this.handleStepCompletion(step) // 判断是否结束并执行方法
            })
          } else {
            await this.handleStepCompletion(step) // 判断是否结束并执行方法
          }
        },
        () => {
          this.stepScores[this.currentStepIndex].score--
          this.stepScores[this.currentStepIndex].repeatCount++
        },
      )
    })
  }

  private async handleStepCompletion(step: AnimationStep) {
    // 可以根据完成情况调整分数
    // 例如：如果用户操作正确可以给满分，错误可以扣分
    this.stepScores[this.currentStepIndex].endTime = formatDate(new Date())
    if (this.currentStepIndex === this.steps.length - 1) {
      this.getScoreReport()
      isFinished.value = true
    } else {
      this.currentStepIndex++
      stepIndex.value++
      this.goToStep(this.currentStepIndex)
    }
  }
  dispose() {
    // 停止并释放所有激活的动画组
    this.stopAllAnimations()
    this.activeAnimations.forEach((animGroup) => {
      animGroup.dispose()
    })
    this.activeAnimations = []

    // 清除动画组缓存
    Object.values(this.animationGroups).forEach((animGroup) => {
      animGroup.dispose()
    })
    this.animationGroups = {}

    // 移除所有模型引用
    this.modelInstances = {}

    // 清空步骤列表
    this.steps = []

    // 移除高亮和交互
    removeHighlight() // 假设这个函数可以安全调用多次
  }
}
