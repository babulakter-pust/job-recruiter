import { useState } from 'react'
import StatusBadge from './StatusBadge'
import ProgressStepper from './ProgressStepper'
import { RESULT_COLORS } from '../lib/constants'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  if (Number.isNaN(target.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / 86400000)
}

export default function ApplicationCard({
  application,
  onEdit,
  onUpdateStatus,
  onDelete,
  onPrepare,
}) {
  const [showTimeline, setShowTimeline] = useState(false)
  const nextInterviewDays = daysUntil(application.nextInterviewDate)
  const prepItems = application.preparation || []
  const prepReadyCount = prepItems.filter((i) => i.ready).length

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{application.position}</h3>
          <div className="card-subtitle">{application.company}</div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <ProgressStepper application={application} />

      <div className="card-meta">
        <span>Applied: {formatDate(application.appliedDate)}</span>
        {application.location && <span>{application.location}</span>}
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
          className="btn btn-small"
          onClick={() => setShowTimeline((v) => !v)}
        >
          {showTimeline ? 'Hide Timeline' : `Timeline (${application.timeline?.length || 0})`}
        </button>
        <button className="btn btn-small btn-primary" onClick={() => onUpdateStatus(application)}>
          Update Status
        </button>
        <button className="btn btn-small" onClick={() => onPrepare(application)}>
          Prep {prepItems.length > 0 ? `(${prepReadyCount}/${prepItems.length})` : ''}
        </button>
        <button className="btn btn-small" onClick={() => onEdit(application)}>
          Edit
        </button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(application)}>
          Delete
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
