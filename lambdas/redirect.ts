import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";

let ddbConfig = {
  tableName: process.env.DDB_TABLE_NAME
};
let ddbClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(JSON.stringify(event));

  let { slug } = event.pathParameters;

  let linkRecord = await ddbClient
    .get({
      TableName: ddbConfig.tableName,
      Key: {
        slug
      }
    })
    .promise();

  if (linkRecord.Item) {
    return {
      statusCode: 302,
      body: linkRecord.Item.long_link,
      headers: {
        Location: linkRecord.Item.long_link,
        "Content-Type": "text/plain"
      }
    };
  }

  return {
    statusCode: 404,
    body: "Slug not found. Check that you entered it right."
  };
};
