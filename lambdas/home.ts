import "source-map-support/register";
import { APIGatewayProxyHandler } from "aws-lambda";

let html = `
<h1>Moore URL</h1>
<form method="post" action="">
  <label for="link_to_short">Type your link:</labe;>
  <input type="text" id="link_to_short" name="link_to_short" />
  <button type="submit">Shorten it!</button>
</form>
`;

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(JSON.stringify(event));

  return {
    statusCode: 200,
    body: html,
    headers: {
      "Content-Type": "text/html",
      "Content-Length": html.length
    }
  };
};
