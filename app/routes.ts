import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  layout("./components/layouts/layout.tsx", [
    index("./components/auth/login.tsx"),
    route("register", "./components/auth/register.tsx")
  ]),

  layout("./components/layouts/user_layout.tsx", [
    route("dashboard", "./components/user/dashboard.tsx"),
    route("view-details/:id", "./components/events/event.tsx")
  ]),

] satisfies RouteConfig;
