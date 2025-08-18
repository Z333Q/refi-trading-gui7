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

## Development

Install dependencies:

```bash
npm install
```

Run lint on the core modules:

```bash
npx eslint src/lib/ace.ts src/lib/var.ts src/lib/supervisor.ts src/types/api.ts
```

Check for security vulnerabilities:

```bash
npm audit
```

## License

MIT
