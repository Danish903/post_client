import React, { Component } from "react";
import { Query, Subscription } from "react-apollo";
import { gql } from "apollo-boost";
import { Container, Card, Image, Grid, Header } from "semantic-ui-react";
import moment from "moment";
import LikeButton from "./LikeButton";
import CommentContainer from "./CommentContainer";
import Loader from "./Loader";
import PageNotFound from "./PageNotFound";
import DisableComment from "./DisableComment";

export const EVENT_QUERY = gql`
   query($id: ID!) {
      event(id: $id) {
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

export const SINGLE_EVENT_SUBSCRIPTION = gql`
   subscription($id: ID!) {
      singleEvent(id: $id) {
         mutation
         node {
            id
            title
            disableComment
         }
      }
   }
`;

class SubsComponent extends Component {
   render() {
      const { event } = this.props;

      return (
         <Grid celled="internally" stackable>
            <Grid.Row columns={2}>
               <Grid.Column
                  style={{
                     display: "flex",
                     alignItems: "center",
                     alignContent: "center",
                     justifyContent: "center"
                  }}
               >
                  <Image src={event.imageURL} />
               </Grid.Column>
               <Grid.Column>
                  <div className="commentContainer">
                     <Card fluid>
                        <Card.Content>
                           <div className="avatar">
                              <p>{!!event ? event.host.username[0] : "NA"}</p>
                           </div>
                           <Card.Header>
                              {!!event ? event.host.username : "test"}
                           </Card.Header>
                           <Card.Meta>
                              {!!event
                                 ? moment(event.createdAt).format("LLLL")
                                 : null}
                           </Card.Meta>
                           <Card.Description>
                              {!!event ? event.description : null}
                           </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                           <div
                              style={{
                                 backround: "red",
                                 display: "flex",
                                 justifyContent: "space-between"
                              }}
                           >
                              <LikeButton id={event.id} event={event} />
                              <DisableComment event={event} />
                           </div>
                        </Card.Content>
                     </Card>
                     {event.disableComment ? (
                        <Header as="h4">
                           Comments are disabled for this post
                        </Header>
                     ) : (
                        <CommentContainer
                           eventId={!!event ? event.id : null}
                           host={event.host}
                        />
                     )}
                  </div>
               </Grid.Column>
            </Grid.Row>
         </Grid>
      );
   }
}

export default class PhotoDetails extends Component {
   render() {
      const { id } = this.props.match.params;
      return (
         <Container>
            <Query query={EVENT_QUERY} variables={{ id }}>
               {({ data, loading, error }) => {
                  if (loading) return <Loader />;
                  if (error) return <PageNotFound />;

                  return (
                     <Subscription
                        subscription={SINGLE_EVENT_SUBSCRIPTION}
                        variables={{ id: data.event.id }}
                     >
                        {() => (
                           <SubsComponent event={!!data ? data.event : null} />
                        )}
                     </Subscription>
                  );
               }}
            </Query>
         </Container>
      );
   }
}
