import React from "react";
import Home from "../modules/Home";
import { Navigate, Route, Routes as Router } from "react-router-dom";
import Form from "../modules/Authorization/form";
import CreatePost from "../modules/CreatePost";
import Profile from "../modules/profile";
import People from "../modules/People";
import Followers from "../modules/Follow";
import Feed from "../modules/Feed";
import SaveShow from "../modules/saveShow";
import LikeShow from "../modules/likeShow";
import CommentShow from "../modules/commentShow";
import Search from "../modules/search";
import Setting from "../modules/Settings";
import FollowRequest from "../modules/followRequest";
const PrivateRoute = ({ children }) => {
  const isUserLoggedIn = window.localStorage.getItem("user:token") || false;
  const isFormPages = window.location.pathname.includes("account");
  if (isUserLoggedIn && !isFormPages) {
    return children;
  } else if (!isUserLoggedIn && isFormPages) {
    return children;
  } else {
    const redirectUrl = isUserLoggedIn ? "/" : "account/signin";
    <Navigate to={redirectUrl} replace />;
  }
};
const Routes = () => {
  const routes = [
    {
      id: 1,
      name: "home",
      component: <Home />,
      path: "/",
    },
    {
      id: 2,
      name: "Sign in",
      component: <Form isSignInPage={true} />,
      path: "/account/signin",
    },
    {
      id: 3,
      name: "Sign up",
      component: <Form isSignInPage={false} />,
      path: "/account/signup",
    },
    {
      id: 4,
      name: "Create Post",
      component: <CreatePost />,
      path: "/new-post",
    },
    {
      id: 5,
      name: "my profile",
      component: <Profile />,
      path: "/profile",
    },
    {
      id: 6,
      name: "people",
      component: <People />,
      path: "/user/:userName",
    },
    {
      id: 7,
      name: "followers",
      component: <Followers />,
      path: "/followers",
    },
    {
      id: 8,
      name: "feed",
      component: <Feed />,
      path: "/feed",
    },
    {
      id: 9,
      name: "saveShow",
      component: <SaveShow />,
      path: "/saveShow",
    },
    {
      id: 10,
      name: "likeShow",
      component: <LikeShow />,
      path: "/likeShow",
    },
    {
      id: 11,
      name: "commentShow",
      component: <CommentShow />,
      path: "/commentShow",
    },
    {
      id: 12,
      name: "search",
      component: <Search />,
      path: "/search",
    },
    {
      id: 13,
      name: "setting",
      component: <Setting />,
      path: "/setting",
    },
    {
      id: 14,
      name: "followRequest",
      component: <FollowRequest />,
      path: "/followRequest",
    },
  ];
  return (
    <Router>
      {routes.map(({ id, name, path, component }) => {
        return (
          <Route
            key={id}
            path={path}
            element={<PrivateRoute>{component}</PrivateRoute>}
          />
        );
      })}
    </Router>
  );
};

export default Routes;
