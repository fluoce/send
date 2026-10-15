import { DynamoDBClient as X } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient as q,
  PutCommand as H,
  QueryCommand as N,
} from '@aws-sdk/lib-dynamodb';
import { SQSClient as Q, SendMessageCommand as J } from '@aws-sdk/client-sqs';
function R({ envs: e }) {
  let t = e.filter((r) => !process.env[r]);
  if (t?.length > 0)
    throw new Error(`Missing required environment variables: ${t.join(', ')}`);
  return e.reduce((r, s) => ((r[s] = process.env[s]), r), {});
}
function o({ status: e, data: t, message: r, error: s, headers: n }) {
  return {
    statusCode: e,
    headers: { 'Content-Type': 'application/json', ...(n || {}) },
    body: JSON.stringify({
      ...(r ? { message: r } : {}),
      ...(s ? { error: s } : {}),
      ...(t || {}),
    }),
  };
}
async function D({ fn: e, errorMessage: t = 'Internal server error' }) {
  try {
    return await e();
  } catch (r) {
    return (
      console.log('send-email-error: ', r),
      o({ status: 500, message: t })
    );
  }
}
function M({ headers: e, name: t }) {
  if (!e) return;
  let r = Object.keys(e).find((s) => s.toLowerCase() === t.toLowerCase());
  return (r && e[r]?.trim()) || void 0;
}
var T = 'send-api-key';
import p from 'node:crypto';
var v = '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
  g = 32;
var B = 16,
  C = 10,
  k = 0xffffffffffff;
var m;
(function (e) {
  ((e.Base32IncorrectEncoding = 'B32_ENC_INVALID'),
    (e.DecodeTimeInvalidCharacter = 'DEC_TIME_CHAR'),
    (e.DecodeTimeValueMalformed = 'DEC_TIME_MALFORMED'),
    (e.EncodeTimeNegative = 'ENC_TIME_NEG'),
    (e.EncodeTimeSizeExceeded = 'ENC_TIME_SIZE_EXCEED'),
    (e.EncodeTimeValueMalformed = 'ENC_TIME_MALFORMED'),
    (e.PRNGDetectFailure = 'PRNG_DETECT'),
    (e.ULIDInvalid = 'ULID_INVALID'),
    (e.Unexpected = 'UNEXPECTED'),
    (e.UUIDInvalid = 'UUID_INVALID'));
})(m || (m = {}));
var c = class extends Error {
  constructor(t, r) {
    (super(`${r} (${t})`), (this.name = 'ULIDError'), (this.code = t));
  }
};
function $(e) {
  let t = Math.floor(e() * g) % g;
  return v.charAt(t);
}
function G(e) {
  let t = O(),
    r = (t && (t.crypto || t.msCrypto)) || (typeof p < 'u' ? p : null);
  if (typeof r?.getRandomValues == 'function')
    return () => {
      let s = new Uint8Array(1);
      return (r.getRandomValues(s), s[0] / 256);
    };
  if (typeof r?.randomBytes == 'function')
    return () => r.randomBytes(1).readUInt8() / 256;
  if (p?.randomBytes) return () => p.randomBytes(1).readUInt8() / 256;
  throw new c(m.PRNGDetectFailure, 'Failed to find a reliable PRNG');
}
function O() {
  return W()
    ? self
    : typeof window < 'u'
      ? window
      : typeof global < 'u'
        ? global
        : typeof globalThis < 'u'
          ? globalThis
          : null;
}
function K(e, t) {
  let r = '';
  for (; e > 0; e--) r = $(t) + r;
  return r;
}
function j(e, t = C) {
  if (isNaN(e))
    throw new c(m.EncodeTimeValueMalformed, `Time must be a number: ${e}`);
  if (e > k)
    throw new c(
      m.EncodeTimeSizeExceeded,
      `Cannot encode a time larger than ${k}: ${e}`,
    );
  if (e < 0) throw new c(m.EncodeTimeNegative, `Time must be positive: ${e}`);
  if (Number.isInteger(e) === !1)
    throw new c(m.EncodeTimeValueMalformed, `Time must be an integer: ${e}`);
  let r,
    s = '';
  for (let n = t; n > 0; n--)
    ((r = e % g), (s = v.charAt(r) + s), (e = (e - r) / g));
  return s;
}
function W() {
  return typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope;
}
function L(e, t) {
  let r = t || G(),
    s = !e || isNaN(e) ? Date.now() : e;
  return j(s, C) + K(B, r);
}
function P({ prefix: e }) {
  return `${e}_${L()}`;
}
var E = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function U({ from: e }) {
  if (typeof e != 'string' || /[\r\n]/.test(e))
    throw new Error(
      'From address must be a string and must not contain linebreaks',
    );
  let t = e.trim();
  if (!t) throw new Error('From address is empty');
  let r = t.match(/^(.*?)<\s*([^<>]+)\s*>$/),
    s = null,
    n;
  if (
    (r
      ? ((s =
          r[1]
            .trim()
            .replace(/^"(.*)"$/, '$1')
            .trim() || null),
        (n = r[2].trim()))
      : (n = t),
    n.length > 254 || !E.test(n))
  )
    throw new Error('Invalid from email address');
  if (((n = n.toLowerCase()), !n.includes('@')))
    throw new Error('Email address missing domain part');
  return { name: s, email: n, domain: n.split('@')[1] };
}
function S({ body: e }) {
  if (typeof e != 'string' || !e)
    throw new Error('Request body is missing or not a string');
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    throw new Error('Invalid JSON in body');
  }
  if (typeof t != 'object' || t === null || Array.isArray(t))
    throw new Error('Parsed body is not a valid object');
  return t;
}
function I({ field: e, maxLength: t }) {
  if (typeof e != 'string') throw new Error('Field must be a string');
  if (typeof t != 'number' || t < 0)
    throw new Error('maxLength must be a non-negative number');
  return e.length <= t;
}
var {
    REGION: V,
    API_KEY_TABLE_NAME: z,
    API_KEY_TABLE_INDEX_NAME: Y,
    WORKSPACE_TABLE_NAME: ee,
    VERIFIED_DOMAIN_TABLE_NAME: te,
    VERIFIED_DOMAIN_TABLE_INDEX_NAME: re,
    SEND_FROM: ne,
    SQS_EMAIL_QUEUE_URL: se,
    MESSAGE_TABLE_NAME: oe,
  } = R({
    envs: [
      'REGION',
      'API_KEY_TABLE_NAME',
      'API_KEY_TABLE_INDEX_NAME',
      'WORKSPACE_TABLE_NAME',
      'VERIFIED_DOMAIN_TABLE_NAME',
      'VERIFIED_DOMAIN_TABLE_INDEX_NAME',
      'SEND_FROM',
      'SQS_EMAIL_QUEUE_URL',
      'MESSAGE_TABLE_NAME',
    ],
  }),
  y = q.from(new X({ region: V })),
  ie = new Q({ region: V }),
  Ze = async (e) => {
    let t = M({ headers: e?.headers, name: T });
    if (!t) return o({ status: 401, message: 'API Key is missing' });
    let r = S({ body: e?.body });
    return r
      ? D({
          fn: async () => {
            let n = (
              await y.send(
                new N({
                  TableName: z,
                  IndexName: Y,
                  KeyConditionExpression: '#k = :k',
                  ExpressionAttributeNames: { '#k': 'key' },
                  ExpressionAttributeValues: { ':k': t },
                  Limit: 1,
                }),
              )
            ).Items?.[0];
            if (!n) return o({ status: 403, message: 'API key not found' });
            if (n?.status !== 'ACTIVE')
              return o({
                status: 403,
                message: `API key is not Active ( status: ${n?.status})`,
              });
            let a = (
              await y.send(
                new N({
                  TableName: ee,
                  IndexName: 'idIndex',
                  KeyConditionExpression: '#id = :id',
                  ExpressionAttributeNames: { '#id': 'id' },
                  ExpressionAttributeValues: { ':id': n.workspaceId },
                  Limit: 1,
                }),
              )
            ).Items?.[0];
            if (!a || a.status !== 'ACTIVE')
              return o({
                status: 403,
                message: a
                  ? `Workspace is not Active ( status: ${a.status})`
                  : 'Workspace not found or inactive',
              });
            let { from: l, to: d, subject: u, html: f } = r,
              A = ne;
            if (l) {
              let i = U({ from: l });
              if (!i)
                return o({
                  status: 400,
                  message: `'from' field must be a valid email address or formatted address (e.g., "Name <email@example.com>")`,
                  data: { from: l },
                });
              let h = await y.send(
                new N({
                  TableName: te,
                  IndexName: re,
                  KeyConditionExpression: '#domain = :domain',
                  FilterExpression: '#workspaceId = :workspaceId',
                  ExpressionAttributeNames: {
                    '#domain': 'domain',
                    '#workspaceId': 'workspaceId',
                  },
                  ExpressionAttributeValues: {
                    ':domain': i.domain,
                    ':workspaceId': a.id,
                  },
                }),
              );
              if (!h?.Items || h.Items.length === 0)
                return o({
                  status: 403,
                  message: "'from' domain is not allowed for this workspace",
                  data: { from: l, domain: i.domain },
                });
              let x = h.Items[0];
              if (x.workspaceId !== a.id || x.status !== 'VERIFIED')
                return o({
                  status: 403,
                  message: 'Sender domain is not verified for this workspace',
                });
              A = i.name ? `${i.name} <${i.email}>` : i.email;
            }
            if (!Array.isArray(d) || d.length === 0)
              return o({
                status: 400,
                message: "'to' field is required and must be a non-empty array",
              });
            if (d.length > 10)
              return o({
                status: 400,
                message: "'to' cannot exceed 10 recipients",
              });
            if (
              !d.every(
                (i) =>
                  typeof i == 'string' &&
                  E.test(i.trim()) &&
                  I({ field: i.trim(), maxLength: 254 }),
              )
            )
              return o({
                status: 400,
                message: "'to' must contain only valid email addresses",
                data: { to: d },
              });
            if (typeof u != 'string' || !u.trim())
              return o({
                status: 400,
                message:
                  "'subject' field is required and must be a non-empty string",
              });
            if (!I({ field: u.trim(), maxLength: 254 }))
              return o({
                status: 400,
                message: "'subject' field must not exceed 254 characters",
              });
            if (typeof f != 'string' || !f.trim())
              return o({
                status: 400,
                message:
                  "'html' field is required and must be a non-empty string",
              });
            if (!I({ field: f.trim(), maxLength: 2e4 }))
              return o({
                status: 400,
                message: "'html' field must not exceed 20000 characters",
              });
            let w = P({ prefix: 'msg' }),
              Z = {
                v: '1',
                type: 'email',
                messageId: w,
                workspaceId: a.id,
                apiKeyId: n.id,
                email: {
                  from: A,
                  to: d.map((i) => i.trim()),
                  subject: u.trim(),
                  html: f,
                },
                createdAt: new Date().toISOString(),
              },
              b =
                (
                  await ie.send(
                    new J({ QueueUrl: se, MessageBody: JSON.stringify(Z) }),
                  )
                )?.MessageId || null;
            if (!b) return o({ status: 500, message: 'Failed to queue email' });
            let _ = new Date().toISOString(),
              F = {
                id: w,
                workspaceId: a.id,
                apiKeyId: n.id,
                serviceId: b,
                status: 'PENDING',
                type: 'EMAIL',
                from: A,
                to: d.map((i) => i.trim()),
                subject: u,
                html: f,
                errorMessage: '',
                createdAt: _,
                updatedAt: _,
              };
            return (
              await y.send(new H({ TableName: oe, Item: F })),
              o({
                status: 202,
                message: 'Email in queue',
                data: { messageId: w },
              })
            );
          },
        })
      : o({ status: 400, message: 'Request body is missing' });
  };
export { Ze as handler };
