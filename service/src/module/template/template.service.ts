import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { TemplateServiceInterface } from './template.interface';
import { TemplateCore } from './template.core';
import { CreateTemplateDto } from './template.dto';

@Injectable()
export class TemplateService implements TemplateServiceInterface {
  constructor(private readonly templateCore: TemplateCore) {}

  async createTemplate(body: CreateTemplateDto) {
    const template = await this.templateCore.createTemplate(body);

    if (!template) {
      throw new ServiceUnavailableException('unable to create template');
    }

    return {
      message: 'Template created successfully',
      template,
    };
  }
}
