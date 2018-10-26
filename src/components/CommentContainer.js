import React, { Component } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Comment, Header } from "semantic-ui-react";
import AddCommentToPhoto from "./AddCommentToPhoto";
import CommentList from "./CommentList";

export const COMMENT_QUERY = gql`
   query($eventId: ID!) {
      getComment(eventId: $eventId, orderBy: createdAt_DESC) {
         id
         text
         createdAt
         user {
            id
            username
         }
         createdAt
      }
   }
`;

const COMMENT_SUBSCRIPTION = gql`
   subscription($eventId: ID!) {
      comment(eventId: $eventId) {
         mutation
         node {
            id
            text
            createdAt
            user {
               id
               username
            }
         }
         previousValues {
            id
         }
      }
   }
`;
export default class CommentContainer extends Component {
   render() {
      const { eventId } = this.props;
      return (
         <Comment.Group size="mini">
            <Header as="h3" dividing>
               Comments
            </Header>
            <Query query={COMMENT_QUERY} variables={{ eventId }}>
               {({ subscribeToMore, ...result }) => (
                  <CommentList
                     {...result}
                     subscribeToNewComment={() => {
                        subscribeToMore({
                           document: COMMENT_SUBSCRIPTION,
                           variables: { eventId },
                           updateQuery: (prev, { subscriptionData }) => {
                              if (!subscriptionData.data) return prev;
                              const newComment = subscriptionData.data.comment;
                              if (newComment.mutation === "DELETED") {
                                 const id = newComment.previousValues.id;
                                 return {
                                    ...prev,
                                    getComment: prev.getComment.filter(
                                       comment => comment.id !== id
                                    )
                                 };
                              }
                              return {
                                 ...prev,
                                 getComment: [
                                    newComment.node,
                                    ...prev.getComment
                                 ]
                              };
                           }
                        });
                     }}
                  />
               )}
            </Query>

            <AddCommentToPhoto eventId={eventId} />
         </Comment.Group>
      );
   }
}
