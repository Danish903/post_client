import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticate } from "./PrivateRoute";
const PublicRoute = ({ component: Component, ...rest }) => {
   return (
      <Route
         {...rest}
         render={props =>
            isAuthenticate() ? <Redirect to="/" /> : <Component {...props} />
         }
      />
   );
};

export default PublicRoute;
