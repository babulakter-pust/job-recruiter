import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import ProgressStepper from '../components/ProgressStepper'
import { RESULT_COLORS } from '../lib/constants'
import { formatDate, daysUntil } from '../lib/format'

export default function DetailsPage({
  applications,
  onEdit,
  onUpdateStatus,
  onPrepare,
  onDelete,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showTimeline, setShowTimeline] = useState(true)

  const application = applications.find((a) => a.id === id)

  if (!application) {
    return (
      <div className="details-page">
        <button className="btn back-btn" onClick={() => navigate('/')}>
          ← Back to list
        </button>
        <div className="empty-state">
          This application no longer exists.{' '}
          <Link to="/">Go back to the list.</Link>
        </div>
      </div>
    )
  }

  const nextInterviewDays = daysUntil(application.nextInterviewDate)
  const prepItems = application.preparation || []
  const prepReadyCount = prepItems.filter((i) => i.ready).length

  return (
    <div className="details-page">
      <button className="btn back-btn" onClick={() => navigate('/')}>
        ← Back to list
      </button>

      <div className="card-header">
        <div>
          <h2 className="card-title">{application.position}</h2>
          <div className="card-subtitle">{application.company}</div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <ProgressStepper application={application} />

      <div className="card-meta">
        <span>Applied: {formatDate(application.appliedDate)}</span>
        {application.location && <span>{application.location}</span>}
        {application.salary && <span>{application.salary}</span>}
        {application.jobLink && (
          <a href={application.jobLink} target="_blank" rel="noreferrer">
            Job Link ↗
          </a>
        )}
      </div>

      {application.nextInterviewDate && (
        <div
          className={
            'next-interview' +
            (nextInterviewDays !== null && nextInterviewDays < 0
              ? ' overdue'
              : '')
          }
        >
          Next interview: {formatDate(application.nextInterviewDate)}
          {nextInterviewDays !== null &&
            (nextInterviewDays >= 0
              ? ` (in ${nextInterviewDays} day${nextInterviewDays === 1 ? '' : 's'})`
              : ' (past)')}
        </div>
      )}

      {application.description && (
        <p className="card-notes">{application.description}</p>
      )}

      <div className="card-actions">
        <button
          className="btn btn-small btn-primary"
          onClick={() => onUpdateStatus(application)}
        >
          Update Status
        </button>
        <button className="btn btn-small" onClick={() => onPrepare(application)}>
          Prep {prepItems.length > 0 ? `(${prepReadyCount}/${prepItems.length})` : ''}
        </button>
        <button className="btn btn-small" onClick={() => onEdit(application)}>
          Edit
        </button>
        <button
          className="btn btn-small btn-danger"
          onClick={() => onDelete(application)}
        >
          Delete
        </button>
        <button
          className="btn btn-small"
          onClick={() => setShowTimeline((v) => !v)}
        >
          {showTimeline ? 'Hide Timeline' : `Timeline (${application.timeline?.length || 0})`}
        </button>
      </div>

      {showTimeline && (
        <ul className="timeline">
          {(application.timeline || [])
            .slice()
            .reverse()
            .map((entry, idx) => (
              <li key={idx}>
                <div className="timeline-row">
                  <span className="timeline-date">{formatDate(entry.date)}</span>
                  <StatusBadge status={entry.status} />
                  {entry.result && (
                    <span
                      className="result-badge"
                      style={{ color: RESULT_COLORS[entry.result] }}
                    >
                      {entry.result}
                    </span>
                  )}
                  {(entry.rating || entry.rating === 0) && (
                    <span className="rating-badge">{entry.rating}/10</span>
                  )}
                  {entry.note && (
                    <span className="timeline-note">{entry.note}</span>
                  )}
                </div>
                {entry.questions?.length > 0 && (
                  <ul className="qa-list">
                    {entry.questions.map((q, qIdx) => (
                      <li key={qIdx}>
                        <strong>Q:</strong> {q.question}
                        {q.answer && (
                          <>
                            {' '}
                            <strong>A:</strong> {q.answer}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
