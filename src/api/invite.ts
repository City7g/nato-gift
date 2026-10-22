import { closeVisit, trackEvent } from './client'
import { getDeviceInfo, serializeDevice } from '../lib/device'
import { getSessionId, rememberVisit, takeLeave } from '../lib/session'

let listening = false

function listenForLeave() {
  if (listening) return
  listening = true
  window.addEventListener('pagehide', () => {
    const leave = takeLeave()
    if (!leave) return
    closeVisit(leave.slug, {
      sessionId: leave.sessionId,
      type: 'leave',
      device: leave.device,
    })
  })
}

async function send(slug: string, type: 'enter' | 'step' | 'end', step?: string, button?: string) {
  const device = serializeDevice(await getDeviceInfo())
  const sessionId = getSessionId()
  rememberVisit(slug, device)
  listenForLeave()

  await trackEvent(slug, {
    sessionId,
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
