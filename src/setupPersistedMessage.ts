import { Polly } from '@pollyjs/core';
import chalk from 'chalk';

const weakMap = new WeakMap<Polly, string[]>();

Polly.on('create', polly => {
  const persisted: string[] = [];

  weakMap.set(polly, persisted);

  polly.server.any().on('beforePersist', (req, recording) => {
    const { method, url } = req;
    persisted.push(
      `${method} ${url} ${formatStatus(recording.response.status)}`,
    );
  });
});

Polly.on('stop', polly => {
  const persisted = weakMap.get(polly);

  if (persisted?.length) {
    // eslint-disable-next-line no-console
    console.log(
      [
        `Polly: Added to recording ${chalk.bgGrey(polly.recordingId)}`,
        '',
        ...persisted,
      ].join('\n'),
    );
  }
});

function formatStatus(status: any) {
  return status < 400 ? chalk.bgGreen(status) : chalk.bgRed(status);
}
