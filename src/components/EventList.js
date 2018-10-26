import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import EventListItem from "./EventListItem";

export default class EventList extends Component {
   componentDidMount() {
      this.props.subscribeToNewEvent();
   }
   render() {
      const { data, loading, error } = this.props;
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error</p>;
      if (data.length === 0) return <p>No pictures found currently</p>;
      return (
         <Grid>
            {data.events.map(event => (
               <EventListItem key={event.id} event={event} />
            ))}
         </Grid>
      );
   }
}
