import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { TemplateCoreInterface } from './template.interface';
import { database, tableName, Template } from 'src/config/database';
import {
  CreateTemplateDto,
  UpdateTemplateHtmlWithVariableDto,
  UpdateTemplateMetaDto,
} from './template.dto';
import { UlidService } from 'src/lib/ulid/ulid.service';
import {
  DeleteCommand,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  PutCommandOutput,
  QueryCommand,
  QueryCommandOutput,
  UpdateCommand,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { funcTryCatch } from 'src/function/func-try-catch';
import { funcBuildUpdateExpression } from 'src/function/func-build-update-expression';

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
      from: null,
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
              'attribute_not_exists(id) AND attribute_not_exists(workspaceId)',
          }),
        ),
      logger: this.logger,
      action: 'createTemplate_PutCommand',
    });

    if (!result) {
      throw new ServiceUnavailableException('Failed to create template');
    }

    return item;
  }

  async updateTemplateMeta({
    templateId,
    name,
    status,
    from,
    replyTo,
    subject,
    workspaceId,
  }: UpdateTemplateMetaDto) {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = funcBuildUpdateExpression({
      name,
      status,
      from,
      replyTo,
      subject,
    });

    const result = await funcTryCatch<UpdateCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new UpdateCommand({
            TableName: tableName.template,
            Key: {
              workspaceId,
              id: templateId,
            },
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            ConditionExpression:
              'attribute_exists(workspaceId) AND attribute_exists(id)',
            ReturnValues: 'ALL_NEW',
          }),
        ),
      logger: this.logger,
      action: 'updateTemplateMeta_UpdateCommand',
    });

    if (!result?.Attributes) {
      throw new ServiceUnavailableException('Failed to update template');
    }

    return result.Attributes as Template;
  }

  async updateTemplateHtml({
    templateId,
    html,
    variables,
    workspaceId,
  }: UpdateTemplateHtmlWithVariableDto) {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = funcBuildUpdateExpression({
      html,
      variables: variables ?? undefined,
    });

    const result = await funcTryCatch<UpdateCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new UpdateCommand({
            TableName: tableName.template,
            Key: {
              workspaceId,
              id: templateId,
            },
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            ConditionExpression:
              'attribute_exists(workspaceId) AND attribute_exists(id)',
            ReturnValues: 'ALL_NEW',
          }),
        ),
      logger: this.logger,
      action: 'updateTemplateMeta_UpdateCommand',
    });

    if (!result?.Attributes) {
      throw new ServiceUnavailableException(
        'Failed to update html content for the template',
      );
    }

    return result.Attributes as Template;
  }

  async deleteTemplate({
    templateId,
    workspaceId,
  }: {
    templateId: string;
    workspaceId: string;
  }) {
    const result = await funcTryCatch<DeleteCommandOutput, null>({
      func: async () =>
        await this.dynamoDB.send(
          new DeleteCommand({
            TableName: tableName.template,
            Key: {
              workspaceId,
              id: templateId,
            },
            ConditionExpression:
              'attribute_exists(workspaceId) AND attribute_exists(id)',
            ReturnValues: 'ALL_OLD',
          }),
        ),
      logger: this.logger,
      action: 'deleteTemplate_DeleteCommand',
    });

    if (!result?.Attributes) {
      throw new ServiceUnavailableException('Failed to delete template');
    }
    return result.Attributes as Template;
  }

  async getTemplate({
    templateId,
    workspaceId,
  }: {
    templateId: string;
    workspaceId: string;
  }) {
    const result = await funcTryCatch<GetCommandOutput, null>({
      func: async () =>
        await this.dynamoDB.send(
          new GetCommand({
            TableName: tableName.template,
            Key: {
              workspaceId,
              id: templateId,
            },
          }),
        ),
      logger: this.logger,
      action: 'getTemplate_GetCommand',
    });

    if (!result?.Item) {
      throw new ServiceUnavailableException('Template not found');
    }
    return result.Item as Template;
  }

  async getTemplates({ workspaceId }: { workspaceId: string }) {
    const result = await funcTryCatch<QueryCommandOutput, null>({
      func: async () =>
        await this.dynamoDB.send(
          new QueryCommand({
            TableName: tableName.template,
            KeyConditionExpression: 'workspaceId = :workspaceId',
            ExpressionAttributeValues: { ':workspaceId': workspaceId },
          }),
        ),
      logger: this.logger,
      action: 'getTemplates_QueryCommand',
    });

    if (!result || !result.Items) {
      throw new ServiceUnavailableException('Failed to get templates');
    }
    return result.Items as Template[];
  }
}
