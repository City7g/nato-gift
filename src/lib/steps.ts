import ru from '../locales/ru.json'

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
  buttons?: StepButton[]
}

export const steps = ru.steps as StepConfig[]
