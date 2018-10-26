import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EventDashboard from "../components/EventDashboard";
import Signup from "../components/Signup";
import Login from "../components/Login";
import Nav from "../components/Nav";
import AddPhoto from "../components/AddPhoto";
import PhotoDetails from "../components/PhotoDetails";
import { SemanticToastContainer } from "react-semantic-toasts";
const Routes = () => (
   <Router>
      <Fragment>
         <Nav />
         <SemanticToastContainer />
         <Switch>
            <Route exact path="/" component={EventDashboard} />
            <Route exact path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/createevent" component={AddPhoto} />
            <Route path="/photoDetails/:id" component={PhotoDetails} />
         </Switch>
      </Fragment>
   </Router>
);

export default Routes;
