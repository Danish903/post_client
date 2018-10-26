import React, { Component } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

export const ME_QUERY = gql`
   query {
      me {
         id
         username
         favorites {
            id
            event {
               id
            }
         }
      }
   }
`;
export default class User extends Component {
   render() {
      return (
         <Query {...this.props} query={ME_QUERY}>
            {payload => this.props.children(payload)}
         </Query>
      );
   }
}
