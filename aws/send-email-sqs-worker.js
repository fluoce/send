import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
const {
  SEND_FLUOCE_AWS_REGION: REGION,
  SEND_FLUOCE_AWS_ACCESS_KEY_ID: ACCESS_KEY_ID,
  SEND_FLUOCE_AWS_SECRET_ACCESS_KEY: SECRET_ACCESS_KEY,
} = process.env;
if (!REGION || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error("Missing required environment variables");
}
const ses = new SESv2Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});
const res = (statusCode, message, data = null) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ status: statusCode, message, data }),
});
export const handler = async (event) => {
  if (!event?.Records?.length) {
    console.error("No SQS Records found in event");
    return res(400, "No SQS Records found in event");
  }
  try {
    const messageIds = [];
    for (const record of event.Records) {
      let job;
      try {
        job = await JSON.parse(record.body);
        console.log("Job", job);
      } catch (error) {
        console.error("Invalid SQS message JSON", {
          sqsMessageId: record.messageId,
          error: error?.message,
        });
        continue;
      }
      if (!job.email) {
        console.error("Missing email object", {
          messageId: job.messageId,
        });
        continue;
      }
      const { from, to, subject, html } = job.email;
      if (
        !from ||
        !Array.isArray(to) ||
        !to.length ||
        typeof subject !== "string" ||
        !subject.trim() ||
        typeof html !== "string" ||
        !html.trim()
      ) {
        console.error("Incomplete email job", {
          messageId: job.messageId,
          from,
          to,
          subject,
        });
        continue;
      }
      const params = {
        Destination: {
          ToAddresses: to,
        },
        Content: {
          Simple: {
            Subject: {
              Data: subject,
              Charset: "UTF-8",
            },
            Body: {
              Html: {
                Data: html,
                Charset: "UTF-8",
              },
            },
          },
        },
        FromEmailAddress: from,
      };
      try {
        const sendResult = await ses.send(new SendEmailCommand(params));
        messageIds.push({
          messageId: job.messageId,
          sesMessageId: sendResult.MessageId,
        });
      } catch (error) {
        console.error("Failed to send email via SES", {
          jobMessageId: job.messageId,
          error: error?.message,
        });
        continue;
      }
    }
    return res(200, "Emails processed successfully", messageIds);
  } catch (error) {
    console.error("sqs-worker handler failed", error);
    return res(500, "Internal server error");
  }
};
