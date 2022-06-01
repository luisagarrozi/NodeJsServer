const http = require("http");

const routes = require("./routes");

const server = http.createServer((request, response) => {
  console.log(`Request method: ${request.method} | Endpoint: ${request.url}`);

  // Veriy if the route is in routes:
  const route = routes.find(
    (routeObj) => (
      routeObj.method === request.method && routeObj.endpoint === request.url
  ));

  if (route) {
    console.log('achou route')
    //If the route exists (a.k.a is in the routes module)
    route.handler(request, response);
  } else {
    // If the route does not exist, gives a warning
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(`Cannot ${request.method} ${request.url}`);
  }
});

// Basic listener to know if server started ok
server.listen(3000, () => console.log('Server is running'))