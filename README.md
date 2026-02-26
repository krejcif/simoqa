# simoqa

Playwright E2E tests for [sportisimo.cz](https://www.sportisimo.cz) checkout flow.

## Tests

- **Checkout flow** — adds a product to cart and navigates to the delivery step
- **Cart item count** — verifies cart updates after adding a product

## Run

```bash
npm install
npx playwright install --with-deps chromium
npm test
```

## CI

On every pull request, GitHub Actions runs the full test suite plus an automated security review powered by Claude Opus 4.6.
