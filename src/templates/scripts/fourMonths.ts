import ru from '../../locales/ru.json'
import type { StepConfig } from '../../lib/steps'
import type { ScriptTemplate } from './types'

export const fourMonths: ScriptTemplate = {
  id: 'four-months',
  title: '4 месяца',
  description: 'Утреннее признание и подарок на кухне',
  steps: ru.steps as StepConfig[],
}
