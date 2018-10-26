import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Form, Input, Button } from "semantic-ui-react";
import { COMMENT_QUERY } from "./CommentContainer";
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
            await createComment({
               variables: {
                  text: this.state.text,
                  eventId: this.props.eventId
               }
            });

            this.setState(() => ({ text: "" }));
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

   _update = (cache, payload) => {
      const data = cache.readQuery({
         query: COMMENT_QUERY,
         variables: { eventId: this.props.eventId }
      });

      cache.writeQuery({
         query: COMMENT_QUERY,
         variables: { eventId: this.props.eventId },
         data: {
            ...data,
            getComment: [payload.data.createComment, ...data.getComment]
         }
      });
   };
   render() {
      return (
         <Mutation
            mutation={CREATE_COMMNET_MUTATION}
            // optimisticResponse={{
            //    __typename: "Mutation",
            //    createComment: {
            //       __typename: "Comment",
            //       id: -2343434,
            //       text: this.state.text,
            //       createdAt: new Date()
            //    }
            // }}
            // update={this._update}
         >
            {(createComment, { loading }) => {
               return (
                  <Form reply onSubmit={() => this.handleSubmit(createComment)}>
                     <Input
                        fluid
                        type="text"
                        placeholder="Add comment..."
                        action
                        name="text"
                        value={this.state.text}
                        onChange={this._onChange}
                     >
                        <input />
                        <Button loading={loading} type="submit">
                           Send
                        </Button>
                     </Input>
                  </Form>
               );
            }}
         </Mutation>
      );
   }
}

export default AddCommentToPhoto;
