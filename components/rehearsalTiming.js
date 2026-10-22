export const STORAGE_KEY = 'roscon-rehearsal-timing-v1'

export function validSession(value) {
  return value?.version === 1
    && typeof value.id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value.id)
    && Number.isFinite(value.startedAt)
    && (value.endedAt === null || (Number.isFinite(value.endedAt) && value.endedAt >= value.startedAt))
    && Array.isArray(value.visits) && value.visits.length > 0 && value.visits.length < 10000
    && value.visits.every((v, i) => Number.isInteger(v.slide) && v.slide > 0 && v.slide <= 1000
      && typeof v.title === 'string' && v.title.length <= 500
      && Number.isFinite(v.enteredAt) && v.enteredAt >= value.startedAt
      && (v.leftAt === null ? i === value.visits.length - 1 && value.endedAt === null
        : Number.isFinite(v.leftAt) && v.leftAt >= v.enteredAt)
      && (i === 0 ? v.enteredAt === value.startedAt : v.enteredAt === value.visits[i - 1].leftAt))
    && (value.endedAt === null || value.visits.at(-1).leftAt === value.endedAt)
}

export function startSession(slide, title, now, id) {
  return { version: 1, id, startedAt: now, endedAt: null,
    visits: [{ slide, title, enteredAt: now, leftAt: null }] }
}

export function enterSlide(session, slide, title, now, id) {
  if (!session) {
    if (slide !== 2) return null
    return startSession(slide, title, now, id)
  }
  if (session.endedAt !== null || session.visits.at(-1).slide === slide) return session
  const visits = session.visits.slice()
  now = Math.max(now, visits.at(-1).enteredAt)
  visits[visits.length - 1] = { ...visits.at(-1), leftAt: now }
  visits.push({ slide, title, enteredAt: now, leftAt: null })
  return { ...session, visits }
}

export function finishSession(session, now) {
  if (!session || session.endedAt !== null) return session
  now = Math.max(now, session.visits.at(-1).enteredAt)
  return { ...session, endedAt: now, visits: session.visits.map((v, i) =>
    i === session.visits.length - 1 ? { ...v, leftAt: now } : v) }
}

export function timingSnapshot(session, now) {
  const end = session.endedAt ?? Math.max(now, session.visits.at(-1).enteredAt)
  const splits = session.visits.map((v, i) => ({
    visit: i + 1, slide: v.slide, title: v.title,
    durationMs: (v.leftAt ?? end) - v.enteredAt,
    cumulativeMs: (v.leftAt ?? end) - session.startedAt,
    complete: v.leftAt !== null,
  }))
  const totals = new Map()
  for (const split of splits) {
    const previous = totals.get(split.slide) ?? { slide: split.slide, title: split.title, durationMs: 0, visits: 0 }
    previous.durationMs += split.durationMs
    previous.visits += 1
    totals.set(split.slide, previous)
  }
  return { ...session, savedAt: now, totalMs: end - session.startedAt,
    splits, slideTotals: [...totals.values()].sort((a, b) => a.slide - b.slide) }
}

export function timingCsv(snapshot) {
  const cell = value => '"' + String(value).replaceAll('"', '""') + '"'
  return 'visit,slide,title,seconds,cumulative_seconds,complete\n'
    + snapshot.splits.map(v => [v.visit, v.slide, v.title, (v.durationMs / 1000).toFixed(3),
      (v.cumulativeMs / 1000).toFixed(3), v.complete].map(cell).join(',')).join('\n') + '\n'
}

export function formatDuration(ms) {
  const seconds = Math.floor(Math.max(0, ms) / 1000)
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}
