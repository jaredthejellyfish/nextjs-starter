import chalk from 'chalk';

import {
  appendToEnv,
  getInputFromPrompt,
  runCommand,
  runCommands,
} from './lib/utils';

console.log(chalk.green('>> Setting up Supabase...\n'));

const projectId = await getInputFromPrompt('Enter your Supabase project ref');

const projectAnonKey = await getInputFromPrompt('Enter your Supabase anon key');

const dbPassword =
  (await getInputFromPrompt(
    'Enter your Supabase db password or leave empty',
  )) || '';

console.log('');

const installPackages =
  (await getInputFromPrompt('Install Supabase packages? (y/n)')) === 'y' ||
  false;

const useServerComponents =
  (await getInputFromPrompt(
    'Use React server components and enable ssr? (y/n)',
  )) === 'y' || false;

const addMiddleware =
  (await getInputFromPrompt('Add middleware? (y/n)')) === 'y' || false;

const addRoutes =
  (await getInputFromPrompt('Add api and login/logout routes? (y/n)')) ===
    'y' || false;

console.log('');
console.log('Setting up Supabase project...');
console.log('Project ID:', projectId);
console.log('');

await runCommand({
  command: `supabase init --with-intellij-settings=false --with-vscode-settings=false `,
  onSuccess: () => console.log('# Supabase project initialized successfully'),
  onFail: () => {
    console.error('! Failed to initialize Supabase project');
  },
  beforeStart: () => {
    console.log('# Initializing Supabase project...');
  },
});

if (projectId && projectId.length > 4) {
  await runCommand({
    command: `./scripts/lib/supabase/link.exp ${projectId} ${dbPassword}`,
    onSuccess: () => console.log('# Supabase project link successfully'),
    onFail: () => {
      console.error('! Failed to link Supabase project');
    },
    beforeStart: () => {
      console.log('# Linking Supabase project...');
    },
  });
}

if (installPackages) {
  await runCommand({
    command: 'bun install @supabase/supabase-js',
    onSuccess: () => console.log('# Supabase packages installed successfully'),
    onFail: () => {
      console.error('! Failed to install Supabase packages');
    },
    beforeStart: () => {
      console.log('# Installing Supabase packages...');
    },
  });
} else {
  console.log('# Skipping Supabase packages installation, cannot continue.');
  process.exit(0);
}

if (useServerComponents) {
  await runCommands({
    commands: [
      'bun install @supabase/ssr',
      'mkdir -p ./src/lib/supabase',
      'cp -r ./scripts/lib/supabase/client.ts ./src/lib/supabase/',
      'cp -r ./scripts/lib/supabase/server.ts ./src/lib/supabase/',
    ],
    onSuccess: () =>
      console.log('# Supabase React server components installed successfully'),
    onFail: () => {
      console.error('! Failed to install Supabase React server components');
    },
    beforeStart: () => {
      console.log('# Installing Supabase React server components...');
    },
  });
}

if (addMiddleware) {
  await runCommands({
    commands: [
      !useServerComponents ? 'mkdir -p ./src/lib/supabase' : '',
      'cp -r ./scripts/lib/supabase/middleware-auth.ts ./src/lib/supabase/',
      'cp -r ./scripts/lib/supabase/middleware.ts ./src/',
    ],
    onSuccess: () => console.log('# Middleware added successfully'),
    onFail: () => {
      console.error('! Failed to add middleware');
    },
    beforeStart: () => {
      console.log('# Adding middleware...');
    },
  });
}

if (addRoutes) {
  await runCommands({
    commands: [
      'mkdir -p ./src/app/api/auth/callback',
      'cp -r ./scripts/lib/supabase/route.ts ./src/app/api/auth/callback/',
    ],
    onSuccess: () => console.log('# Routes added successfully'),
    onFail: () => {
      console.error('! Failed to add routes');
    },
    beforeStart: () => {
      console.log('# Adding routes...');
    },
  });
}

if (projectId.length > 4 && projectAnonKey.length > 4) {
  await appendToEnv(`
NEXT_PUBLIC_SUPABASE_URL=https://${projectId}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${projectAnonKey}
`);
  console.log('# Supabase env variables added to .env file');
  console.log('');
}

console.log(chalk.green('>> Setup completed!'));

console.log('\n');

console.log(
  chalk.yellow(
    'Add the following to the client section of your env.js file (./src/env.js):\n',
  ),
);
console.log(
  chalk.blue(
    "NEXT_PUBLIC_SUPABASE_URL: z.string().default(''),\nNEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(''),",
  ),
);

console.log(
  chalk.yellow(
    '\nMake sure you fill the "runtimeEnv" object in the env.js file with the correct values.\n',
  ),
);
