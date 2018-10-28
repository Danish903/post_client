import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Button } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import debounce from "lodash.debounce";
import { ME_QUERY } from "./User";

import _ from "lodash";
import User from "./User";

const LIKE_SUBSCRIPTION = gql`
   subscription($eventId: ID!) {
      favoriteEvent(eventId: $eventId) {
         mutation
         node {
            id
            event {
               id
               likes {
                  id
               }
            }
         }
         previousValues {
            id
         }
      }
   }
`;

const GET_FAVORITES_QUERY = gql`
   query($eventId: ID!) {
      getFavoriteEvent(eventId: $eventId) {
         id
         event {
            id
            likes {
               id
            }
         }
      }
   }
`;
const LIKE_PHOTO_MUTATION = gql`
   mutation($id: ID!) {
      likePhoto(id: $id) {
         id
         event {
            id
            likes {
               id
            }
         }
      }
   }
`;

const UNLIKE_PHOTO_MUTATION = gql`
   mutation($id: ID!, $favId: ID!) {
      unLikePhoto(id: $id, favId: $favId) {
         id
      }
   }
`;
class LikeCount extends Component {
   componentDidMount() {
      this.props.subscribeToNewLike();
   }

   disLikePhotoUpdate = (cache, { data: { unLikePhoto } }) => {
      const data = cache.readQuery({ query: ME_QUERY });
      data.me.favorites = data.me.favorites.filter(
         fav => fav.event.id !== this.props.id
      );
      cache.writeQuery({ query: ME_QUERY, data });
      const data2 = cache.readQuery({
         query: GET_FAVORITES_QUERY,
         variables: { eventId: this.props.id }
      });
      data2.getFavoriteEvent = data2.getFavoriteEvent.filter(
         fav => fav.id !== unLikePhoto.id
      );
      cache.writeQuery({
         query: GET_FAVORITES_QUERY,
         variables: { eventId: this.props.id },
         data: { ...data2 }
      });
   };

   likePhotoUpdate = (cache, { data: likePhoto }) => {
      const data = cache.readQuery({ query: ME_QUERY });
      data.me.favorites = [...data.me.favorites, likePhoto.likePhoto];
      cache.writeQuery({ query: ME_QUERY, data });

      const data2 = cache.readQuery({
         query: GET_FAVORITES_QUERY,
         variables: { eventId: this.props.id }
      });
      data2.getFavoriteEvent = [...data2.getFavoriteEvent, likePhoto.likePhoto];
      data2.getFavoriteEvent = _.uniqBy(data2.getFavoriteEvent, "id");

      cache.writeQuery({
         query: GET_FAVORITES_QUERY,
         variables: { eventId: this.props.id },
         data: { ...data2 }
      });
   };
   handleLike = debounce(async (likePhoto, unLikePhoto, isLiked) => {
      if (isLiked) {
         try {
            await unLikePhoto();
         } catch (error) {}
      } else {
         try {
            await likePhoto();
         } catch (error) {}
      }
   }, 200);
   render() {
      const { id, data, loading, exist, authenticated, isLiked } = this.props;
      if (loading) return <p>loading</p>;
      return (
         <Mutation
            mutation={LIKE_PHOTO_MUTATION}
            variables={{ id: id }}
            optimisticResponse={{
               __typename: "Mutation",
               likePhoto: {
                  __typename: "FavoriteEvent",
                  id: -123243434,
                  event: {
                     __typename: "Event",
                     id,
                     likes: [
                        {
                           __typename: "FavoriteEvent",
                           id: -123232
                        }
                     ]
                  }
               }
            }}
            // refetchQueries={[{ query: ME_QUERY }]}
            update={this.likePhotoUpdate}
         >
            {likePhoto => {
               return (
                  <Mutation
                     mutation={UNLIKE_PHOTO_MUTATION}
                     variables={{
                        id,
                        favId: !!exist ? exist.id : null
                     }}
                     optimisticResponse={{
                        __typename: "Mutation",
                        unLikePhoto: {
                           __typename: "FavoriteEvent",
                           id: !!exist ? exist.id : -123232
                        }
                     }}
                     refetchQueries={[{ query: ME_QUERY }]}
                     update={this.disLikePhotoUpdate}
                  >
                     {(unLikePhoto, { error }) => {
                        let length;
                        if (!data) {
                           length = 0;
                        }
                        return (
                           <Button
                              as="div"
                              labelPosition="right"
                              disabled={!authenticated}
                              size="mini"
                              onClick={() =>
                                 this.handleLike(
                                    likePhoto,
                                    unLikePhoto,
                                    isLiked
                                 )
                              }
                           >
                              <Button
                                 content={isLiked ? "Liked" : "Like"}
                                 size="mini"
                                 color={isLiked ? "red" : null}
                                 icon="heart"
                                 label={{
                                    as: "a",
                                    basic: true,
                                    content:
                                       length === 0
                                          ? 0
                                          : data.getFavoriteEvent.length
                                    // !!data &&
                                    // data.getFavoriteEvent.length === 0
                                    //    ? 0
                                    //    : data.getFavoriteEvent.length
                                 }}
                                 labelPosition="right"
                              />
                           </Button>
                        );
                     }}
                  </Mutation>
               );
            }}
         </Mutation>
      );
   }
}

class LikeButton extends Component {
   state = {
      like: false
   };
   handleLike = debounce(async (likePhoto, unLikePhoto, isLiked) => {
      if (isLiked) {
         try {
            await unLikePhoto();
         } catch (error) {
            toast({
               title: "Error",
               description: "You already unlike this post",
               icon: "warning sign",
               type: "error"
            });
         }
      } else {
         try {
            await likePhoto();
         } catch (error) {
            toast({
               title: "Error",
               description: `${error.message}`,
               icon: "warning sign",
               type: "error"
            });
         }
      }
   }, 200);

   render() {
      const { id } = this.props;

      return (
         <User>
            {({ data, loading }) => {
               const authenticated = !!data && !!data.me;
               let exist = false;
               let isLiked = false;
               if (authenticated) {
                  const { me } = data;
                  exist = me.favorites.find(fav => fav.event.id === id);

                  isLiked = !!exist;
               }

               return (
                  <Query
                     query={GET_FAVORITES_QUERY}
                     variables={{ eventId: id }}
                  >
                     {({ subscribeToMore, ...result }) => {
                        return (
                           <LikeCount
                              id={id}
                              data={data}
                              exist={exist}
                              authenticated={authenticated}
                              isLiked={isLiked}
                              {...result}
                              subscribeToNewLike={() => {
                                 subscribeToMore({
                                    document: LIKE_SUBSCRIPTION,
                                    variables: { eventId: id },
                                    updateQuery: (
                                       prev,
                                       { subscriptionData }
                                    ) => {
                                       if (!subscriptionData.data) return prev;
                                       const newLike =
                                          subscriptionData.data.favoriteEvent;

                                       if (newLike.mutation === "DELETED") {
                                          const id = newLike.previousValues.id;

                                          return {
                                             ...prev,
                                             getFavoriteEvent: prev.getFavoriteEvent.filter(
                                                fav => fav.id !== id
                                             )
                                          };
                                       }
                                       return {
                                          ...prev,
                                          getFavoriteEvent: [
                                             newLike.node,
                                             ...prev.getFavoriteEvent
                                          ]
                                       };
                                    }
                                 });
                              }}
                           />
                        );
                     }}
                  </Query>
               );
            }}
         </User>
      );
   }
}
export default LikeButton;
