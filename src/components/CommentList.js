import React, { Component } from "react";
import CommentItem from "./CommentItem";
export default class CommentList extends Component {
   componentDidMount() {
      this.props.subscribeToNewComment();
   }
   render() {
      const { data, loading } = this.props;
      if (loading) return <p>loading</p>;
      const { getComment: comments } = data;
      return (
         <div className="commentMessageContainer">
            {comments.map(comment => {
               if (!comment) return null;
               return <CommentItem key={comment.id} comment={comment} />;
            })}
         </div>
      );
   }
}
