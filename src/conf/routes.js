import Tweet from "../pages/Tweet";
import Login from "../pages/Login";

const routes = [
    {path: "/", name: "home", component: Tweet},
    {path: "/tweet", name: "tweet", component: Tweet},
    {path: "/login", name: "login", component: Login},
];

export default routes;