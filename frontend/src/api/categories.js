import { client } from './client'

export function listCategories() {
  return client.get('/categories').then((r) => r.data)
}

export function createCategory({ name, parentId }) {
  return client.post('/categories', { name, parentId: parentId || null }).then((r) => r.data)
}
