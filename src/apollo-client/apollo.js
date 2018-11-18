import { ApolloClient, InMemoryCache } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { createUploadLink } from "apollo-upload-client";

//process.env.REACT_APP_SERVER_URL
const getClient = (
   httpURL = process.env.REACT_APP_SERVER_URL,
   websocketURL = process.env.REACT_APP_WS_URL
) => {
   // Setup the authorization header for the http client
   let jwt = localStorage.getItem("token");

   const requestLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      const jwt = localStorage.getItem("token");

      return {
         headers: {
            ...headers,
            Authorization: !!jwt ? `Bearer ${jwt}` : ""
         }
      };
   });
   // console.log("apollo-client: ", jwt);
   // const request = async operation => {
   //    if (jwt) {
   //       operation.setContext({
   //          headers: {
   //             Authorization: `Bearer ${jwt}`
   //          }
   //       });
   //    }
   // };

   // Setup the request handlers for the http clients
   // const requestLink = new ApolloLink((operation, forward) => {
   //    return new Observable(observer => {
   //       let handle;
   //       Promise.resolve(operation)
   //          .then(oper => {
   //             request(oper);
   //          })
   //          .then(() => {
   //             handle = forward(operation).subscribe({
   //                next: observer.next.bind(observer),
   //                error: observer.error.bind(observer),
   //                complete: observer.complete.bind(observer)
   //             });
   //          })
   //          .catch(observer.error.bind(observer));

   //       return () => {
   //          if (handle) {
   //             handle.unsubscribe();
   //          }
   //       };
   //    });
   // });

   // Web socket link for subscriptions

   const wsLink = ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
         if (graphQLErrors) {
            graphQLErrors.map(({ message, locations, path }) =>
               console.log(
                  `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
               )
            );
         }

         if (networkError) {
            console.log(`[Network error]: ${networkError}`);
         }
      }),
      requestLink,
      new WebSocketLink({
         uri: websocketURL,
         options: {
            reconnect: true,
            connectionParams: () => {
               if (jwt) {
                  return {
                     Authorization: !!jwt ? `Bearer ${jwt}` : ""
                  };
               }
            }
         }
      })
   ]);

   // HTTP link for queries and mutations
   const httpLink = ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
         if (graphQLErrors) {
            graphQLErrors.map(({ message, locations, path }) =>
               console.log(
                  `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
               )
            );
         }
         if (networkError) {
            console.log(`[Network error]: ${networkError}`);
         }
      }),
      requestLink,
      new createUploadLink({
         uri: httpURL
      })
   ]);

   // Link to direct ws and http traffic to the correct place
   const link = ApolloLink.split(
      // Pick which links get the data based on the operation kind
      ({ query }) => {
         const { kind, operation } = getMainDefinition(query);
         return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
   );

   return new ApolloClient({
      link,
      cache: new InMemoryCache()
   });
};

export default getClient;
