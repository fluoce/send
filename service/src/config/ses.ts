import { SESv2Client } from '@aws-sdk/client-sesv2';
import { env } from './env';

export const SES_CLIENT = 'SES_CLIENT';

export const sesProvider = {
  provide: SES_CLIENT,
  useFactory: () => {
    return new SESv2Client({
      region: env().aws.region,
    });
  },
};
