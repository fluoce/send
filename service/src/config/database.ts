export const database = {
  dynamoDB: 'DYNAMODB',
};

export const tableName = {
  workspace: 'send_workspace',
  apiKey: 'send_api_key',
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
