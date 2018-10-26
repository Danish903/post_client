import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Comment } from "semantic-ui-react";
import moment from "moment";
import User from "./User";
import EditComment from "./EditComment";
import { COMMENT_QUERY } from "./CommentContainer";

const DELETE_COMMENT_MUTATION = gql`
   mutation($id: ID!) {
      deleteComment(id: $id) {
         id
      }
   }
`;
export default class CommentItem extends Component {
   state = { isEditing: false };

   handleEdit = () => {
      this.setState(prev => ({ isEditing: !prev.isEditing }));
   };
   _deleteUpdate = (cache, { data: { deleteComment } }) => {
      const { eventId } = this.props;
      const data = cache.readQuery({
         query: COMMENT_QUERY,
         variables: { eventId }
      });
      data.getComment = data.getComment.filter(
         comment => comment.id !== deleteComment.id
      );
      cache.writeQuery({
         query: COMMENT_QUERY,
         variables: { eventId },
         data
      });
   };
   render() {
      const { comment } = this.props;
      const { user } = comment;
      const { isEditing } = this.state;
      return (
         <User>
            {({ data: { me } }) => (
               <Comment>
                  <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
                  <Comment.Content>
                     <Comment.Author as="a">
                        {comment.user.username}
                     </Comment.Author>
                     <Comment.Metadata>
                        <div>{moment(comment.createdAt).fromNow()}</div>
                     </Comment.Metadata>
                     <Comment.Text>
                        {isEditing ? (
                           <EditComment
                              comment={comment}
                              onCancel={this.handleEdit}
                              key={comment.id}
                              eventId={this.props.eventId}
                              me={me}
                           />
                        ) : (
                           <p>{comment.text}</p>
                        )}
                     </Comment.Text>
                     {!isEditing &&
                        me &&
                        me.id === user.id && (
                           <Mutation
                              mutation={DELETE_COMMENT_MUTATION}
                              variables={{ id: comment.id }}
                              update={this._deleteUpdate}
                              optimisticResponse={{
                                 __typename: "Mutation",
                                 deleteComment: {
                                    __typename: "Comment",
                                    id: comment.id
                                 }
                              }}
                           >
                              {deleteComment => (
                                 <Comment.Actions>
                                    <Comment.Action
                                       style={{ color: "#BB2B2D" }}
                                       onClick={deleteComment}
                                    >
                                       Delete
                                    </Comment.Action>
                                    <Comment.Action onClick={this.handleEdit}>
                                       Edit
                                    </Comment.Action>
                                 </Comment.Actions>
                              )}
                           </Mutation>
                        )}
                  </Comment.Content>
               </Comment>
            )}
         </User>
      );
   }
}
