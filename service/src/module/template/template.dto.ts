import { IsNotEmpty, IsString } from 'class-validator';

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

//Update on hold

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
