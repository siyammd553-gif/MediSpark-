import app from '../server/app';

// Vercel serverless function entry: the exported Express app handles
// all /api/* routes (and serves the built frontend as a fallback).
export default app;