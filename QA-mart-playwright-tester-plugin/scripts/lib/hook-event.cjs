// Shared parsing for hook scripts. Works with both harnesses: Copilot sends toolName/toolArgs,
// Local sends tool_name/tool_input. Scripts must never crash, so callers use safeRun.
const fs = require('node:fs');
const path = require('node:path');

const EDIT_TOOL = /edit|create|write|replace|patch|insert/i;
const PATH_KEY = /^(path|filepath|file_path|file|uri)$/i;
const NEW_TEXT_KEY = /^(content|newstring|new_string|newtext|new_text|text|insert_text|code)$/i;
const PATCH_HEADER = /^\*\*\* (?:Add|Update|Delete) File:[ \t]*([^\r\n]+)/gm;

// Collects edited paths and only the text being written (not oldString), so removing a bad line is allowed.
function collect(value, key, out) {
  if (Array.isArray(value)) value.forEach((v) => collect(v, key, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) collect(v, k, out);
  } else if (typeof value === 'string') {
    if (PATH_KEY.test(key)) out.paths.push(value.replace(/^file:\/\//, ''));
    else if (PATCH_HEADER.test(value)) {
      PATCH_HEADER.lastIndex = 0;
      for (const m of value.matchAll(PATCH_HEADER)) out.paths.push(m[1].trim());
      out.texts.push(value.split('\n').filter((l) => l.startsWith('+')).join('\n'));
    } else if (NEW_TEXT_KEY.test(key)) out.texts.push(value);
    PATCH_HEADER.lastIndex = 0;
  }
}

function readEvent() {
  const event = JSON.parse(fs.readFileSync(0, 'utf8'));
  const toolName = String(event.toolName ?? event.tool_name ?? '');
  let args = event.toolArgs ?? event.tool_input ?? {};
  if (typeof args === 'string') { try { args = JSON.parse(args); } catch { args = { text: args }; } }
  const root = path.resolve(event.cwd || process.cwd());
  const out = { paths: [], texts: [] };
  const isEdit = EDIT_TOOL.test(toolName);
  if (isEdit) collect(args, '', out);
  const rel = [...new Set(out.paths.map((p) => path.relative(root, path.resolve(root, p)).split(path.sep).join('/')))];
  return { root, toolName, isEdit, files: rel, texts: out.texts };
}

const allow = () => process.stdout.write('{}');
const deny = (reason) => process.stdout.write(JSON.stringify({
  permissionDecision: 'deny',
  permissionDecisionReason: reason,
  hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason },
}));

// Fail open: a broken guard must not block all editing.
function safeRun(fn) {
  try { fn(); } catch (err) { console.error('[qamart-hook]', err.message); allow(); }
}

module.exports = { readEvent, allow, deny, safeRun };
