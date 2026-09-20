export const env = () => ({
  port: process.env.PORT || '3001',
  jwt: {
    publicKey: process.env.JWT_PUBLIC_KEY!,
    issuer: process.env.JWT_ISSUER!,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
  },
});
