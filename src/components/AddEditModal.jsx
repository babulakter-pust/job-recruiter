import { useState } from 'react'
import { makeId } from '../lib/storage'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  company: '',
  position: '',
  jobLink: '',
  location: '',
  appliedDate: today(),
  salary: '',
  notes: '',
}

export default function AddEditModal({ application, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    application
      ? {
          company: application.company,
          position: application.position,
          jobLink: application.jobLink || '',
          location: application.location || '',
          appliedDate: application.appliedDate,
          salary: application.salary || '',
          notes: application.notes || '',
        }
      : emptyForm,
  )

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.company.trim() || !form.position.trim()) return

    if (application) {
      onSave({ ...application, ...form })
    } else {
      const now = new Date().toISOString()
      onSave({
        id: makeId(),
        ...form,
        status: 'Applied',
        nextInterviewDate: '',
        timeline: [{ date: form.appliedDate, status: 'Applied', note: '' }],
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{application ? 'Edit Application' : 'Add Application'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Company *
              <input
                className="input"
                required
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
              />
            </label>
            <label>
              Position *
              <input
                className="input"
                required
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Applied Date *
              <input
                className="input"
                type="date"
                required
                value={form.appliedDate}
                onChange={(e) => update('appliedDate', e.target.value)}
              />
            </label>
            <label>
              Location
              <input
                className="input"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Job Link
              <input
                className="input"
                type="url"
                placeholder="https://..."
                value={form.jobLink}
                onChange={(e) => update('jobLink', e.target.value)}
              />
            </label>
            <label>
              Salary / Notes on pay
              <input
                className="input"
                value={form.salary}
                onChange={(e) => update('salary', e.target.value)}
              />
            </label>
          </div>

          <label>
            Notes
            <textarea
              className="input"
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {application ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
