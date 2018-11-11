import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Grid, Card, Label, Icon, Form, Checkbox } from "semantic-ui-react";
import DeleteModal from "./DeleteModal";
export default class UserPostsList extends Component {
   state = {
      modalToggle: false
   };
   componentDidMount() {
      this.props.subscribeToUserPosts();
   }

   toggleModal = () => {
      this.setState(prev => ({
         ...prev,
         modalToggle: !prev.modalToggle
      }));
   };
   render() {
      const {
         data: { userPosts },
         loading,
         error
      } = this.props;

      if (loading) return null;
      if (error) return <p>Error</p>;
      return (
         <Grid style={{ paddingLeft: "50px" }}>
            {userPosts.map((event, i) => (
               <Card
                  key={event.id}
                  style={{
                     marginRight: "40px",
                     marginTop: i === 0 ? "60px !important" : 0,
                     position: "relative",
                     marginBottom: userPosts.length - 1 === i ? "14px" : null
                  }}
               >
                  <Link to={`/photoDetails/${event.id}`}>
                     <img
                        src={event.imageURL}
                        alt={event.name}
                        className="userPostsImage"
                     />
                  </Link>

                  {!event.published && (
                     <Label
                        as="a"
                        color="red"
                        ribbon="right"
                        style={{ transform: "translateX(-105%)" }}
                     >
                        This post is private.
                     </Label>
                  )}
                  <Card.Content>
                     <Card.Header>{event.title}</Card.Header>
                     <Card.Meta>
                        {" "}
                        created: {moment(event.createdAt).format("LL")}
                     </Card.Meta>
                     <Card.Meta>
                        {" "}
                        last updated: {moment(event.updatedAt).format("LL")}
                     </Card.Meta>
                     <Card.Description>{event.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra className="infoContainer">
                     <div style={{ marginRight: "auto" }}>
                        <p>
                           <Icon name="heart" />
                           {event.likes.length}
                        </p>
                        <Form.Field>
                           <Checkbox
                              type="checkbox"
                              checked={!event.published}
                              label={event.published ? "Public" : "Private"}
                              name="published"
                           />
                        </Form.Field>
                     </div>
                     <div>
                        <p>
                           <Icon name="comment outline" />
                           {event.comments.length}
                        </p>
                        <Icon
                           name="close"
                           color="red"
                           onClick={this.toggleModal}
                        />
                     </div>
                  </Card.Content>
                  <DeleteModal
                     modalToggle={this.state.modalToggle}
                     event={event}
                  />
               </Card>
            ))}
         </Grid>
      );
   }
}
