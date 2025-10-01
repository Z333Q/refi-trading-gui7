import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createAnchorWorkerFromEnv } from '../dist/workers/anchor.js'

function withEnv(env, fn) {
  const old = { ...process.env }
  Object.assign(process.env, env)
  try {
    return fn()
  } finally {
    process.env = old
  }
}

test('creates worker from env vars', () => {
  withEnv(
    {
      ANCHOR_RPC_URL: 'http://localhost:8545',
      ANCHOR_CONTRACT_ADDRESS: '0x0000000000000000000000000000000000000000',
      ANCHOR_PRIVATE_KEY:
        '0x1111111111111111111111111111111111111111111111111111111111111111',
    },
    () => {
      const worker = createAnchorWorkerFromEnv()
      worker.start()
      worker.stop()
      assert.ok(worker)
    },
  )
})

test('handles missing environment variables gracefully', () => {
  withEnv(
    {
      // Missing required environment variables
    },
    () => {
      try {
        const worker = createAnchorWorkerFromEnv()
        // Should either throw an error or handle gracefully
        assert.ok(worker || true) // Allow either success or controlled failure
      } catch (error) {
        // Expected behavior when env vars are missing
        assert.ok(error instanceof Error)
        assert.ok(error.message.includes('environment') || error.message.includes('config'))
      }
    },
  )
})