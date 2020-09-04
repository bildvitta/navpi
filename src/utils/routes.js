const routes = []

function addRoute (route) {
  routes.push(route)
}

function addRoutes (routes) {
  routes.forEach(addRoute)
}

module.exports = {
  routes,

  addRoute,
  addRoutes
}
