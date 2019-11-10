import "source-map-support/register";
import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(JSON.stringify(event));

  let target = "https://google.com";

  return {
    statusCode: 302,
    body: target,
    headers: {
      Location: target,
      "Content-Type": "text/plain"
    }
  };
};
