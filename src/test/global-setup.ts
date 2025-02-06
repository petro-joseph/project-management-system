import { setup as setupDevServer } from '../server';
import { Server } from 'http';

declare global {
  var __SERVER__: Server;
}

export default async function globalSetup() {
  // Setup for all tests
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  
  // Add any global setup here
  global.__SERVER__ = await setupDevServer();
}