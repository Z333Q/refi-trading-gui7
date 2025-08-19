# ReFi.Trading GUI

Prototype implementation exploring ReFi.Trading's dual-proof gate for
safe, non-custodial algorithmic trading.

## Features

- **OpenAPI 3.1 spec** for core endpoints in `openapi/openapi.yaml`.
- **TypeScript types** for the `OrderPreviewResult` contract in
  `src/types/api.ts`.
- **ACE policy** and **zk-VaR proof** clients with fail-closed
  semantics in `src/lib/ace.ts` and `src/lib/var.ts`.
- **Supervisor decision logic** enforcing reductions-only safe-mode
  when downstream services degrade in `src/lib/supervisor.ts`.
- **zkSync anchoring client** for committing previews and fills to an
  immutable audit trail in `src/lib/anchor.ts`.

## Development

Install dependencies:

```bash
npm install
```

Run lint on the core modules:

```bash
npx eslint src/lib/ace.ts src/lib/var.ts src/lib/supervisor.ts src/lib/anchor.ts src/types/api.ts
```

Check for security vulnerabilities:

```bash
npm audit
```

### On-Chain Anchoring

Configure environment variables for the anchor worker:

```bash
export ANCHOR_RPC_URL="https://zksync-era.blockchain" # RPC endpoint
export ANCHOR_CONTRACT="0xYourContract"             # IAuditAnchor address
export ANCHOR_PRIVATE_KEY="0xYourKey"                # wallet key
```

The `AnchorClient` in `src/lib/anchor.ts` uses these values to submit
`anchorPreview` and `anchorFill` transactions to zkSync Era.

## License

MIT
