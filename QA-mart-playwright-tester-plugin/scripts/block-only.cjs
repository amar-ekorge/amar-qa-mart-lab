// preToolUse hook: deny edits that add test.only, describe.only or it.only to specs. One focused test hides the rest of the suite.
const { readEvent, allow, deny, safeRun } = require('./lib/hook-event.cjs');

const ONLY = /\b(?:test|it|describe)(?:\.[a-z]+)*\.only\s*\(/;
const TEST_FILE = /(?:^|\/)(?:tests|pages)\/.+\.ts$|\.spec\.ts$/;

safeRun(() => {
  const ev = readEvent();
  const touchesTests = ev.files.some((f) => TEST_FILE.test(f));
  if (ev.isEdit && touchesTests && ev.texts.some((t) => ONLY.test(t))) {
    deny('.only is blocked: it silently skips every other test. Remove it, or run one test with `npx playwright test <file> -g "<title>"`.');
  } else {
    allow();
  }
});
