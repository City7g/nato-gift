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
