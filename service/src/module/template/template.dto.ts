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
