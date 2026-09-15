import { useEffect, useMemo, useState } from 'react'
import StatsBar from './components/StatsBar'
import Toolbar from './components/Toolbar'
import ApplicationCard from './components/ApplicationCard'
import AddEditModal from './components/AddEditModal'
import UpdateStatusModal from './components/UpdateStatusModal'
import ConfirmDialog from './components/ConfirmDialog'
import {
  loadApplications,
  saveApplications,
  exportApplicationsToFile,
  importApplicationsFromFile,
} from './lib/storage'
import './App.css'

function daysUntil(dateStr) {
  if (!dateStr) return Infinity
  const target = new Date(dateStr)
  if (Number.isNaN(target.getTime())) return Infinity
  return target.getTime()
}

function App() {
  const [applications, setApplications] = useState(() => loadApplications())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated-desc')

  const [editingApp, setEditingApp] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [statusTargetApp, setStatusTargetApp] = useState(null)
  const [deleteTargetApp, setDeleteTargetApp] = useState(null)

  useEffect(() => {
    saveApplications(applications)
  }, [applications])

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
          return daysUntil(a.nextInterviewDate) - daysUntil(b.nextInterviewDate)
        case 'company':
          return a.company.localeCompare(b.company)
        case 'updated-desc':
        default:
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      }
    })

    return list
  }, [applications, search, statusFilter, sortBy])

  function handleSaveNewOrEdited(app) {
    setApplications((prev) => {
      const exists = prev.some((a) => a.id === app.id)
      if (exists) {
        return prev.map((a) => (a.id === app.id ? app : a))
      }
      return [app, ...prev]
    })
    setEditingApp(null)
    setShowAddModal(false)
  }

  function handleStatusUpdate(app) {
    setApplications((prev) => prev.map((a) => (a.id === app.id ? app : a)))
    setStatusTargetApp(null)
  }

  function handleDelete() {
    setApplications((prev) => prev.filter((a) => a.id !== deleteTargetApp.id))
    setDeleteTargetApp(null)
  }

  async function handleImport(file) {
    try {
      const imported = await importApplicationsFromFile(file)
      const proceed = window.confirm(
        `Import ${imported.length} application(s)? This will replace your current data.`,
      )
      if (proceed) setApplications(imported)
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <div className="app">
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
        onAddNew={() => setShowAddModal(true)}
        onExport={() => exportApplicationsToFile(applications)}
        onImport={handleImport}
      />

      {visibleApplications.length === 0 ? (
        <div className="empty-state">
          {applications.length === 0
            ? 'No applications yet. Click "Add Application" to get started.'
            : 'No applications match your filters.'}
        </div>
      ) : (
        <div className="card-grid">
          {visibleApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={setEditingApp}
              onUpdateStatus={setStatusTargetApp}
              onDelete={setDeleteTargetApp}
            />
          ))}
        </div>
      )}

      {(showAddModal || editingApp) && (
        <AddEditModal
          application={editingApp}
          onSave={handleSaveNewOrEdited}
          onClose={() => {
            setEditingApp(null)
            setShowAddModal(false)
          }}
        />
      )}

      {statusTargetApp && (
        <UpdateStatusModal
          application={statusTargetApp}
          onSave={handleStatusUpdate}
          onClose={() => setStatusTargetApp(null)}
        />
      )}

      {deleteTargetApp && (
        <ConfirmDialog
          message={`Delete the application for "${deleteTargetApp.position}" at "${deleteTargetApp.company}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTargetApp(null)}
        />
      )}
    </div>
  )
}

export default App
