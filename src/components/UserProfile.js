import React, { Component } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import UserPostsList from "./UserPostsList";

export const USER_POST_QUERY = gql`
   query {
      userPosts(orderBy: createdAt_DESC) {
         id
         title
         imageURL
         likes {
            id
         }
         description
         published
         disableComment
         createdAt
         updatedAt
         comments {
            id
         }
      }
   }
`;

export const USER_POSTS_SUBSCRIPTION = gql`
   subscription {
      userPost {
         mutation
         node {
            id
            title
            imageURL
            likes {
               id
            }
            description
            published
            disableComment
            createdAt
            updatedAt
            comments {
               id
            }
         }
         previousValues {
            id
         }
      }
   }
`;

class UserProfile extends Component {
   render() {
      return (
         <Query query={USER_POST_QUERY}>
            {({ subscribeToMore, ...result }) => {
               return (
                  <UserPostsList
                     {...result}
                     subscribeToUserPosts={() =>
                        subscribeToMore({
                           document: USER_POSTS_SUBSCRIPTION,
                           updateQuery: (prev, { subscriptionData }) => {
                              if (!subscriptionData.data) return prev;
                              const newUserPost =
                                 subscriptionData.data.userPost;
                              if (newUserPost.mutation === "UPDATED") {
                                 return {
                                    ...prev,
                                    userPosts: prev.userPosts.map(post => {
                                       if (post.id === newUserPost.node.id) {
                                          return {
                                             ...post,
                                             ...newUserPost.node
                                          };
                                       }
                                       return post;
                                    })
                                 };
                              } else if (newUserPost.mutation === "DELETED") {
                                 const id = newUserPost.previousValues.id;
                                 return {
                                    ...prev,
                                    userPosts: prev.userPosts.filter(
                                       post => post.id !== id
                                    )
                                 };
                              }
                              return {
                                 ...prev,
                                 userPosts: [
                                    newUserPost.node,
                                    ...prev.userPosts
                                 ]
                              };
                           }
                        })
                     }
                  />
               );
            }}
         </Query>
      );
   }
}
export default UserProfile;
