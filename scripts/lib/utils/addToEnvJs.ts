export default async function addToEnvJs({
  client,
  server,
}: {
  client?: { name: string; value: string }[];
  server?: { name: string; value: string }[];
}) {
  const file = Bun.file('./src/env.js');
  const contents = await file.text();

  const serverPattern = /server:\s\{/;
  const serverSplit = contents.split(serverPattern);
  const serverVars = server?.map((v) => `${v.name}: ${v.value},`).join(' ');

  const envWithServer =
    serverSplit[0] + 'server: {' + `  ${serverVars ?? ''}` + serverSplit.pop();

  const clientPattern = /client:\s\{/;
  const clientSplit = envWithServer.split(clientPattern);
  const clientVars = client?.map((v) => `${v.name}: ${v.value},`).join(' ');

  const envWithClient =
    clientSplit[0] + `client: { ${clientVars ?? ''}` + clientSplit.pop();

  const runtimeEnvPattern = /runtimeEnv:\s\{/;

  const runtimeEnvSplit = envWithClient.split(runtimeEnvPattern);

  const allVarNames = [
    ...(server?.map((v) => v.name) ?? []),
    ...(client?.map((v) => v.name) ?? []),
  ].map((v) => `${v}: process.env.${v},`);

  const runtimeEnvVars = allVarNames.join(' ');

  const finalEnv =
    runtimeEnvSplit[0] +
    `runtimeEnv: {  ${runtimeEnvVars}` +
    runtimeEnvSplit.pop();

  await Bun.write('./src/env.js', finalEnv);
}
