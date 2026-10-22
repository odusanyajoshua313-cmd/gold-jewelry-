# Goldplugdami local preview

The storefront now uses a file-backed inventory store and owner-only admin workflow.

## Start locally

Set a private admin token, then start the server:

```powershell
$env:ADMIN_TOKEN = "replace-with-a-long-random-secret"
node preview-server.cjs
```

Open the storefront at <http://127.0.0.1:3000/> and the owner inventory tool at <http://127.0.0.1:3000/admin.html>.

## Inventory workflow

- **Add or update stock:** use the inventory tool to add products or adjust stock/status.
- **Record a sale:** choose WhatsApp, walk-in, or delivery. The recorded quantity is deducted from stock in the same write operation.
- **Public catalogue:** only active products are returned; stock of zero renders as sold out and disables its inquiry action.
- **Data file:** `store.json` is the single source of truth. Include it in persistent backups; do not deploy this preview server where its local filesystem can be discarded between requests.

The preview server listens only on the local computer. Use a deployment with persistent storage, HTTPS, protected environment variables, and backups before production use.
