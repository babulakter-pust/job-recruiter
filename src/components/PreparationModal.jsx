import { useState } from 'react'
import { makeId } from '../lib/storage'

export default function PreparationModal({ application, onSave, onClose }) {
  const [items, setItems] = useState(() =>
    application.preparation?.length
      ? application.preparation
      : [{ id: makeId(), question: '', answer: '', ready: false }],
  )

  const readyCount = items.filter((i) => i.ready).length
  const total = items.length
  const percent = total ? Math.round((readyCount / total) * 100) : 0

  function updateItem(id, field, value) {
    setItems((list) =>
      list.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    )
  }

  function addItem() {
    setItems((list) => [
      ...list,
      { id: makeId(), question: '', answer: '', ready: false },
    ])
  }

  function removeItem(id) {
    setItems((list) => list.filter((i) => i.id !== id))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const cleaned = items.filter(
      (i) => i.question.trim() || i.answer.trim(),
    )
    onSave({
      ...application,
      preparation: cleaned,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Interview Preparation</h2>
        <p className="modal-subtitle">
          {application.position} @ {application.company}
        </p>

        <div className="prep-progress">
          <div className="prep-progress-track">
            <div
              className="prep-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="prep-progress-label">
            {readyCount} / {total} ready ({percent}%)
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="prep-list">
            {items.map((item) => (
              <div className="prep-item" key={item.id}>
                <div className="prep-item-fields">
                  <textarea
                    className="input"
                    rows={2}
                    placeholder="Question to prepare for..."
                    value={item.question}
                    onChange={(e) =>
                      updateItem(item.id, 'question', e.target.value)
                    }
                  />
                  <textarea
                    className="input"
                    rows={2}
                    placeholder="My prepared answer..."
                    value={item.answer}
                    onChange={(e) =>
                      updateItem(item.id, 'answer', e.target.value)
                    }
                  />
                </div>
                <div className="prep-item-actions">
                  <label className="prep-ready-toggle">
                    <input
                      type="checkbox"
                      checked={item.ready}
                      onChange={(e) =>
                        updateItem(item.id, 'ready', e.target.checked)
                      }
                    />
                    Ready
                  </label>
                  <button
                    type="button"
                    className="btn btn-small btn-danger"
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn-small" onClick={addItem}>
            + Add Question
          </button>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Preparation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
