export function checkEnv({ envs }: { envs: string[] }) {
  const missing = envs.filter((envVar) => !process.env[envVar]);
  if (missing?.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
  return envs.reduce(
    (acc, envVar) => {
      acc[envVar] = process.env[envVar];
      return acc;
    },
    {} as Record<string, string | undefined>,
  );
}
