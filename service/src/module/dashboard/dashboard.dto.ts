import { IsNotEmpty, IsString } from 'class-validator';

export class GetDashboardDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}
