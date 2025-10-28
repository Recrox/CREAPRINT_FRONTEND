NSwag generation
================

This project includes `nswag.json` configured to generate a TypeScript Axios client from your API Swagger endpoint:

  https://localhost:44366/swagger/v1/swagger.json

How to run
----------

Option A — using npx (recommended):

1. Ensure your API is running and accessible at the URL above.
2. Run:

```powershell
npx nswag run ./nswag.json
```

Generated file will be written to `src/api/api-client.ts` (per `nswag.json`).

Option B — using dotnet global tool:

1. Install the NSwag CLI if you don't have it:

```powershell
dotnet tool install --global NSwag.ConsoleCore
```

2. Run:

```powershell
nswag run ./nswag.json /runtime:NetCore31
```

If the API is not accessible (self-signed cert on localhost), you can:
- allow insecure in `nswag.json` (already set to true), or
- fetch the `swagger.json` locally and point `nswag.json` to the local file path.

Notes
-----
- This config generates an Axios-based TypeScript client. You can change the template to `Fetch` or change `dtoTypeGenerationMode`.
- After generation, replace the in-memory `ArticleService` with calls to the generated `ApiClient` methods.
