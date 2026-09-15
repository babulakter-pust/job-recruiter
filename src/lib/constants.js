export const STATUS_LIST = [
  'Applied',
  'Online Assessment',
  'Interview Scheduled',
  'Round 1',
  'Round 2',
  'Round 3',
  'Round 4',
  'Round 5',
  'Offer',
  'On Hold',
  'Rejected',
  'Withdrawn',
]

export const STATUS_COLORS = {
  Applied: '#6366f1',
  'Online Assessment': '#0ea5e9',
  'Interview Scheduled': '#8b5cf6',
  'Round 1': '#f59e0b',
  'Round 2': '#f59e0b',
  'Round 3': '#f59e0b',
  'Round 4': '#f59e0b',
  'Round 5': '#f59e0b',
  Offer: '#22c55e',
  'On Hold': '#a8a29e',
  Rejected: '#ef4444',
  Withdrawn: '#78716c',
}

export const ACTIVE_STATUSES = STATUS_LIST.filter(
  (s) => !['Offer', 'Rejected', 'Withdrawn'].includes(s),
)

export const STORAGE_KEY = 'job-recruiter-applications-v1'
