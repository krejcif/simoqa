---
on:
  pull_request:
    types: [opened, synchronize, reopened]

timeout-minutes: 20

permissions:
  all: read
  discussions: read

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

steps:
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: 20
      cache: npm

  - name: Install dependencies
    run: npm ci

  - name: Install Playwright browsers
    run: npx playwright install --with-deps chromium

  - name: Run Playwright tests and capture output
    continue-on-error: true
    run: |
      npx playwright test --reporter=json 1>playwright-results.json 2>playwright-stderr.txt || true
---
# Playwright Test Evaluation

You are a QA engineer evaluating automated Playwright E2E test results for PR #`${{ github.event.pull_request.number }}` in `${{ github.repository }}`.

## Steps

1. Read the following files to understand the test run:
   - `playwright-results.json` — structured JSON output from Playwright (suites, specs, results, errors)
   - `playwright-stderr.txt` — any stderr output or warnings during the run
   - `tests/` directory — the actual test source files
   - `playwright.config.js` — test configuration (browser, baseURL, timeouts)

2. Analyse the results thoroughly:
   - Total tests: how many passed, failed, skipped, timed out
   - For each failed test: extract the exact error message, the failing assertion, the step where it broke, and the likely root cause
   - For flaky tests: note if the failure looks environmental (network timeout, selector timing) vs a real regression
   - Test quality: are selectors resilient, are assertions meaningful, are edge cases covered?
   - Coverage gaps: what user flows or scenarios are NOT tested that should be?

3. Post a comment on PR #`${{ github.event.pull_request.number }}` with this exact structure:

   ## 🎭 Playwright Test Evaluation

   **Result:** ✅ All X tests passed | ❌ X of Y tests failed

   ### Test Results
   Table with columns: Test name | Status | Duration | Browser

   ### Failure Analysis
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
