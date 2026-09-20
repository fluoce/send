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
  createAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  status: 'ACTIVE' | 'DEACTIVE' | 'SUSPEND';
  createAt: string;
  updatedAt: string;
  expireAt: string;
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
  createAt: string;
  updatedAt: string;
}

export interface VerifiedDomain {
  domain: string;
  workspaceId: string;
  domainId: string;
  verifiedAt: string;
}
