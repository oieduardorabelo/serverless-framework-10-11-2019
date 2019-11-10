import "source-map-support/register";
import { APIGatewayProxyHandler } from "aws-lambda";
import { parse } from "querystring";
import * as AWS from "aws-sdk";

let ddbConfig = {
  tableName: process.env.DDB_TABLE_NAME
};
let ddbClient = new AWS.DynamoDB.DocumentClient();
let createSlug = ({ size }) =>
  Math.random()
    .toString(16)
    .substr(2, size);

let html = ({ linkReferer, linkShort }) => `
<h1>Moore Links</h1>
<h2>Your link has been shortened:</h2>
<a href="//${linkReferer}${linkShort}">${linkReferer}${linkShort}</a>
`;

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(JSON.stringify(event));

  try {
    let { link_to_short: linkTarget } = parse(event.body);
    let linkReferer = event.headers.Referer;
    let linkSlug = createSlug({ size: 4 });

    await ddbClient.put({
      TableName: ddbConfig.tableName,
      Item: {
        slug: linkSlug,
        long_link: linkTarget
      },
      Expected: {
        long_link: {
          Exists: false
        }
      }
    });

    return {
      statusCode: 200,
      body: html({ linkReferer, linkShort: linkSlug }),
      headers: {
        "Content-Type": "text/html",
        "Content-Length": html.length
      }
    };
  } catch (error) {
    let body = "Something went wrong. Please try again.";
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
