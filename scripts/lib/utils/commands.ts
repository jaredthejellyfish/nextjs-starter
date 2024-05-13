import { $ } from 'bun';

$.throws(false);

type runCommandParams = {
  command: string;
  beforeStart?: () => void;
  onSuccess: () => void;
  onFail: (e?: string) => void;
  afterEnd?: () => void;
};

type runCommandsParams = {
  commands: string[];
  beforeStart?: () => void;
  onSuccess: () => void;
  onFail: (e?: string) => void;
  afterEnd?: () => void;
};

async function runCommand({
  command,
  beforeStart,
  onFail,
  onSuccess,
  afterEnd,
}: runCommandParams) {
  if (!command.length) return;
  try {
    beforeStart ? beforeStart() : null;

    const result = await $`${{ raw: command }}`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(result.stderr.toString());
    } else {
      onSuccess ? onSuccess() : null;
    }
  } catch (e) {
    const message = (e as Error).message;
    onFail ? onFail(message) : null;
    console.log('Exiting due to error.');
    console.log('Error command: ', command);
    console.log('Error message: ', message);
    process.exit(0);
  } finally {
    afterEnd ? afterEnd() : null;
    console.log('');
  }
}

async function runCommands({
  commands,
  beforeStart,
  onFail,
  onSuccess,
  afterEnd,
}: runCommandsParams) {
  if (!commands.length) return;
  try {
    beforeStart ? beforeStart() : null;

    for (const c of commands) {
      const result = await $`${{ raw: c }}`.quiet();

      if (result.exitCode !== 0) {
        throw new Error(result.stderr.toString());
      }
    }

    onSuccess ? onSuccess() : null;
  } catch (e) {
    const message = (e as Error).message;
    onFail ? onFail(message) : null;
    console.log('Exiting due to error.');
    console.log('Error command: ', commands);
    console.log('Error message: ', message);
    process.exit(0);
  } finally {
    afterEnd ? afterEnd() : null;
    console.log('');
  }
}

export { runCommand, runCommands };
