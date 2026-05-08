export function getRuntimeEnv(platform: { env?: Record<string, string | undefined> } | undefined, name: string) {
  const platformEnv = platform?.env as Record<string, string | undefined> | undefined;
  const nodeEnv = typeof process !== 'undefined' ? process.env : undefined;

  return platformEnv?.[name] ?? nodeEnv?.[name];
}
