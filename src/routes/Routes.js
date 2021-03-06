import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EventDashboard from "../components/EventDashboard";
import Signup from "../components/Signup";
import Login from "../components/Login";
import Nav from "../components/Nav";
import AddPhoto from "../components/AddPhoto";
import PhotoDetails from "../components/PhotoDetails";
import PageNotFound from "../components/PageNotFound";
import { SemanticToastContainer } from "react-semantic-toasts";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ScrollToTop from "../components/ScrollToTop";
import UserProfile from "../components/UserProfile";

const Routes = () => (
   <Router>
      <ScrollToTop>
         <Nav />
         <SemanticToastContainer />
         <Switch>
            <Route exact path="/" component={EventDashboard} />
            <PublicRoute exact path="/signup" component={Signup} />
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/uploadImage" component={AddPhoto} />
            <Route path="/photoDetails/:id" component={PhotoDetails} />
            <PrivateRoute path="/userprofile" component={UserProfile} />
            <Route component={PageNotFound} />
         </Switch>
      </ScrollToTop>
   </Router>
);

export default Routes;
