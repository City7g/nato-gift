import { getDeviceModel } from '../lib/device'
import { http } from './http'

const INVITE_YES_PATH = import.meta.env.VITE_INVITE_YES_PATH || '/invite/yes'

export async function sendInviteAccept() {
  if (!import.meta.env.VITE_API_URL) {
    throw new Error('VITE_API_URL is not set')
  }

  await http.post(INVITE_YES_PATH, {
    time: new Date().toISOString(),
    device: await getDeviceModel(),
  })
}

export async function sendInvite() {
  if (!import.meta.env.VITE_API_URL) {
    throw new Error('VITE_API_URL is not set')
  }

  await http.post(INVITE_YES_PATH, {
    time: new Date().toISOString(),
    method: 'enter',
    device: await getDeviceModel(),
  })
}

export async function sendEnter() {
  await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: import.meta.env.VITE_TELEGRAM_CHAT_ID,
      text: formatEvent({ type: 'enter' }),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
}

export async function sendStep(step: string, button: string) {
  await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: import.meta.env.VITE_TELEGRAM_CHAT_ID,
      text: formatEvent({ type: 'step', step, button }),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
}

export async function sendEnd() {
  await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: import.meta.env.VITE_TELEGRAM_CHAT_ID,
      text: formatEvent({ type: 'end' }),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}
function formatDevice() {
  // const ua = navigator.userAgent
  // const ios = ua.match(/OS (\d+[._]\d+)/)
  // const iphone = /iPhone/.test(ua)
  // const safari = /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua)
  // const parts = [
  //   iphone ? 'iPhone' : undefined,
  //   ios ? `iOS ${ios[1].replace('_', '.')}` : undefined,
  //   safari ? 'Safari' : undefined,
  // ].filter(Boolean)
  // return parts.join(' · ') || ua

  return navigator.userAgent + '\n\n' + JSON.stringify(navigator.userAgentData)
}
function formatEvent(event: { type: 'enter' | 'step' | 'end'; step?: string; button?: string }) {
  const title =
    event.type === 'enter'
      ? 'Зашла на сайт'
      : event.type === 'end'
        ? 'Дошла до конца'
        : `Шаг: ${event.step} · «${event.button}»`
  return [`<b>${escapeHtml(title)}</b>\n`, escapeHtml(formatDevice())].join('\n')
}
