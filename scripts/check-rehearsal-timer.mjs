import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { startSession, enterSlide, finishSession, formatDuration, timingCsv, timingSnapshot, validSession } from '../components/rehearsalTiming.js'
import { rehearsalTimingPlugin } from './rehearsalTimingServer.mjs'

assert.equal(enterSlide(null, 1, 'Title', 1000, 'test'), null)
assert.equal(enterSlide(null, 26, 'Stage 4', 1000, 'ignored'), null, 'other slides must not auto-start')
let partial = startSession(26, 'Stage 4', 1000, 'rehearsal-partial-test')
assert(validSession(partial), 'manual start may begin on any slide')
partial = enterSlide(partial, 27, 'Navigation attempt', 3000)
partial = finishSession(partial, 6000)
assert(validSession(JSON.parse(JSON.stringify(partial))), 'partial run supports refresh recovery')
assert.deepEqual(timingSnapshot(partial, 6000).splits.map(s => [s.slide, s.durationMs]), [[26, 2000], [27, 3000]])
let session = enterSlide(null, 2, 'Opening', 2000, 'rehearsal-test')
assert(validSession(session))
assert.equal(enterSlide(session, 2, 'Opening', 4000, 'ignored'), session, 'click reveal must not split')
session = enterSlide(session, 3, 'Example', 5000)
session = enterSlide(session, 2, 'Opening', 7000)
assert.equal(session.startedAt, 2000, 'revisit must not restart')
assert(validSession(JSON.parse(JSON.stringify(session))), 'reload recovery')
const snapshot = timingSnapshot(session, 10000)
assert.equal(snapshot.totalMs, 8000)
assert.deepEqual(snapshot.splits.map(s => s.durationMs), [3000, 2000, 3000])
assert.equal(snapshot.slideTotals.find(s => s.slide === 2).durationMs, 6000)
assert.equal(snapshot.slideTotals.find(s => s.slide === 2).visits, 2)
session = finishSession(session, 11000)
assert(validSession(session))
assert.equal(timingSnapshot(session, 90000).totalMs, 9000, 'finish freezes the clock')
assert.equal(enterSlide(session, 4, 'Next', 15000), session)
assert.equal(formatDuration(125999), '02:05')
assert(timingCsv(timingSnapshot(session, 11000)).includes('"2","Opening"'))
assert(!validSession({ ...session, id: '../outside' }))
assert(!validSession({ ...session, visits: [{ ...session.visits[0], enteredAt: 0 }] }))

const directory = await mkdtemp(path.join(os.tmpdir(), 'roscon-timing-test-'))
let middleware
rehearsalTimingPlugin(directory).configureServer({
  config: { root: directory }, middlewares: { use(route, handler) { middleware = handler } },
})
const server = http.createServer((req, res) => middleware(req, res))
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
try {
  const url = `http://127.0.0.1:${server.address().port}/__rehearsal/timing`
  const post = data => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  const saved = timingSnapshot(session, 11000)
  assert.equal((await post(saved)).status, 200)
  assert.equal(JSON.parse(await readFile(path.join(directory, session.id + '.json'))).totalMs, 9000)
  assert((await readFile(path.join(directory, session.id + '.csv'), 'utf8')).startsWith('visit,slide,title,seconds'))
  assert.equal((await post(snapshot)).status, 200)
  assert.equal(JSON.parse(await readFile(path.join(directory, session.id + '.json'))).endedAt, 11000, 'late saves must not overwrite the final record')
  assert.equal((await post(timingSnapshot(partial, 6000))).status, 200)
  const partialReport = JSON.parse(await readFile(path.join(directory, partial.id + '.json')))
  assert.deepEqual(partialReport.visits.map(v => v.slide), [26, 27], 'save partial runs without visiting slide 2')
  assert.equal(JSON.parse(await readFile(path.join(directory, session.id + '.json'))).id, session.id, 'new runs preserve existing files')
  assert.equal((await post({ ...saved, id: '../outside' })).status, 400)
  assert.equal((await fetch(url)).status, 405)
  console.log('Timer checks passed: automatic and manual start, partial-run persistence, splits, clicks, revisits, recovery, finish, CSV, disk persistence and stale-save protection.')
} finally {
  await new Promise(resolve => server.close(resolve))
  await rm(directory, { recursive: true, force: true })
}
