import React from "react";
import { Route, Redirect } from "react-router-dom";
import User from "../components/User";
import Loader from "../components/Loader";
const PrivateRoute = ({ component: Component, ...rest }) => {
   return (
      <User>
         {({ data: { me }, loading }) => {
            if (loading) return <Loader />;
            return (
               <Route
                  {...rest}
                  render={props =>
                     !!me ? (
                        <Component {...props} />
                     ) : (
                        <Redirect to={"/login"} />
                     )
                  }
               />
            );
         }}
      </User>
   );
};

export default PrivateRoute;
