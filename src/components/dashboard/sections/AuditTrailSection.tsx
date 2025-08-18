import React from 'react'
import { AuditTrail } from '../AuditTrail'

export function AuditTrailSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Audit Trail</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Immutable record of all trading activities with cryptographic proofs
        </p>
      </div>
      <AuditTrail />
    </div>
  )
}