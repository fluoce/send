import { DynamoDBClient as q } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient as W,
  GetCommand as H,
  PutCommand as Q,
  QueryCommand as S,
} from '@aws-sdk/lib-dynamodb';
import { SQSClient as J, SendMessageCommand as z } from '@aws-sdk/client-sqs';
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
function x({ headers: e, name: t }) {
  if (!e) return;
  let r = Object.keys(e).find((s) => s.toLowerCase() === t.toLowerCase());
  return (r && e[r]?.trim()) || void 0;
}
var M = 'send-api-key';
import p from 'node:crypto';
var k = '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
  g = 32;
var F = 16,
  v = 10,
  T = 0xffffffffffff;
var d;
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
})(d || (d = {}));
var m = class extends Error {
  constructor(t, r) {
    (super(`${r} (${t})`), (this.name = 'ULIDError'), (this.code = t));
  }
};
function $(e) {
  let t = Math.floor(e() * g) % g;
  return k.charAt(t);
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
  throw new m(d.PRNGDetectFailure, 'Failed to find a reliable PRNG');
}
function O() {
  return X()
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
function j(e, t = v) {
  if (isNaN(e))
    throw new m(d.EncodeTimeValueMalformed, `Time must be a number: ${e}`);
  if (e > T)
    throw new m(
      d.EncodeTimeSizeExceeded,
      `Cannot encode a time larger than ${T}: ${e}`,
    );
  if (e < 0) throw new m(d.EncodeTimeNegative, `Time must be positive: ${e}`);
  if (Number.isInteger(e) === !1)
    throw new m(d.EncodeTimeValueMalformed, `Time must be an integer: ${e}`);
  let r,
    s = '';
  for (let n = t; n > 0; n--)
    ((r = e % g), (s = k.charAt(r) + s), (e = (e - r) / g));
  return s;
}
function X() {
  return typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope;
}
function L(e, t) {
  let r = t || G(),
    s = !e || isNaN(e) ? Date.now() : e;
  return j(s, v) + K(F, r);
}
function C({ prefix: e }) {
  return `${e}_${L()}`;
}
var E = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function P({ from: e }) {
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
function U({ body: e }) {
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
    API_KEY_TABLE_NAME: Y,
    API_KEY_TABLE_INDEX_NAME: ee,
    WORKSPACE_TABLE_NAME: te,
    VERIFIED_DOMAIN_TABLE_NAME: re,
    VERIFIED_DOMAIN_TABLE_INDEX_NAME: ne,
    SEND_FROM: se,
    SQS_EMAIL_QUEUE_URL: oe,
    MESSAGE_TABLE_NAME: ie,
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
  y = W.from(new q({ region: V })),
  ae = new J({ region: V }),
  Ze = async (e) => {
    let t = x({ headers: e?.headers, name: M });
    if (!t) return o({ status: 401, message: 'API Key is missing' });
    let r = U({ body: e?.body });
    return r
      ? D({
          fn: async () => {
            let n = (
              await y.send(
                new S({
                  TableName: Y,
                  IndexName: ee,
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
            let c = (
              await y.send(new H({ TableName: te, Key: { id: n.workspaceId } }))
            )?.Item;
            if (c?.status !== 'ACTIVE')
              return o({
                status: 403,
                message: `Workspace is not Active ( status: ${c?.status})`,
              });
            let { from: l, to: a, subject: u, html: f } = r,
              A = se;
            if (l) {
              let i = P({ from: l });
              if (!i)
                return o({
                  status: 400,
                  message: `'from' field must be a valid email address or formatted address (e.g., "Name <email@example.com>")`,
                  data: { from: l },
                });
              let h = await y.send(
                new S({
                  TableName: re,
                  IndexName: ne,
                  KeyConditionExpression:
                    '#domain = :domain AND #workspaceId = :workspaceId',
                  ExpressionAttributeNames: {
                    '#domain': 'domain',
                    '#workspaceId': 'workspaceId',
                  },
                  ExpressionAttributeValues: {
                    ':domain': i.domain,
                    ':workspaceId': c.id,
                  },
                  Limit: 1,
                }),
              );
              if (!h?.Items || h.Items.length === 0)
                return o({
                  status: 403,
                  message: "'from' domain is not allowed for this workspace",
                  data: { from: l, domain: i.domain },
                });
              let N = h.Items[0];
              if (
                N.workspaceId !== c.id ||
                N.domain !== i.domain ||
                N.status !== 'VERIFIED'
              )
                return o({
                  status: 403,
                  message: 'Sender domain is not verified for this workspace',
                });
              A = i.name ? `${i.name} <${i.email}>` : i.email;
            }
            if (!Array.isArray(a) || a.length === 0)
              return o({
                status: 400,
                message: "'to' field is required and must be a non-empty array",
              });
            if (a.length > 10)
              return o({
                status: 400,
                message: "'to' cannot exceed 10 recipients",
              });
            if (
              !a.every(
                (i) =>
                  typeof i == 'string' &&
                  E.test(i.trim()) &&
                  I({ field: i.trim(), maxLength: 254 }),
              )
            )
              return o({
                status: 400,
                message: "'to' must contain only valid email addresses",
                data: { to: a },
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
            let w = C({ prefix: 'msg' }),
              Z = {
                v: '1',
                type: 'email',
                messageId: w,
                workspaceId: c.id,
                apiKeyId: n.id,
                email: {
                  from: A,
                  to: a.map((i) => i.trim()),
                  subject: u.trim(),
                  html: f,
                },
                createdAt: new Date().toISOString(),
              },
              b =
                (
                  await ae.send(
                    new z({ QueueUrl: oe, MessageBody: JSON.stringify(Z) }),
                  )
                )?.MessageId || null;
            if (!b) return o({ status: 500, message: 'Failed to queue email' });
            let _ = new Date().toISOString(),
              B = {
                id: w,
                workspaceId: c.id,
                apiKeyId: n.id,
                serviceId: b,
                status: 'PENDING',
                type: 'EMAIL',
                from: A,
                to: a.map((i) => i.trim()),
                subject: u,
                html: f,
                errorMessage: '',
                createdAt: _,
                updatedAt: _,
              };
            return (
              await y.send(new Q({ TableName: ie, Item: B })),
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
