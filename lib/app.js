const matchRoute = function (route, request) {
  if (route.method) {
    return route.method === request.method && request.url.match(route.path);
  }
  return true;
};

class App {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  serve(request, response) {
    const matchingHandlers =
      this.routes.filter((route) => matchRoute(route, request));
    const next = function () {
      const noElementLeft = 0;
      if (matchingHandlers.length === noElementLeft) {
        return;
      }
      const router = matchingHandlers.shift();
      router.handler(request, response, next);
    };
    next();
  }
}

module.exports = { App };
