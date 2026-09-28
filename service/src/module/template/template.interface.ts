import { Template, Workspace } from 'src/config/database';
import { CreateTemplateBodyDto, CreateTemplateDto } from './template.dto';
import { ResponseDataType } from 'src/types/response.type';

export interface TemplateCoreInterface {
  createTemplate: (P: CreateTemplateDto) => Promise<Template>;
}

export interface TemplateServiceInterface {
  createTemplate: (P: CreateTemplateDto) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
}
export interface TemplateControllerInterface {
  createTemplate: (
    body: CreateTemplateBodyDto,
    workspace: Workspace,
  ) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
}
