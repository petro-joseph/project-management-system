import { Server } from 'http';

declare global {
  var __SERVER__: Server;
}

export default async function globalTeardown() {
  // Cleanup after all tests
  if (global.__SERVER__) {
    await global.__SERVER__.close();
  }
}