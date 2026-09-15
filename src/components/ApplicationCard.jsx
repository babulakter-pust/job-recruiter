import { useState } from 'react'
import StatusBadge from './StatusBadge'

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
}) {
  const [showTimeline, setShowTimeline] = useState(false)
  const nextInterviewDays = daysUntil(application.nextInterviewDate)

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{application.position}</h3>
          <div className="card-subtitle">{application.company}</div>
        </div>
        <StatusBadge status={application.status} />
      </div>

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

      {application.notes && <p className="card-notes">{application.notes}</p>}

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
                <span className="timeline-date">{formatDate(entry.date)}</span>
                <StatusBadge status={entry.status} />
                {entry.note && <span className="timeline-note">{entry.note}</span>}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
