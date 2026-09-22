import { PIPELINE_STAGES, TERMINAL_STATUSES } from '../lib/constants'
import { getPipelineIndex } from '../lib/pipeline'

export default function StepIndicator({ application }) {
  const currentIndex = getPipelineIndex(application)
  const isRejected = application.status === 'Rejected'
  const isTerminal = TERMINAL_STATUSES.includes(application.status)
  const percent = Math.round(
    ((currentIndex + 1) / PIPELINE_STAGES.length) * 100,
  )
  const stageLabel = isTerminal ? application.status : PIPELINE_STAGES[currentIndex]

  return (
    <div className="step-indicator">
      <span className="step-indicator-label">
        Step {currentIndex + 1}/{PIPELINE_STAGES.length}: {stageLabel}
      </span>
      <div className="step-indicator-track">
        <div
          className={`step-indicator-fill${isRejected ? ' step-indicator-fill-rejected' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
