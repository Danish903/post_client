import React from "react";
import { Route, Redirect } from "react-router-dom";

import jsonwebtoken from "jsonwebtoken";

export const isAuthenticate = () => {
   const jwt = localStorage.getItem("token");
   if (!jwt) return false;
   const decoded = jsonwebtoken.decode(jwt);
   if (!decoded) return false;
   if (!(Date.now() / 1000 < decoded.exp)) return false;
   return true;
};
const PrivateRoute = ({ component: Component, ...rest }) => {
   return (
      <Route
         {...rest}
         render={props =>
            isAuthenticate() ? (
               <Component {...props} />
            ) : (
               <Redirect to={"/login"} />
            )
         }
      />
   );
};

export default PrivateRoute;
