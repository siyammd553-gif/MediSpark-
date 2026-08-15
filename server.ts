import app from './server/app';

const PORT = Number(process.env.PORT) || 3000;

// Local development / standalone production server
(async () => {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediSpark Server running on http://0.0.0.0:${PORT}`);
  });
})();