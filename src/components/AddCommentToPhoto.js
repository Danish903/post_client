import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import uuid from "uuid/v4";

import { Form, Input, Button } from "semantic-ui-react";
import { COMMENT_QUERY } from "./CommentContainer";
import User from "./User";
import { toast } from "react-semantic-toasts";

const CREATE_COMMNET_MUTATION = gql`
   mutation($eventId: ID!, $text: String!) {
      createComment(data: { eventId: $eventId, text: $text }) {
         id
         text
         createdAt
         user {
            id
            username
         }
      }
   }
`;

class AddCommentToPhoto extends React.PureComponent {
   state = {
      text: ""
   };
   handleSubmit = async createComment => {
      if (!!this.state.text) {
         try {
            this.setState(() => ({ text: "" }));
            await createComment({
               variables: {
                  text: this.state.text,
                  eventId: this.props.eventId
               }
            });
         } catch (error) {
            const msg = error.message.split(":").pop();
            toast({
               description: `${msg}`,
               icon: "warning sign",
               type: "error"
            });
         }
      }
   };

   _onChange = e => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
   };

   _update = (cache, { data: { createComment } }) => {
      const { eventId } = this.props;
      const data = cache.readQuery({
         query: COMMENT_QUERY,
         variables: { eventId }
      });

      data.getComment = [createComment, ...data.getComment];
      cache.writeQuery({
         query: COMMENT_QUERY,
         variables: { eventId },
         data
      });
   };
   render() {
      return (
         <User>
            {({ data: { me } }) => (
               <Mutation
                  mutation={CREATE_COMMNET_MUTATION}
                  optimisticResponse={{
                     __typename: "Mutation",
                     createComment: {
                        __typename: "Comment",
                        id: uuid(),
                        text: this.state.text,
                        createdAt: new Date(),
                        user: {
                           __typename: "User",
                           id: me ? me.id : 1234,
                           username: me ? me.username : "username"
                        }
                     }
                  }}
                  update={this._update}
               >
                  {(createComment, { loading }) => {
                     return (
                        <Form
                           reply
                           onSubmit={() => this.handleSubmit(createComment)}
                        >
                           <Input
                              fluid
                              type="text"
                              placeholder="Add comment..."
                              action
                              name="text"
                              value={this.state.text}
                              onChange={this._onChange}
                              disabled={!me}
                           >
                              <input
                                 style={!me ? null : { borderColor: "#767676" }}
                              />
                              <Button
                                 basic
                                 color="grey"
                                 disabled={loading || !me}
                                 type="submit"
                              >
                                 Send
                              </Button>
                           </Input>
                        </Form>
                     );
                  }}
               </Mutation>
            )}
         </User>
      );
   }
}

export default AddCommentToPhoto;
