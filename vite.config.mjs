import { rehearsalTimingPlugin } from './scripts/rehearsalTimingServer.mjs'
import { fileURLToPath } from 'node:url'

export default {
  plugins: [rehearsalTimingPlugin(fileURLToPath(new URL('./rehearsals', import.meta.url)))],
  server: { watch: { ignored: ['**/rehearsals/**'] } },
}
