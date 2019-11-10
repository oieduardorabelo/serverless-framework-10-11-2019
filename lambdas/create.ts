import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';

let html = (prefix) => `
<h1>Moore URL</h1>
<h2>Your URL has been shortened:</h2>
<a href="//${prefix}/some-url">${prefix}/some-url</a>
`;

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(JSON.stringify(event));
  return {
    statusCode: 200,
    body: html("mysite"),
    headers: {
      'Content-Type': 'text/html',
      'Content-Length': html.length,
    }
  };
}
