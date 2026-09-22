import { PIPELINE_STAGES, TERMINAL_STATUSES } from '../lib/constants'
import { getPipelineIndex } from '../lib/pipeline'

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
