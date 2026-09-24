export type StepButton =
  | {
      text: string
      route?: string
      decorate?: false
    }
  | {
      text: string[]
      route?: string
      decorate: true
    }

export type StepConfig = {
  step: string
  text: string
  subtitle?: string
  celebrate?: boolean
  enabled?: boolean
  buttons?: StepButton[]
}

export function isStepEnabled(step: StepConfig) {
  return step.enabled !== false
}
