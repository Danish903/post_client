import React from "react";
import { Route, Redirect } from "react-router-dom";
import Loader from "../components/Loader";
import User from "../components/User";

const PublicRoute = ({ component: Component, ...rest }) => (
   <User>
      {({ data: { me }, loading }) => {
         if (loading) return <Loader />;
         return (
            <Route
               {...rest}
               render={props =>
                  me ? <Redirect to="/" /> : <Component {...props} />
               }
            />
         );
      }}
   </User>
);

export default PublicRoute;
