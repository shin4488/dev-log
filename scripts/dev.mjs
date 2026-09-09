import { dev } from 'astro';

// Playwright owns this server's lifetime, including in agent environments.
const server = await dev({ server: { host: '127.0.0.1', port: 8000 } });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await server.stop();
  });
}
