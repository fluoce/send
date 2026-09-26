export const database = {
  dynamoDB: 'DYNAMODB',
};

export const tableName = {
  workspace: 'send_workspace',
  apiKey: 'send_api_key',
  domain: 'send_domain',
  verifiedDomain: 'send_verified_domain',
};

export interface Workspace {
  id: string;
  userId: string;
  name: string;
  status: 'ACTIVE' | 'DEACTIVE';
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ApiKey {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  domainId?: string | null;
  status: 'ACTIVE' | 'DEACTIVE' | 'SUSPEND';
  createdAt: string | Date;
  updatedAt: string | Date;
  expireAt: string | Date;
}

export interface DnsRecord {
  type: 'CNAME' | 'TXT' | 'MX';
  name: string;
  value: string;
}

export interface Domain {
  id: string;
  workspaceId: string;
  domain: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'DISABLED';
  region: string;
  dnsRecords: DnsRecord[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface VerifiedDomain {
  domain: string;
  workspaceId: string;
  domainId: string;
  verifiedAt: string;
}
