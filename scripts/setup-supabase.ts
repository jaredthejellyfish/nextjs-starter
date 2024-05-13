import { getInputFromPrompt, runCommand, runCommands } from './lib/utils';

const projectId = await getInputFromPrompt('Enter your Supabase project ref');

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

if (projectId && projectId.length > 4) {
  await runCommand({
    command: `supabase init --project-ref ${projectId}`,
    onSuccess: () => console.log('# Supabase project initialized successfully'),
    onFail: () => {
      console.error('! Failed to initialize Supabase project');
    },
    beforeStart: () => {
      console.log('# Initializing Supabase project...');
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
