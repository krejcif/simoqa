---
on:
  pull_request:
    types: [opened, synchronize, reopened]

timeout-minutes: 20

permissions:
  contents: read
  pull-requests: read
  checks: read
  actions: read

engine:
  id: claude
  model: claude-opus-4-6

safe-outputs:
  add-comment:
    target: "*"

tools:
  bash: [":*"]
  github:
    toolsets: [all]
---
# Playwright Test Evaluation

You are a QA engineer evaluating automated Playwright E2E tests for PR #`${{ github.event.pull_request.number }}` in `${{ github.repository }}`.

## Steps

1. Set up the environment and run the tests:
   ```bash
   node --version
   npm ci
   npx playwright install --with-deps chromium
   npx playwright test --reporter=json > playwright-results.json 2>playwright-stderr.txt || true
   ```

2. Read the results and source files:
   - `playwright-results.json` — structured JSON with test suites, specs, statuses, errors, durations
   - `playwright-stderr.txt` — any warnings or errors from the runner
   - `tests/` directory — the actual test source files
   - `playwright.config.js` — configuration (browser, baseURL, timeouts)

3. Analyse the results thoroughly:
   - Total tests: how many passed, failed, skipped, timed out
   - For each failed test: exact error message, failing assertion, step where it broke, likely root cause
   - For flaky-looking failures: distinguish environmental (network timeout, selector timing) from real regressions
   - Test quality: are selectors resilient, are assertions meaningful, are edge cases covered?
   - Coverage gaps: what user flows or scenarios are NOT tested that should be?

4. Post a comment on PR #`${{ github.event.pull_request.number }}` with this structure:

   ## 🎭 Playwright Test Evaluation

   **Result:** ✅ All X tests passed | ❌ X of Y tests failed

   ### Test Results
   | Test | Status | Duration | Browser |
   |------|--------|----------|---------|

   ### Failure Analysis
   *(omit if all tests passed)*
   For each failure:
   - **Test:** name
   - **Error:** exact error message
   - **Root cause:** what likely caused it
   - **Fix:** concrete suggestion

   ### Test Quality Assessment
   - What the tests cover well
   - Missing scenarios or edge cases
   - Selector stability (are locators resilient to UI changes?)
   - Suggested improvements (specific, actionable)

   ### Summary
   Two or three sentences on the overall health of the test suite and any action needed.

   ---
   *Evaluated by Claude Opus 4.6 via [GitHub Agentic Workflows](https://github.github.com/gh-aw/)*
