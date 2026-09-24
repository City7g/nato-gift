import { getDeviceModel } from '../lib/device'
import { getSessionId } from '../lib/session'
import { trackEvent } from './client'

async function send(slug: string, type: 'enter' | 'step' | 'end', step?: string, button?: string) {
  const device = await getDeviceModel()
  await trackEvent(slug, {
    sessionId: getSessionId(),
    type,
    step,
    button,
    device,
  })
}

export function sendEnter(slug: string) {
  return send(slug, 'enter')
}

export function sendStep(slug: string, step: string, button: string) {
  return send(slug, 'step', step, button)
}

export function sendEnd(slug: string) {
  return send(slug, 'end')
}
