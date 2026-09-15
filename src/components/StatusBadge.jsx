import { STATUS_COLORS } from '../lib/constants'

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#6366f1'
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: `${color}22`, color, borderColor: `${color}55` }}
    >
      {status}
    </span>
  )
}
