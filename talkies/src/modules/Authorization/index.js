import React from "react";
import Form from "./form";
const Auth = () => {
  const isSignInPage = window.location.pathname.includes("signin");
  return (
    <div>
      <Form isSignInPage={isSignInPage} />
    </div>
  );
};

export default Auth;
