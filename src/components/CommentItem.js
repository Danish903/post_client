import React, { Component } from "react";
import { Comment } from "semantic-ui-react";
import moment from "moment";
export default class CommentItem extends Component {
   render() {
      const { comment } = this.props;
      return (
         <Comment>
            <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
            <Comment.Content>
               <Comment.Author as="a">{comment.user.username}</Comment.Author>
               <Comment.Metadata>
                  <div>{moment(comment.createdAt).fromNow()}</div>
               </Comment.Metadata>
               <Comment.Text>
                  <p>{comment.text}</p>
               </Comment.Text>
               {/* <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
               </Comment.Actions> */}
            </Comment.Content>
         </Comment>
      );
   }
}
