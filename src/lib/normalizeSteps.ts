import { isStepEnabled, type StepButton, type StepConfig } from './steps'

export function cloneSteps(steps: StepConfig[]): StepConfig[] {
  return structuredClone(steps).map((step) => ({
    ...step,
    enabled: step.enabled !== false,
  }))
}

function nextEnabledId(steps: StepConfig[], fromId: string) {
  const index = steps.findIndex((step) => step.step === fromId)
  const rest = index === -1 ? steps : steps.slice(index + 1)
  return rest.find(isStepEnabled)?.step
}

function rewireButton(button: StepButton, enabledIds: Set<string>, fallback?: string): StepButton {
  if (!button.route || enabledIds.has(button.route)) return button
  if (!fallback) {
    return { ...button, route: undefined }
  }
  return { ...button, route: fallback }
}

export function normalizeSteps(steps: StepConfig[]): StepConfig[] {
  const enabled = steps.filter(isStepEnabled)
  const enabledIds = new Set(enabled.map((step) => step.step))
  const lastId = enabled.at(-1)?.step

  return steps.map((step) => {
    const fallback = nextEnabledId(steps, step.step)
    const buttons = step.buttons?.map((button) => rewireButton(button, enabledIds, fallback))
    const active = isStepEnabled(step)

    return {
      ...step,
      celebrate: active && step.step === lastId,
      buttons: active && step.step === lastId ? undefined : buttons,
    }
  })
}

export function publicSteps(steps: StepConfig[]) {
  return normalizeSteps(steps).filter(isStepEnabled)
}
