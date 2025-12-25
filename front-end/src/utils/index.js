import { imageBaseUrl } from '@/config'

export const getImageUrl = (path) => {
  if (!path) return ''
  return `${imageBaseUrl}/${path}`
}
