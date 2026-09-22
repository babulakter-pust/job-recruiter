import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom'
import ListPage from './pages/ListPage'
import DetailsPage from './pages/DetailsPage'
import LoginPage from './pages/LoginPage'
import AddEditModal from './components/AddEditModal'
import UpdateStatusModal from './components/UpdateStatusModal'
import PreparationModal from './components/PreparationModal'
import ConfirmDialog from './components/ConfirmDialog'
import {
  loadApplications,
  saveApplications,
  exportApplicationsToFile,
  importApplicationsFromFile,
} from './lib/storage'
import { isAuthenticated, logout } from './lib/auth'
import './App.css'

function AppShell() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(() => isAuthenticated())
  const [applications, setApplications] = useState(() => loadApplications())

  const [editingApp, setEditingApp] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [statusTargetApp, setStatusTargetApp] = useState(null)
  const [prepTargetApp, setPrepTargetApp] = useState(null)
  const [deleteTargetApp, setDeleteTargetApp] = useState(null)

  useEffect(() => {
    saveApplications(applications)
  }, [applications])

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

  function handlePrepSave(app) {
    setApplications((prev) => prev.map((a) => (a.id === app.id ? app : a)))
    setPrepTargetApp(null)
  }

  function handleDelete() {
    setApplications((prev) => prev.filter((a) => a.id !== deleteTargetApp.id))
    setDeleteTargetApp(null)
    navigate('/')
  }

  function handleLogout() {
    logout()
    setAuthed(false)
    navigate('/')
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

  if (!authed) {
    return (
      <div className="app">
        <LoginPage onLogin={() => setAuthed(true)} />
      </div>
    )
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <ListPage
              applications={applications}
              onAddNew={() => setShowAddModal(true)}
              onExport={() => exportApplicationsToFile(applications)}
              onImport={handleImport}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/application/:id"
          element={
            <DetailsPage
              applications={applications}
              onEdit={setEditingApp}
              onUpdateStatus={setStatusTargetApp}
              onPrepare={setPrepTargetApp}
              onDelete={setDeleteTargetApp}
            />
          }
        />
      </Routes>

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

      {prepTargetApp && (
        <PreparationModal
          application={prepTargetApp}
          onSave={handlePrepSave}
          onClose={() => setPrepTargetApp(null)}
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

function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  )
}

export default App
