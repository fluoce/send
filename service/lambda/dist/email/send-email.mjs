import { DynamoDBClient as D } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient as C,
  QueryCommand as R,
} from '@aws-sdk/lib-dynamodb';
function d({ envs: e }) {
  let n = e.filter((t) => !process.env[t]);
  if (n?.length > 0)
    throw new Error(`Missing required environment variables: ${n.join(', ')}`);
  return e.reduce((t, r) => ((t[r] = process.env[r]), t), {});
}
function o({ status: e, data: n, message: t, headers: r }) {
  return {
    statusCode: e,
    headers: { 'Content-Type': 'application/json', ...(r || {}) },
    body: JSON.stringify({ ...(t ? { message: t } : {}), ...(n || {}) }),
  };
}
async function f({ fn: e, errorMessage: n = 'Internal server error' }) {
  try {
    return await e();
  } catch (t) {
    return (
      console.log('send-email-error: ', t),
      o({ status: 500, message: n })
    );
  }
}
function l({ headers: e, name: n }) {
  if (!e) return;
  let t = Object.keys(e).find((r) => r.toLowerCase() === n.toLowerCase());
  return (t && e[t]?.trim()) || void 0;
}
var m = 'send-api-key';
import c from 'node:crypto';
var E = '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
  u = 32;
var A = 16,
  y = 10,
  p = 0xffffffffffff;
var i;
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
})(i || (i = {}));
var s = class extends Error {
  constructor(n, t) {
    (super(`${t} (${n})`), (this.name = 'ULIDError'), (this.code = n));
  }
};
function h(e) {
  let n = Math.floor(e() * u) % u;
  return E.charAt(n);
}
function N(e) {
  let n = _(),
    t = (n && (n.crypto || n.msCrypto)) || (typeof c < 'u' ? c : null);
  if (typeof t?.getRandomValues == 'function')
    return () => {
      let r = new Uint8Array(1);
      return (t.getRandomValues(r), r[0] / 256);
    };
  if (typeof t?.randomBytes == 'function')
    return () => t.randomBytes(1).readUInt8() / 256;
  if (c?.randomBytes) return () => c.randomBytes(1).readUInt8() / 256;
  throw new s(i.PRNGDetectFailure, 'Failed to find a reliable PRNG');
}
function _() {
  return T()
    ? self
    : typeof window < 'u'
      ? window
      : typeof global < 'u'
        ? global
        : typeof globalThis < 'u'
          ? globalThis
          : null;
}
function b(e, n) {
  let t = '';
  for (; e > 0; e--) t = h(n) + t;
  return t;
}
function w(e, n = y) {
  if (isNaN(e))
    throw new s(i.EncodeTimeValueMalformed, `Time must be a number: ${e}`);
  if (e > p)
    throw new s(
      i.EncodeTimeSizeExceeded,
      `Cannot encode a time larger than ${p}: ${e}`,
    );
  if (e < 0) throw new s(i.EncodeTimeNegative, `Time must be positive: ${e}`);
  if (Number.isInteger(e) === !1)
    throw new s(i.EncodeTimeValueMalformed, `Time must be an integer: ${e}`);
  let t,
    r = '';
  for (let a = n; a > 0; a--)
    ((t = e % u), (r = E.charAt(t) + r), (e = (e - t) / u));
  return r;
}
function T() {
  return typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope;
}
function I(e, n) {
  let t = n || N(),
    r = !e || isNaN(e) ? Date.now() : e;
  return w(r, y) + b(A, t);
}
function g({ prefix: e }) {
  return `${e}_${I()}`;
}
var {
    REGION: x,
    ACCESS_KEY_ID: M,
    SECRET_ACCESS_KEY: P,
    API_KEY_TABLE_NAME: U,
    API_KEY_TABLE_INDEX_NAME: v,
  } = d({
    envs: [
      'REGION',
      'ACCESS_KEY_ID',
      'SECRET_ACCESS_KEY',
      'API_KEY_TABLE_NAME',
      'API_KEY_TABLE_INDEX_NAME',
    ],
  }),
  Z = C.from(
    new D({ region: x, credentials: { accessKeyId: M, secretAccessKey: P } }),
  ),
  q = async (e) => {
    let n = l({ headers: e?.headers, name: m }),
      t = typeof e?.body == 'object' ? e.body : JSON.parse(e.body ?? '{}');
    return n
      ? f({
          fn: async () => {
            let r = await Z.send(
              new R({
                TableName: U,
                IndexName: v,
                KeyConditionExpression: '#k = :k',
                ExpressionAttributeNames: { '#k': 'key' },
                ExpressionAttributeValues: { ':k': n },
                Limit: 1,
              }),
            );
            if (!r)
              return o({
                status: 503,
                message: 'Database service unavailable',
              });
            let a = r.Items?.[0];
            return a
              ? a?.status !== 'ACTIVE'
                ? o({
                    status: 403,
                    message: `API key is not Active ( status: ${a?.status})  `,
                  })
                : o({
                    status: 202,
                    data: {
                      messageId: g({ prefix: 'msg' }),
                      ...t,
                      message: 'Email accepted for processing !',
                    },
                  })
              : o({ status: 403, message: 'API key not found' });
          },
        })
      : o({ status: 401, message: 'API Key is missing' });
  };
export { q as handler };
