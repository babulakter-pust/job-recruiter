export default function StatsBar({ applications }) {
  const total = applications.length
  const active = applications.filter(
    (a) => !['Offer', 'Rejected', 'Withdrawn'].includes(a.status),
  ).length
  const interviews = applications.filter((a) =>
    a.status.includes('Interview'),
  ).length
  const offers = applications.filter((a) => a.status === 'Offer').length
  const rejected = applications.filter((a) => a.status === 'Rejected').length

  const stats = [
    { label: 'Total Applied', value: total },
    { label: 'In Progress', value: active },
    { label: 'Interviewing', value: interviews },
    { label: 'Offers', value: offers },
    { label: 'Rejected', value: rejected },
  ]

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
