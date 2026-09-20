import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDomainBodyDto {
  @IsString()
  @IsNotEmpty()
  domain!: string;
}

export class CreateDomainDto extends CreateDomainBodyDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class UpdateDomainBodyDto {
  @IsNotEmpty()
  @IsString()
  status!: 'DISABLED' | 'VERIFIED';
}

export class UpdateDomainDto extends UpdateDomainBodyDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @IsNotEmpty()
  @IsString()
  domainId!: string;
}

export class DomainDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @IsNotEmpty()
  @IsString()
  domainId!: string;
}
