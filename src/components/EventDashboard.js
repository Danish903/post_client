import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import EventList from "./EventList";

export const GET_EVENTS_QUERY = gql`
   query {
      events(orderBy: createdAt_DESC) {
         id
         title
         description
         published
         imageURL
         likes {
            id
         }
         likesCount
         host {
            id
            username
         }
         comments {
            id
         }
      }
   }
`;

export const EVENT_SUBSCRIPTION = gql`
   subscription {
      event {
         mutation
         node {
            id
            title
            description
            published
            imageURL
            likes {
               id
            }
            likesCount
            host {
               id
               username
            }
            comments {
               id
            }
         }
      }
   }
`;

const EventDashboard = () => {
   return (
      <Query query={GET_EVENTS_QUERY}>
         {({ subscribeToMore, ...result }) => (
            <EventList
               {...result}
               subscribeToNewEvent={() =>
                  subscribeToMore({
                     document: EVENT_SUBSCRIPTION,
                     updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        const newEvent = subscriptionData.data.event;
                        if (newEvent.mutation === "UPDATED") {
                           return {
                              events: prev.events.map(event => {
                                 if (event.id === newEvent.node.id) {
                                    return {
                                       ...event,
                                       ...newEvent.node
                                    };
                                 }
                                 return event;
                              })
                           };
                        }
                        return {
                           ...prev,
                           events: [newEvent.node, ...prev.events]
                        };
                     }
                  })
               }
            />
         )}
      </Query>
   );
};

export default EventDashboard;
