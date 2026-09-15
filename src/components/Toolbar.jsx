import { useRef } from 'react'
import { STATUS_LIST } from '../lib/constants'

export default function Toolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  onAddNew,
  onExport,
  onImport,
}) {
  const fileInputRef = useRef(null)

  return (
    <div className="toolbar">
      <input
        className="input search-input"
        type="text"
        placeholder="Search company or position..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className="input"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="all">All Statuses</option>
        {STATUS_LIST.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className="input"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        <option value="updated-desc">Recently Updated</option>
        <option value="applied-desc">Applied Date (newest)</option>
        <option value="applied-asc">Applied Date (oldest)</option>
        <option value="next-interview">Upcoming Interview</option>
        <option value="company">Company (A-Z)</option>
      </select>

      <div className="toolbar-spacer" />

      <button className="btn btn-secondary" onClick={onExport}>
        Export JSON
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => fileInputRef.current?.click()}
      >
        Import JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onImport(file)
          e.target.value = ''
        }}
      />
      <button className="btn btn-primary" onClick={onAddNew}>
        + Add Application
      </button>
    </div>
  )
}
