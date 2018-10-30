import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Comment } from "semantic-ui-react";
import moment from "moment";
import User from "./User";
import EditComment from "./EditComment";
import { COMMENT_QUERY } from "./CommentContainer";
import Loader from "./Loader";

const DELETE_COMMENT_MUTATION = gql`
   mutation($id: ID!, $eventId: ID!) {
      deleteComment(id: $id, eventId: $eventId) {
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
      const { comment, eventId, host } = this.props;
      const { user } = comment;
      const { isEditing } = this.state;
      // console.log(host);
      return (
         <User>
            {({ data: { me }, loading }) => {
               if (loading) return <Loader />;
               const commentedUser = !isEditing && me && me.id === user.id;
               const isOwner = me && me.id === host.id;
               const canDelete = commentedUser || isOwner;

               return (
                  <Comment>
                     <div style={{ display: "flex" }}>
                        <div className="commentAvatar">
                           <p>{user.username[0]}</p>
                        </div>
                        <Comment.Content>
                           <Comment.Author as="a">
                              {comment.user.username}
                           </Comment.Author>
                           <Comment.Metadata>
                              <div>{moment(comment.createdAt).fromNow()}</div>
                           </Comment.Metadata>
                           <div style={{ flex: 1 }}>
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
                           </div>

                           {canDelete && (
                              <Mutation
                                 mutation={DELETE_COMMENT_MUTATION}
                                 variables={{ id: comment.id, eventId }}
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
                                       {commentedUser && (
                                          <Comment.Action
                                             onClick={this.handleEdit}
                                          >
                                             Edit
                                          </Comment.Action>
                                       )}
                                    </Comment.Actions>
                                 )}
                              </Mutation>
                           )}
                        </Comment.Content>
                     </div>
                  </Comment>
               );
            }}
         </User>
      );
   }
}
