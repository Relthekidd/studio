// scripts/generate-fixme.js
import fs from 'fs';
import { execSync } from 'child_process';

let output = '';

try {
  output = execSync('npx eslint ./src --ext .ts,.tsx -f json', {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr crash spam
  });
} catch (err) {
  // Grab partial stdout on error
  if (err.stdout) {
    output = err.stdout;
  } else {
    console.error('❌ ESLint execution failed.');
    process.exit(1);
  }
}

let results = [];
try {
  results = JSON.parse(output);
} catch {
  console.error('❌ Could not parse ESLint output.');
  process.exit(1);
}

let markdown = `# 🚧 FIXME.md – Unresolved ESLint Issues\n\nThis file is auto-generated.\n\n---\n`;

for (const file of results) {
  if (!file.messages.length) continue;

  markdown += `### \`${file.filePath.replace(process.cwd() + '/', '')}\`\n`;

  for (const msg of file.messages) {
    markdown += `- [${msg.line}:${msg.column}] ${msg.message} – \`${msg.ruleId}\`\n`;
  }

  markdown += `\n---\n`;
}

fs.writeFileSync('FIXME.md', markdown, 'utf-8');
console.info('✅ FIXME.md updated with current lint errors.');
