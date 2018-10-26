import React, { Component } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Container, Card, Image, Grid } from "semantic-ui-react";
import moment from "moment";
import LikeButton from "./LikeButton";
import CommentContainer from "./CommentContainer";
import Loader from "./Loader";
import PageNotFound from "./PageNotFound";

export const EVENT_QUERY = gql`
   query($id: ID!) {
      event(id: $id) {
         id
         title
         description
         published
         imageURL
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

class SubsComponent extends Component {
   render() {
      const { event } = this.props;

      return (
         <Grid celled="internally" divided="vertically">
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
                           <Image
                              floated="right"
                              size="mini"
                              src="https://react.semantic-ui.com/images/avatar/small/joe.jpg"
                           />
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
                           <LikeButton id={event.id} event={event} />
                        </Card.Content>
                     </Card>
                     <CommentContainer eventId={!!event ? event.id : null} />
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
                  return <SubsComponent event={!!data ? data.event : null} />;
               }}
            </Query>
         </Container>
      );
   }
}
