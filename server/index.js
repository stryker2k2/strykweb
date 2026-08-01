const http = require('http')
const fs = require('fs')
const path = require('path')

const DATA_FILE = process.env.DATA_FILE || '/data/counts.json'
const PORT = process.env.PORT || 3001

// Only these ids can be incremented — keeps the counts file bounded and
// rejects arbitrary client-supplied keys.
const VALID_IDS = new Set([
  'stryks-emote-wheel',
  'stryks-emote-wheel-custom',
  'stryks-emote-wheel-ascension',
])

function readCounts() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function writeCounts(counts) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  const tmp = `${DATA_FILE}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(counts, null, 2))
  fs.renameSync(tmp, DATA_FILE)
}

function sendJson(res, status, body) {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json),
  })
  res.end(json)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://internal')

  if (req.method === 'GET' && url.pathname === '/api/downloads') {
    const counts = readCounts()
    const result = {}
    for (const id of VALID_IDS) result[id] = counts[id] || 0
    return sendJson(res, 200, result)
  }

  const match = url.pathname.match(/^\/api\/downloads\/([^/]+)$/)
  if (req.method === 'POST' && match) {
    const id = decodeURIComponent(match[1])
    if (!VALID_IDS.has(id)) {
      return sendJson(res, 404, { error: 'unknown project id' })
    }
    const counts = readCounts()
    counts[id] = (counts[id] || 0) + 1
    writeCounts(counts)
    return sendJson(res, 200, { id, count: counts[id] })
  }

  sendJson(res, 404, { error: 'not found' })
})

server.listen(PORT, () => console.log(`download-counter listening on ${PORT}`))
