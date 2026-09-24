const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

const sendMessage = async (text: string) => {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
}

export async function sendEnter() {
  await sendMessage(formatEvent({ type: 'enter' }))
}

export async function sendStep(step: string, button: string) {
  await sendMessage(formatEvent({ type: 'step', step, button }))
}

export async function sendEnd() {
  await sendMessage(formatEvent({ type: 'end' }))
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function formatDevice() {
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
