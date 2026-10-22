import { mkdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { timingCsv, timingSnapshot, validSession } from '../components/rehearsalTiming.js'

export function rehearsalTimingPlugin(outputDirectory) {
  return {
    name: 'roscon-rehearsal-timing',
    configureServer(server) {
      const directory = outputDirectory ?? path.join(server.config.root, 'rehearsals')
      let queue = Promise.resolve()
      const latest = new Map()
      server.middlewares.use('/__rehearsal/timing', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end('POST required'); return }
        try {
          if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host)
            throw Error('Origin mismatch')
          const chunks = []
          let size = 0
          for await (const chunk of req) {
            size += chunk.length
            if (size > 1024 * 1024) throw Error('Timing report too large')
            chunks.push(chunk)
          }
          const data = JSON.parse(Buffer.concat(chunks).toString())
          if (!validSession(data) || !Number.isFinite(data.savedAt)) throw Error('Invalid timing report')
          const snapshot = timingSnapshot(data, data.savedAt)
          queue = queue.catch(() => {}).then(async () => {
            if (snapshot.savedAt < (latest.get(snapshot.id) ?? 0)) return
            await mkdir(directory, { recursive: true })
            for (const [extension, content] of [
              ['json', JSON.stringify(snapshot, null, 2) + '\n'], ['csv', timingCsv(snapshot)],
            ]) {
              const target = path.join(directory, `${snapshot.id}.${extension}`)
              await writeFile(target + '.tmp', content)
              await rename(target + '.tmp', target)
            }
            latest.set(snapshot.id, snapshot.savedAt)
          })
          await queue
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ saved: true }))
        } catch {
          res.statusCode = 400
          res.end('Unable to save timing report')
        }
      })
    },
  }
}
