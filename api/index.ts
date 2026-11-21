import type { IncomingMessage, ServerResponse } from 'node:http';
import { app } from '../src/server.js';

let readyPromise: Promise<void> | undefined;

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!readyPromise) {
    readyPromise = Promise.resolve(app.ready()).then(() => {});
  }
  await readyPromise;
  app.server.emit('request', req, res);
}

