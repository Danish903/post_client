import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Form, Input, Comment } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import { COMMENT_QUERY } from "./CommentContainer";

const UPDATE_COMMENT_MUTATION = gql`
   mutation($id: ID!, $text: String) {
      updateComment(id: $id, data: { text: $text }) {
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
export default class EditComment extends Component {
   state = {
      text: this.props.comment.text
   };

   _onChange = e => {
      const { name, value } = e.target;
      this.setState(() => ({ [name]: value }));
   };
   handleUpdateComment = async updateComment => {
      if (!!this.state.text) {
         const variables = {
            id: this.props.comment.id,
            text: this.state.text
         };
         this.props.onCancel();
         await updateComment({
            variables
         }).catch(error => {
            toast({
               description: `${error.message}`,
               icon: "warning sign",
               type: "error"
            });
         });
      } else {
         toast({
            description: `Can't update empty message`,
            icon: "info",
            type: "info"
         });
      }
   };
   updateCache = (cache, { data: { updateComment } }) => {
      const { eventId } = this.props;
      const data = cache.readQuery({
         query: COMMENT_QUERY,
         variables: { eventId }
      });
      data.getComment = data.getComment.map(comment => {
         if (comment.id === updateComment.id) {
            return {
               ...comment,
               ...updateComment
            };
         }
         return comment;
      });
      cache.writeQuery({
         query: COMMENT_QUERY,
         variables: { eventId },
         data
      });
   };
   render() {
      const { onCancel } = this.props;

      return (
         <Mutation
            mutation={UPDATE_COMMENT_MUTATION}
            update={this.updateCache}
            optimisticResponse={{
               __typename: "Mutation",
               updateComment: {
                  __typename: "Comment",
                  id: this.props.comment.id,
                  text: this.state.text,
                  createdAt: this.props.comment.createdAt,
                  user: {
                     __typename: "User",
                     id: this.props.me.id,
                     username: this.props.me.username
                  }
               }
            }}
         >
            {updateComment => (
               <Form onSubmit={() => this.handleUpdateComment(updateComment)}>
                  <Input
                     fluid
                     type="text"
                     placeholder="update comment"
                     name="text"
                     value={this.state.text}
                     size="mini"
                     onChange={this._onChange}
                  >
                     <input />
                  </Input>
                  <Comment.Actions>
                     <Comment.Action
                        onClick={() => this.handleUpdateComment(updateComment)}
                     >
                        save
                     </Comment.Action>
                     <Comment.Action onClick={onCancel}>cancel</Comment.Action>
                  </Comment.Actions>
               </Form>
            )}
         </Mutation>
      );
   }
}
