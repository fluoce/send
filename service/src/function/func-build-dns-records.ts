import { DnsRecord } from 'src/config/database';

export function funcBuildDnsRecords({
  domain,
  tokens,
  signingHostedZone,
}: {
  domain: string;
  tokens: string[];
  signingHostedZone: string;
}): DnsRecord[] {
  return tokens.map((token) => ({
    type: 'CNAME',
    name: `${token}._domainkey.${domain}`,
    value: `${token}.${signingHostedZone}`,
  }));
}
