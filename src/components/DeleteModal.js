import React, { Component } from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

const DELETE_POST_MUTATION = gql`
   mutation($id: ID!) {
      deletePost(id: $id) {
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

   render() {
      const { open } = this.state;
      const { event } = this.props;
      return (
         <Mutation mutation={DELETE_POST_MUTATION} variables={{ id: event.id }}>
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
