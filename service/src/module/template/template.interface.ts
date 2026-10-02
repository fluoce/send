import { Template, Workspace } from 'src/config/database';
import {
  CreateTemplateBodyDto,
  CreateTemplateDto,
  DeleteTemplateDto,
  GetTemplateDto,
  GetTemplatesDto,
  UpdateTemplateHtmlBodyDto,
  UpdateTemplateHtmlDto,
  UpdateTemplateHtmlWithVariableDto,
  UpdateTemplateMetaBodyDto,
  UpdateTemplateMetaDto,
} from './template.dto';
import { ResponseDataType } from 'src/types/response.type';

export interface TemplateCoreInterface {
  createTemplate: (P: CreateTemplateDto) => Promise<Template>;
  updateTemplateMeta: (p: UpdateTemplateMetaDto) => Promise<Template>;
  updateTemplateHtml: (
    p: UpdateTemplateHtmlWithVariableDto,
  ) => Promise<Template>;
  deleteTemplate: (P: DeleteTemplateDto) => Promise<Template>;
  getTemplate: (P: GetTemplateDto) => Promise<Template>;
  getTemplates: (P: GetTemplatesDto) => Promise<Template[]>;
}

export interface TemplateServiceInterface {
  createTemplate: (P: CreateTemplateDto) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  updateTemplateMeta: (p: UpdateTemplateMetaDto) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  updateTemplateHtml: (p: UpdateTemplateHtmlDto) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  deleteTemplate: (P: DeleteTemplateDto) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  getTemplate: (P: GetTemplateDto) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  getTemplates: (P: GetTemplatesDto) => Promise<
    ResponseDataType<{
      templates: Template[];
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
  updateTemplateMeta: (
    templateId: string,
    body: UpdateTemplateMetaBodyDto,
    workspace: Workspace,
  ) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  updateTemplateHtml: (
    templateId: string,
    body: UpdateTemplateHtmlBodyDto,
    workspace: Workspace,
  ) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  deleteTemplate: (
    templateId: string,
    workspace: Workspace,
  ) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  getTemplate: (
    templateId: Template['id'],
    workspace: Workspace,
  ) => Promise<
    ResponseDataType<{
      template: Template;
    }>
  >;
  getTemplates: (workspace: Workspace) => Promise<
    ResponseDataType<{
      templates: Template[];
    }>
  >;
}
