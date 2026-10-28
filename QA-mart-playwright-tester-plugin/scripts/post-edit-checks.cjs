// postToolUse hook: after a spec or Page Object is edited, run the convention lint and typecheck
// and hand problems back to the agent as additionalContext. Prints {} when clean.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { readEvent, allow, safeRun } = require('./lib/hook-event.cjs');

safeRun(() => {
  const ev = readEvent();
  const edited = ev.isEdit ? ev.files.filter((f) => /\.spec\.ts$/.test(f) || /^pages\/.+\.ts$/.test(f)) : [];
  if (!edited.length || !fs.existsSync(path.join(ev.root, 'scripts', 'lint-specs.cjs'))) return allow();

  const run = (cmd, args) => spawnSync(cmd, args, { cwd: ev.root, encoding: 'utf8', timeout: 60000 });
  const lint = run('node', ['scripts/lint-specs.cjs', ...edited]);
  const types = run('npm', ['run', '-s', 'typecheck']);

  const problems = [];
  if (lint.status !== 0) problems.push(`lint:specs failed:\n${lint.stdout.trim()}`);
  if (types.status !== 0) problems.push(`typecheck failed:\n${(types.stdout + types.stderr).trim()}`);
  if (!problems.length) return allow();

  const additionalContext = problems.join('\n\n').slice(0, 4000) + '\n\nFix these before continuing. Do not weaken assertions to make them pass.';
  process.stdout.write(JSON.stringify({ additionalContext, hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } }));
});
