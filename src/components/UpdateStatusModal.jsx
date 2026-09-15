import { useState } from 'react'
import { STATUS_LIST } from '../lib/constants'

const today = () => new Date().toISOString().slice(0, 10)

export default function UpdateStatusModal({ application, onSave, onClose }) {
  const [status, setStatus] = useState(application.status)
  const [date, setDate] = useState(today())
  const [note, setNote] = useState('')
  const [nextInterviewDate, setNextInterviewDate] = useState(
    application.nextInterviewDate || '',
  )

  function handleSubmit(e) {
    e.preventDefault()
    const updated = {
      ...application,
      status,
      nextInterviewDate,
      updatedAt: new Date().toISOString(),
      timeline: [...(application.timeline || []), { date, status, note }],
    }
    onSave(updated)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Update Status</h2>
        <p className="modal-subtitle">
          {application.position} @ {application.company}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              New Status
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>

          <label>
            Next Interview Date (optional)
            <input
              className="input"
              type="date"
              value={nextInterviewDate}
              onChange={(e) => setNextInterviewDate(e.target.value)}
            />
          </label>

          <label>
            Note (optional)
            <textarea
              className="input"
              rows={2}
              placeholder="e.g. Passed technical round, HR round scheduled"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
