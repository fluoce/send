import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { TemplateCoreInterface } from './template.interface';
import { database, tableName, Template } from 'src/config/database';
import { CreateTemplateDto } from './template.dto';
import { UlidService } from 'src/lib/ulid/ulid.service';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { funcTryCatch } from 'src/function/func-try-catch';

@Injectable()
export class TemplateCore implements TemplateCoreInterface {
  private logger = new Logger(TemplateCore.name);
  constructor(
    @Inject(database.dynamoDB)
    private readonly dynamoDB: DynamoDBDocumentClient,
    private readonly ulid: UlidService,
  ) {}

  async createTemplate({ name, workspaceId }: CreateTemplateDto) {
    const now = new Date().toISOString();
    const item: Template = {
      id: this.ulid.templateId(),
      workspaceId,
      name,
      status: 'DRAFT',
      form: null,
      subject: null,
      html: null,
      variables: null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await funcTryCatch<PutCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new PutCommand({
            TableName: tableName.template,
            Item: item,
            ConditionExpression:
              'attribute_not_exists(workspaceId) AND attribute_not_exists(id)',
          }),
        ),
      logger: this.logger,
      action: 'createTemplate_PutCommand',
    });

    if (!result) {
      throw new ServiceUnavailableException('Failed to create templet');
    }

    return item;
  }
}
