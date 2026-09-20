import { Global, Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { database } from 'src/config/database';
import { env } from 'src/config/env';

@Global()
@Module({
  providers: [
    {
      provide: database.dynamoDB,
      useFactory: () => {
        const client = new DynamoDBClient({
          region: env().aws.region,
          credentials: {
            accessKeyId: env().aws.accessKeyId,
            secretAccessKey: env().aws.secretAccessKey,
          },
        });
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: [database.dynamoDB],
})
export class DatabaseModule {}
