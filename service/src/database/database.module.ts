import { Global, Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { database } from 'src/config/database';

@Global()
@Module({
  providers: [
    {
      provide: database.dynamoDB,
      useFactory: () => {
        const client = new DynamoDBClient({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: [database.dynamoDB],
})
export class DatabaseModule {}
