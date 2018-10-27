import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Checkbox } from "semantic-ui-react";
import User from "./User";
import { EVENT_QUERY } from "./PhotoDetails";
import { toast } from "react-semantic-toasts";

const UPDATE_EVENT_MUTATION = gql`
   mutation(
      $id: ID!
      $title: String
      $description: String
      $published: Boolean
      $imageURL: String
      $disableComment: Boolean
   ) {
      updateEvent(
         id: $id
         data: {
            title: $title
            description: $description
            published: $published
            imageURL: $imageURL
            disableComment: $disableComment
         }
      ) {
         id
         title
         description
         published
         imageURL
         disableComment
         likes {
            id
         }
         createdAt
         host {
            id
            username
         }
      }
   }
`;

class DisableComment extends Component {
   state = {
      disableComment: this.props.event.disableComment
   };

   _onChange = async (data, updateEvent) => {
      const { name, checked } = data;
      this.setState(prev => ({ [name]: !prev.disableComment }));
      const disableComment = checked;
      const action = disableComment ? "disabled" : "enabled";
      try {
         toast({
            description: `Comments for this post has been ${action}.`,
            icon: "warning sign",
            type: "success"
         });
      } catch (error) {}
      await updateEvent({
         variables: {
            id: this.props.event.id,
            disableComment
         }
      });
   };

   render() {
      const { event } = this.props;

      const { id, username } = event.host;
      return (
         <User>
            {({ data: { me } }) => {
               const isOwner = me && me.id === event.host.id;
               if (isOwner) {
                  return (
                     <Mutation
                        mutation={UPDATE_EVENT_MUTATION}
                        refetchQueries={[
                           {
                              query: EVENT_QUERY,
                              variables: { id: this.props.event.id }
                           }
                        ]}
                        update={this._onUpdate}
                        optimisticResponse={{
                           __typename: "Mutation",
                           updateEvent: {
                              __typename: "Event",
                              id: event.id,
                              title: event.title,
                              description: event.description,
                              published: event.published,
                              imageURL: event.imageURL,
                              disableComment: !event.disableComment,
                              likes: {
                                 __typename: "FavoriteEvent",
                                 id: -1
                              },
                              createdAt: event.createdAt,
                              host: {
                                 __typename: "User",
                                 id,
                                 username
                              }
                           }
                        }}
                     >
                        {updateEvent => (
                           <Checkbox
                              toggle
                              name="disableComment"
                              checked={this.state.disableComment}
                              label="Disable Comment"
                              onChange={(e, data) =>
                                 this._onChange(data, updateEvent)
                              }
                           />
                        )}
                     </Mutation>
                  );
               }
               return null;
            }}
         </User>
      );
   }
}

export default DisableComment;
