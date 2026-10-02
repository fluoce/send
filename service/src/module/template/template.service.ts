import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { TemplateServiceInterface } from './template.interface';
import { TemplateCore } from './template.core';
import {
  CreateTemplateDto,
  DeleteTemplateDto,
  GetTemplateDto,
  GetTemplatesDto,
  UpdateTemplateHtmlDto,
  UpdateTemplateMetaDto,
} from './template.dto';
import { funcExtractTemplateVariables } from 'src/function/func-extract-template-variable';

@Injectable()
export class TemplateService implements TemplateServiceInterface {
  constructor(private readonly templateCore: TemplateCore) {}

  async createTemplate(body: CreateTemplateDto) {
    const template = await this.templateCore.createTemplate(body);

    if (!template) {
      throw new ServiceUnavailableException('Unable to create template');
    }

    return {
      message: 'Template created successfully',
      template,
    };
  }

  async updateTemplateMeta(body: UpdateTemplateMetaDto) {
    if (
      !body.name &&
      !body.status &&
      !body.from &&
      !body.replyTo &&
      !body.subject
    ) {
      throw new BadRequestException(
        'At least one field is required to update the template',
      );
    }

    const template = await this.templateCore.updateTemplateMeta(body);

    if (!template) {
      throw new ServiceUnavailableException('Unable to updatetemplate');
    }

    return {
      message: 'Template updated successfully',
      template,
    };
  }

  async updateTemplateHtml(body: UpdateTemplateHtmlDto) {
    const variables = await funcExtractTemplateVariables(body?.html);

    const template = await this.templateCore.updateTemplateHtml({
      ...body,
      variables: variables.length ? variables : [],
    });

    if (!template) {
      throw new ServiceUnavailableException(
        'Unable to update html for the template',
      );
    }

    return {
      message: 'Template updated successfully',
      template,
    };
  }

  async deleteTemplate(body: DeleteTemplateDto) {
    const template = await this.templateCore.deleteTemplate(body);

    if (!template) {
      throw new ServiceUnavailableException('Unable to delete template');
    }

    return {
      message: 'Template deleted successfully',
      template,
    };
  }

  async getTemplate(body: GetTemplateDto) {
    const template = await this.templateCore.getTemplate(body);

    if (!template) {
      throw new ServiceUnavailableException('Template not found');
    }

    return {
      message: 'Template retrieved successfully',
      template,
    };
  }

  async getTemplates(body: GetTemplatesDto) {
    const templates = await this.templateCore.getTemplates(body);

    if (!templates) {
      throw new ServiceUnavailableException('Unable to get templates');
    }

    return {
      message: 'Templates retrieved successfully',
      templates,
    };
  }
}
