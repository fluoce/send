import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceBodyDto {
  @IsNotEmpty()
  @IsString()
  name?: string;
}

export class CreateWorkspaceDto extends CreateWorkspaceBodyDto {
  @IsNotEmpty()
  @IsString()
  userId?: string;
}

export class UpdateWorkspaceBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'DEACTIVE'], {
    message: 'status must be one of the following values: ACTIVE, DEACTIVE',
  })
  @IsNotEmpty()
  status?: 'ACTIVE' | 'DEACTIVE';
}

export class UpdateWorkspaceDto extends UpdateWorkspaceBodyDto {
  @IsNotEmpty()
  @IsString()
  workspaceId?: string;

  @IsNotEmpty()
  @IsString()
  userId?: string;
}

export class DeleteWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  workspaceId?: string;

  @IsNotEmpty()
  @IsString()
  userId?: string;
}
