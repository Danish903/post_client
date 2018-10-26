import React, { Component } from "react";
import { Button, Menu } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import User from "./User";
import { toast } from "react-semantic-toasts/build/toast";

class Nav extends Component {
   state = { activeItem: "home" };

   handleItemClick = (e, { name }) => {
      this.setState({ activeItem: name });
      this.props.history.push("/");
   };

   navigateToSignUp = () => this.props.history.push("/signup");
   handleLogout = client => {
      localStorage.clear();
      client.resetStore();

      toast({
         description: `You've been successfully logged out!`,
         icon: "warning sign",
         type: "success"
      });
   };
   render() {
      const { activeItem } = this.state;
      return (
         <User>
            {({ client, data: { me }, loading }) => {
               return (
                  <Menu size="tiny">
                     <Menu.Item
                        name="home"
                        active={activeItem === "home"}
                        onClick={this.handleItemClick}
                     />
                     {me && (
                        <Menu.Menu position="right">
                           <Menu.Item>
                              <Button
                                 as={Link}
                                 to="/createEvent"
                                 basic
                                 color="teal"
                                 content="Create a post"
                              />
                           </Menu.Item>
                           <Menu.Item>
                              <Button
                                 basic
                                 color="red"
                                 content="Logout"
                                 onClick={() => this.handleLogout(client)}
                              />
                           </Menu.Item>
                        </Menu.Menu>
                     )}

                     {!me && (
                        <Menu.Menu position="right">
                           <Menu.Item>
                              <Button
                                 as={Link}
                                 to="/login"
                                 basic
                                 color="grey"
                                 content="Login"
                              />
                           </Menu.Item>
                           <Menu.Item>
                              <Button
                                 basic
                                 color="grey"
                                 content="Signup"
                                 as={Link}
                                 to="/signup"
                              />
                           </Menu.Item>
                        </Menu.Menu>
                     )}
                  </Menu>
               );
            }}
         </User>
      );
   }
}
export default withRouter(Nav);
