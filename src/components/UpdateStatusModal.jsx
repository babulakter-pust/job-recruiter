import { useState } from 'react'
import { STATUS_LIST, INTERVIEW_STATUSES, RESULT_OPTIONS } from '../lib/constants'

const today = () => new Date().toISOString().slice(0, 10)

export default function UpdateStatusModal({ application, onSave, onClose }) {
  const [status, setStatus] = useState(application.status)
  const [date, setDate] = useState(today())
  const [note, setNote] = useState('')
  const [nextInterviewDate, setNextInterviewDate] = useState(
    application.nextInterviewDate || '',
  )
  const [result, setResult] = useState('Pending')
  const [rating, setRating] = useState('')
  const [questions, setQuestions] = useState([{ question: '', answer: '' }])

  const isInterview = INTERVIEW_STATUSES.includes(status)

  function updateQuestion(idx, field, value) {
    setQuestions((qs) =>
      qs.map((q, i) => (i === idx ? { ...q, [field]: value } : q)),
    )
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, { question: '', answer: '' }])
  }

  function removeQuestion(idx) {
    setQuestions((qs) => qs.filter((_, i) => i !== idx))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const entry = { date, status, note }
    if (isInterview) {
      entry.result = result
      entry.rating = rating === '' ? null : Number(rating)
      entry.questions = questions.filter(
        (q) => q.question.trim() || q.answer.trim(),
      )
    }

    const updated = {
      ...application,
      status,
      nextInterviewDate,
      updatedAt: new Date().toISOString(),
      timeline: [...(application.timeline || []), entry],
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
            Next Step Date (optional)
            <input
              className="input"
              type="date"
              value={nextInterviewDate}
              onChange={(e) => setNextInterviewDate(e.target.value)}
            />
          </label>

          {isInterview && (
            <div className="interview-details">
              <div className="form-row">
                <label>
                  Result
                  <select
                    className="input"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                  >
                    {RESULT_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Remarks (out of 10)
                  <input
                    className="input"
                    type="number"
                    min="0"
                    max="10"
                    step="1"
                    placeholder="e.g. 8"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </label>
              </div>

              <div className="qa-section">
                <div className="qa-header">
                  <span>Critical Questions Asked &amp; My Answers</span>
                  <button type="button" className="btn btn-small" onClick={addQuestion}>
                    + Add Question
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div className="qa-row" key={idx}>
                    <input
                      className="input"
                      placeholder="Question asked"
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(idx, 'question', e.target.value)
                      }
                    />
                    <input
                      className="input"
                      placeholder="My answer"
                      value={q.answer}
                      onChange={(e) =>
                        updateQuestion(idx, 'answer', e.target.value)
                      }
                    />
                    {questions.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => removeQuestion(idx)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <label>
            {isInterview ? 'Remarks / Notes' : 'Note (optional)'}
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
