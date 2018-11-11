import React, { Component } from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";

class ModalExampleDimmer extends Component {
   state = { open: false };

   show = dimmer => () => this.setState({ dimmer, open: true });
   close = () => this.setState({ open: false });

   render() {
      const { open } = this.state;
      const { event } = this.props;
      return (
         <div>
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
                     onClick={this.close}
                     color="red"
                  />
               </Modal.Actions>
            </Modal>
         </div>
      );
   }
}

export default ModalExampleDimmer;
