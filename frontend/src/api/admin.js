import { client } from './client'

export function getSellers() {
  return client.get('/admin/sellers').then((response) => response.data)
}

export function approveSeller(id) {
  return client.put(`/admin/sellers/${id}/approve`).then((response) => response.data)
}

export function suspendSeller(id) {
  return client.put(`/admin/sellers/${id}/suspend`).then((response) => response.data)
}