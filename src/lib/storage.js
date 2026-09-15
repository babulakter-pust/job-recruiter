import { STORAGE_KEY } from './constants'

export function loadApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveApplications(applications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
}

export function exportApplicationsToFile(applications) {
  const blob = new Blob([JSON.stringify(applications, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const today = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `job-applications-${today}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function importApplicationsFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!Array.isArray(parsed)) {
          reject(new Error('JSON file must contain an array of applications.'))
          return
        }
        resolve(parsed)
      } catch {
        reject(new Error('Could not parse JSON file.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsText(file)
  })
}

export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
