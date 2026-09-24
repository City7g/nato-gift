import { askOut } from './askOut'
import { chase } from './chase'
import { fourMonths } from './fourMonths'
import type { ScriptTemplate } from './types'

export const scripts: ScriptTemplate[] = [fourMonths, askOut, chase]

export function findScript(id: string) {
  return scripts.find((script) => script.id === id) ?? scripts[0]
}
