import { spawnSync } from 'node:child_process';

const result = spawnSync('yarn', ['audit', '--json'], { encoding: 'utf8' });
const events =
  result.stdout
    ?.trim()
    .split('\n')
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    }) || [];
const summary = events.find((event) => event.type === 'auditSummary');
if (!summary || result.error || result.status !== 0) {
  process.stderr.write(
    result.stderr || 'Dependency audit did not complete successfully.\n',
  );
  for (const event of events.filter(
    (event) => event.type === 'auditAdvisory' || event.type === 'error',
  )) {
    process.stderr.write(JSON.stringify(event) + '\n');
  }
  process.exit(1);
}
console.log(summary.data.vulnerabilities);
if (Object.values(summary.data.vulnerabilities).some((count) => count !== 0))
  process.exit(1);
