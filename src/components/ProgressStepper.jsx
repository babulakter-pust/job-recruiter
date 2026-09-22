import { PIPELINE_STAGES, TERMINAL_STATUSES } from '../lib/constants'

// Figures out how far along the main pipeline this application got, even
// if it ultimately ended off-pipeline (Rejected / Withdrawn / On Hold).
function getPipelineIndex(application) {
  if (PIPELINE_STAGES.includes(application.status)) {
    return PIPELINE_STAGES.indexOf(application.status)
  }

  const timeline = application.timeline || []
  for (let i = timeline.length - 1; i >= 0; i -= 1) {
    if (PIPELINE_STAGES.includes(timeline[i].status)) {
      return PIPELINE_STAGES.indexOf(timeline[i].status)
    }
  }
  return 0
}

export default function ProgressStepper({ application }) {
  const currentIndex = getPipelineIndex(application)
  const isTerminal = TERMINAL_STATUSES.includes(application.status)
  const isRejected = application.status === 'Rejected'

  return (
    <div className="stepper">
      {PIPELINE_STAGES.map((stage, idx) => {
        let state = 'upcoming'
        if (idx < currentIndex) state = 'done'
        else if (idx === currentIndex) state = isRejected ? 'rejected' : 'current'

        return (
          <div className={`stepper-step stepper-${state}`} key={stage}>
            <div className="stepper-dot">
              {state === 'done' && '✓'}
              {state === 'rejected' && '✕'}
            </div>
            <div className="stepper-label">{stage}</div>
            {idx < PIPELINE_STAGES.length - 1 && (
              <div
                className={`stepper-line ${idx < currentIndex ? 'stepper-line-done' : ''}`}
              />
            )}
          </div>
        )
      })}
      {isTerminal && !isRejected && (
        <span className={`stepper-tag stepper-tag-${application.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {application.status}
        </span>
      )}
    </div>
  )
}
