import type { Invite, InviteDraft, VisitEvent, VisitEventInput } from '../lib/invite'
import { http } from './http'
import { localApi } from './local'
import { clearToken, getToken, setToken } from './token'

const useHttp = import.meta.env.VITE_USE_API === 'true' && Boolean(import.meta.env.VITE_API_URL)

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(code: string) {
  if (!useHttp) {
    setToken(localApi.login(code))
    return
  }

  const { data } = await http.post<{ token: string }>('/api/login', { code })
  setToken(data.token)
}

export function logout() {
  clearToken()
}

export async function listInvites() {
  if (!useHttp) return localApi.listInvites(getToken())
  const { data } = await http.get<Invite[]>('/api/invites')
  return data
}

export async function getInvite(id: string) {
  if (!useHttp) return localApi.getInvite(getToken(), id)
  const invites = await listInvites()
  const invite = invites.find((item) => item.id === id)
  if (!invite) throw new Error('Приглашение не найдено')
  return invite
}

export async function getInviteBySlug(slug: string) {
  if (!useHttp) return localApi.getInviteBySlug(slug)
  const { data } = await http.get<Invite>(`/api/invites/${slug}`)
  return data
}

export async function createInvite(draft: InviteDraft) {
  if (!useHttp) return localApi.createInvite(getToken(), draft)
  const { data } = await http.post<Invite>('/api/invites', draft)
  return data
}

export async function updateInvite(id: string, draft: InviteDraft) {
  if (!useHttp) return localApi.updateInvite(getToken(), id, draft)
  const { data } = await http.patch<Invite>(`/api/invites/${id}`, draft)
  return data
}

export async function deleteInvite(id: string) {
  if (!useHttp) {
    localApi.deleteInvite(getToken(), id)
    return
  }
  await http.delete(`/api/invites/${id}`)
}

export async function trackEvent(slug: string, input: VisitEventInput) {
  if (!useHttp) return localApi.addEvent(slug, input)
  const { data } = await http.post<VisitEvent>(`/api/invites/${slug}/events`, input)
  return data
}

export async function listEvents(inviteId: string) {
  if (!useHttp) return localApi.listEvents(getToken(), inviteId)
  const { data } = await http.get<VisitEvent[]>(`/api/invites/${inviteId}/events`)
  return data
}
