import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Template, TemplateVariable } from 'src/config/database';

export class CreateTemplateBodyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class CreateTemplateDto extends CreateTemplateBodyDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class UpdateTemplateMetaBodyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['PUBLISH', 'DRAFT'], {
    message: 'status must be one of the following values: PUBLISH, DRAFT',
  })
  status?: Template['status'];

  @IsOptional()
  @IsString()
  from?: string | null;

  @IsOptional()
  @IsString()
  replyTo?: string;

  @IsOptional()
  @IsString()
  subject?: string | null;
}

export class UpdateTemplateMetaDto extends UpdateTemplateMetaBodyDto {
  @IsNotEmpty()
  @IsString()
  templateId!: string;

  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class UpdateTemplateHtmlBodyDto {
  @IsOptional()
  @IsString()
  html?: string | null;
}

export class UpdateTemplateHtmlDto extends UpdateTemplateHtmlBodyDto {
  @IsNotEmpty()
  @IsString()
  templateId!: string;

  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class UpdateTemplateHtmlWithVariableDto extends UpdateTemplateHtmlDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  variables?: TemplateVariable[];
}

export class DeleteTemplateDto {
  @IsNotEmpty()
  @IsString()
  templateId!: string;

  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class GetTemplateDto {
  @IsNotEmpty()
  @IsString()
  templateId!: string;

  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class GetTemplatesDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}
