import StatusBadge from './StatusBadge'
import StepIndicator from './StepIndicator'

export default function ApplicationRow({ application, onDetails }) {
  return (
    <div className="app-row" onClick={() => onDetails(application)}>
      <div className="row-title">
        <span className="row-position">{application.position}</span>
        <span className="row-company">{application.company}</span>
      </div>

      <StatusBadge status={application.status} />

      <StepIndicator application={application} />

      <button
        className="btn btn-small btn-primary row-details-btn"
        onClick={(e) => {
          e.stopPropagation()
          onDetails(application)
        }}
      >
        Details
      </button>
    </div>
  )
}
