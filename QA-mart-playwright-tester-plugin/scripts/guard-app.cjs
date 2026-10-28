// preToolUse hook: deny agent edits under app/. QA Mart is read-only for agents.
const path = require('node:path');
const { readEvent, allow, deny, safeRun } = require('./lib/hook-event.cjs');

safeRun(() => {
  const ev = readEvent();
  const appDir = path.join(ev.root, 'app') + path.sep;
  // macOS and Windows file systems ignore case.
  const norm = (p) => (process.platform === 'linux' ? p : p.toLowerCase());
  const hit = ev.isEdit && ev.files.some((f) => norm(path.resolve(ev.root, f) + path.sep).startsWith(norm(appDir)));
  if (hit) deny('app/ is read-only for agents. Keep the failing test and report the application bug with docs/templates/bug-report.md.');
  else allow();
});
