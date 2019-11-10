import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { parse } from 'querystring';

let html = ({ linkReferer, linkResult }) => `
<h1>Moore URL</h1>
<h2>Your URL has been shortened:</h2>
<a href="//${linkReferer}${linkResult}">${linkReferer}${linkResult}</a>
`;

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(JSON.stringify(event));

  let { link_to_short: linkResult } = parse(event.body);
  let linkReferer = event.headers.Referer;

  return {
    statusCode: 200,
    body: html({ linkReferer, linkResult }),
    headers: {
      'Content-Type': 'text/html',
      'Content-Length': html.length,
    }
  };
}
