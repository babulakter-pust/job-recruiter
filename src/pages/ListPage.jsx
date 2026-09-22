import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatsBar from '../components/StatsBar'
import Toolbar from '../components/Toolbar'
import ApplicationRow from '../components/ApplicationRow'

function sortKeyForDate(dateStr) {
  if (!dateStr) return Infinity
  const target = new Date(dateStr)
  if (Number.isNaN(target.getTime())) return Infinity
  return target.getTime()
}

export default function ListPage({ applications, onAddNew, onExport, onImport }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated-desc')

  const visibleApplications = useMemo(() => {
    let list = applications

    if (statusFilter !== 'all') {
      list = list.filter((a) => a.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q),
      )
    }

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'applied-desc':
          return new Date(b.appliedDate) - new Date(a.appliedDate)
        case 'applied-asc':
          return new Date(a.appliedDate) - new Date(b.appliedDate)
        case 'next-interview':
          return (
            sortKeyForDate(a.nextInterviewDate) -
            sortKeyForDate(b.nextInterviewDate)
          )
        case 'company':
          return a.company.localeCompare(b.company)
        case 'updated-desc':
        default:
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      }
    })

    return list
  }, [applications, search, statusFilter, sortBy])

  return (
    <>
      <header className="app-header">
        <h1>Job Application Tracker</h1>
        <p className="app-subtitle">
          Track every application from applied to offer — stored locally in
          your browser.
        </p>
      </header>

      <StatsBar applications={applications} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onAddNew={onAddNew}
        onExport={onExport}
        onImport={onImport}
      />

      {visibleApplications.length === 0 ? (
        <div className="empty-state">
          {applications.length === 0
            ? 'No applications yet. Click "Add Application" to get started.'
            : 'No applications match your filters.'}
        </div>
      ) : (
        <div className="app-list">
          {visibleApplications.map((app) => (
            <ApplicationRow
              key={app.id}
              application={app}
              onDetails={(a) => navigate(`/application/${a.id}`)}
            />
          ))}
        </div>
      )}
    </>
  )
}
