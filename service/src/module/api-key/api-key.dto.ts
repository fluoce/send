import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateApiKeyBodyDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  expireAt?: Date;
}

export class CreateApiKeyDto extends CreateApiKeyBodyDto {
  @IsNotEmpty()
  @IsString()
  workspaceId?: string;
}

export class UpdateApiKeyBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  expireAt?: Date;

  @IsOptional()
  @IsEnum(['ACTIVE', 'DEACTIVE', 'SUSPEND'], {
    message:
      'status must be one of the following values: ACTIVE, DEACTIVE, SUSPEND',
  })
  @IsNotEmpty()
  status?: 'ACTIVE' | 'DEACTIVE' | 'SUSPEND';
}

export class UpdateApiKeyDto extends UpdateApiKeyBodyDto {
  @IsNotEmpty()
  @IsString()
  workspaceId?: string;

  @IsNotEmpty()
  @IsString()
  apiKeyId?: string;
}

export class ApiKeyDto {
  @IsNotEmpty()
  @IsString()
  workspaceId?: string;

  @IsNotEmpty()
  @IsString()
  apiKeyId?: string;
}
