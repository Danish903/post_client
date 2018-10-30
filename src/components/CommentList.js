import React, { Component } from "react";
import CommentItem from "./CommentItem";
import { Loader } from "semantic-ui-react";
import _ from "lodash";
export default class CommentList extends Component {
   state = {
      hasMoreComments: true
   };
   componentDidMount() {
      this.props.subscribeToNewComment();
   }

   handleScroll = () => {
      const { data, eventId, fetchMore } = this.props;
      const { getComment: comments } = data;
      if (
         this.scroller &&
         this.scroller.scrollTop === 0 &&
         this.state.hasMoreComments &&
         comments.length >= 18
      ) {
         fetchMore({
            variables: {
               eventId,
               after: comments[comments.length - 1].id
            },
            updateQuery: (prev, { fetchMoreResult }) => {
               if (!fetchMoreResult) return prev;
               if (fetchMoreResult.getComment.length < 18) {
                  this.setState({ hasMoreComments: false });
               }
               const data = _.uniqBy(
                  [...prev.getComment, ...fetchMoreResult.getComment],
                  "id"
               );
               return {
                  ...prev,
                  getComment: [...data]
               };
            }
         });
      }
   };
   render() {
      const { data, loading, eventId, host } = this.props;
      if (loading) return <p>loading...</p>;
      const { getComment: comments } = data;

      return (
         <div
            className="commentMessageContainer"
            onScroll={this.handleScroll}
            ref={scroller => {
               this.scroller = scroller;
            }}
         >
            {comments.map(comment => {
               return (
                  <CommentItem
                     eventId={eventId}
                     key={comment.id}
                     comment={comment}
                     host={host}
                  />
               );
            })}
            {this.state.hasMoreComments &&
               comments.length >= 18 && (
                  <Loader size="mini" active inline="centered">
                     Loading..
                  </Loader>
               )}
         </div>
      );
   }
}
