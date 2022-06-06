const http = require("http");
const { URL } = require('url');

const routes = require("./routes");

const server = http.createServer((request, response) => {
  const parsedUrl = new URL('http://localhost:3000/users?order=asc');

  console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

  // Veriy if the route is in routes:
  const route = routes.find(
    (routeObj) => (
      routeObj.method === request.method && routeObj.endpoint === parsedUrl.pathname
  ));

  if (route) {
    // Transform the iterable object into a javascript object:
    request.query = Object.fromEntries(parsedUrl.searchParams)
    console.log('achou route')
    //If the route exists (a.k.a is in the routes module)
    route.handler(request, response);
  } else {
    // If the route does not exist, gives a warning
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
});

// Basic listener to know if server started ok
server.listen(3000, () => console.log('Server is running'))