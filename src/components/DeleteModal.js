import React, { Component } from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { USER_POST_QUERY } from "./UserProfile";

const DELETE_POST_MUTATION = gql`
   mutation($id: ID!, $img_ID: String) {
      deletePost(id: $id, img_ID: $img_ID) {
         id
      }
   }
`;
class ModalExampleDimmer extends Component {
   state = { open: false };

   show = dimmer => () => this.setState({ dimmer, open: true });
   close = () => {
      this.setState({ open: false });
   };

   deletePost = async deletePost => {
      this.setState({ open: false });
      await deletePost();
   };
   _update = (cache, { data: { deletePost } }) => {
      const data = cache.readQuery({ query: USER_POST_QUERY });
      data.userPosts = data.userPosts.filter(post => post.id !== deletePost.id);
      cache.writeQuery({ query: USER_POST_QUERY, data });
   };

   render() {
      const { open } = this.state;
      const { event } = this.props;
      return (
         <Mutation
            mutation={DELETE_POST_MUTATION}
            variables={{ id: event.id, img_ID: event.imageURL_ID }}
            update={this._update}
            optimisticResponse={{
               __typename: "Mutation",
               deletePost: {
                  __typename: "Event",
                  id: event.id
               }
            }}
         >
            {deletePost => (
               <>
                  <Button
                     basic
                     color="red"
                     style={{ width: "100%" }}
                     onClick={this.show(true)}
                  >
                     Delete this post
                  </Button>

                  <Modal open={open} onClose={this.close} size="small">
                     <Modal.Header>Delete This Post </Modal.Header>
                     <Modal.Content image>
                        <Image wrapped src={event.imageURL} size="small" />
                        <Modal.Description>
                           <Header>{event.title}</Header>
                           <p>{event.Description}</p>
                           <p>Do you really want to delete this post?</p>
                        </Modal.Description>
                     </Modal.Content>
                     <Modal.Actions>
                        <Button color="black" onClick={this.close}>
                           Nope
                        </Button>
                        <Button
                           icon="checkmark"
                           labelPosition="right"
                           content="Delete"
                           onClick={() => this.deletePost(deletePost)}
                           color="red"
                        />
                     </Modal.Actions>
                  </Modal>
               </>
            )}
         </Mutation>
      );
   }
}

export default ModalExampleDimmer;
