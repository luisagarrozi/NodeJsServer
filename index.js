const http = require("http");
const url = require("url");

const bodyParser = require("./helpers/bodyParser");

const routes = require("./routes");

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);

  console.log(
    `Request Method: ${request.method} | Endpoint: ${parsedUrl.pathname}`
  );

  let { pathname } = parsedUrl;
  let id = null;
  // Divide the url at the / and then filter to remove empty space
  const splitEndpoint = pathname.split("/").filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  // Veriy if the route is in routes:
  const route = routes.find(
    (routeObject) => (
      routeObject.endpoint === pathname && routeObject.method === request.method
));

  if (route) {
    // Transform the iterable object into a javascript object:
    request.query = parsedUrl.query;
    request.params = { id };
    //If the route exists (a.k.a is in the routes module)
    response.send = (status, body) => {
      response.writeHead(status, { "Content-Type": "text/html" });
      response.end(JSON.stringify(body));
    };

    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else {
      route.handler(request, response);
    }

    // If the route does not exist, gives a warning
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(`Cannot ${request.method} ${pathname}`);
  }
});

// Basic listener to know if server started ok
server.listen(3000, () => console.log('Server started at http://localhost:3000'))
