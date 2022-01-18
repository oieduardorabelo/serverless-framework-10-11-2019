import { APIGatewayProxyHandler } from "aws-lambda";
import { parse } from "querystring";
import { nanoid } from "nanoid";
import * as AWS from "aws-sdk";
import { URL } from "url";

let ddbConfig = {
  tableName: process.env.DDB_TABLE_NAME
};
let ddbClient = new AWS.DynamoDB.DocumentClient();
let createSlug = ({ size }) => nanoid(size);

let html = ({ linkReferer, linkShort }) => `
<h1>Moore Links</h1>
<h2>Your link has been shortened:</h2>
<a href="${linkReferer}${linkShort}">${linkReferer}${linkShort}</a>
`;

type IBODY = { link_to_short: string };

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(JSON.stringify(event));

  try {
    let { link_to_short } = parse(event.body) as IBODY;
    let targetUrl = new URL(link_to_short);
    let linkReferer = event.headers.Referer;
    let linkSlug = createSlug({ size: 4 });

    await ddbClient
      .put({
        TableName: ddbConfig.tableName,
        Item: {
          slug: linkSlug,
          long_link: targetUrl.href
        },
        Expected: {
          long_link: {
            Exists: false
          }
        }
      })
      .promise();

    return {
      statusCode: 200,
      body: html({ linkReferer, linkShort: linkSlug }),
      headers: {
        "Content-Type": "text/html",
        "Content-Length": html.length
      }
    };
  } catch (error) {
    let body = `
    <p>Something went wrong. Enter a valid URL or try again later!</p>
    <p><a href="${event.headers.Referer}">Go back</a></p>
    `;
    return {
      statusCode: 400,
      body,
      headers: {
        "Content-Type": "text/html",
        "Content-Length": body.length
      }
    };
  }
};
