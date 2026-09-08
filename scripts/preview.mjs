import { preview } from 'astro';

// Playwright owns this server's lifetime. The CLI may detach in agent environments.
const server = await preview({ server: { host: '127.0.0.1', port: 9000 } });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await server.stop();
  });
}
