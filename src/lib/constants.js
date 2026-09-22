// Main progression a healthy application moves through, in order.
// Used to render the LinkedIn-style progress bar.
export const PIPELINE_STAGES = [
  'Applied',
  'Online Assessment',
  'Interview 1',
  'Interview 2',
  'Interview 3',
  'HR Interview',
  'Offer',
]

// Side statuses an application can land on off the main pipeline.
export const TERMINAL_STATUSES = ['On Hold', 'Rejected', 'Withdrawn']

export const STATUS_LIST = [...PIPELINE_STAGES, ...TERMINAL_STATUSES]

export const STATUS_COLORS = {
  Applied: '#6366f1',
  'Online Assessment': '#0ea5e9',
  'Interview 1': '#8b5cf6',
  'Interview 2': '#8b5cf6',
  'Interview 3': '#8b5cf6',
  'HR Interview': '#f59e0b',
  Offer: '#22c55e',
  'On Hold': '#a8a29e',
  Rejected: '#ef4444',
  Withdrawn: '#78716c',
}

// Statuses that involve an actual interview round, so the status-update
// form knows when to show the Q&A / result / rating fields.
export const INTERVIEW_STATUSES = PIPELINE_STAGES.filter((s) =>
  s.includes('Interview'),
)

export const RESULT_OPTIONS = ['Pending', 'Passed', 'Failed']

export const RESULT_COLORS = {
  Pending: '#a8a29e',
  Passed: '#22c55e',
  Failed: '#ef4444',
}

export const ACTIVE_STATUSES = STATUS_LIST.filter(
  (s) => !['Offer', 'Rejected', 'Withdrawn'].includes(s),
)

export const STORAGE_KEY = 'job-recruiter-applications-v1'
