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

export class MarkAsFailedDomainDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @IsNotEmpty()
  @IsString()
  domainId!: string;
}

export class DeleteDomainDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @IsNotEmpty()
  @IsString()
  domainId!: string;
}

export class GetDomainDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @IsNotEmpty()
  @IsString()
  domainId!: string;
}

export class GetDomainsDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class GetVerifyedDomainDto {
  @IsNotEmpty()
  @IsString()
  domain!: string;
}

export class GetVerifyedDomainsDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class CheckVerifiedDomainDto {
  @IsNotEmpty()
  @IsString()
  domain!: string;

  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}

export class GetVerifiedDomainByIdForWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @IsNotEmpty()
  @IsString()
  domainId!: string;
}

export class GetSesIdentityForDomainDto {
  @IsNotEmpty()
  @IsString()
  domain!: string;
}

export class GetSesDkimStatusDto {
  @IsNotEmpty()
  @IsString()
  domain!: string;
}

export class VerifyDomainDto {
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
