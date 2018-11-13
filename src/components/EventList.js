import React, { Component } from "react";

import { Grid } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroller";
import EventListItem from "./EventListItem";
import Loader from "./Loader";
import uuid from "uuid/v4";

export default class EventList extends Component {
   state = {
      hasMoreItems: true
   };
   componentDidMount() {
      this.unsubscribe = this.props.subscribeToNewEvent();
   }
   componentWillUnmount() {
      this.unsubscribe();
   }
   handleScroll = () => {
      if (this.scroller) {
         console.log(this.scroller);
      }
   };

   render() {
      const { data, loading, error, fetchMore } = this.props;
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error</p>;
      if (data.length === 0) return <p>No pictures found currently</p>;
      return (
         <div>
            {!!data && data.events.length > 0 && (
               <InfiniteScroll
                  key={uuid()}
                  pageStart={0}
                  loadMore={() =>
                     fetchMore({
                        variables: {
                           after: data.events[data.events.length - 1].id
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                           if (!fetchMoreResult) return prev;

                           if (fetchMoreResult.events.length < 2) {
                              this.setState({ hasMoreItems: false });
                           }
                           return {
                              ...prev,
                              events: [
                                 ...prev.events,
                                 ...fetchMoreResult.events
                              ]
                           };
                        }
                     })
                  }
                  hasMore={!loading && this.state.hasMoreItems}
                  initialLoad={false}
                  loader={
                     loading &&
                     this.state.hasMoreItems && <Loader key={uuid()} />
                  }
               >
                  <Grid>
                     {data.events.map(event => (
                        <EventListItem key={event.id} event={event} />
                     ))}
                  </Grid>
               </InfiniteScroll>
            )}
         </div>
      );
   }
}

// OFF SET BASED PAGINATION

// export default class EventList extends Component {
//    state = {
//       hasMoreItems: true
//    };
//    componentDidMount() {
//       this.querySubscription = this.props.subscribeToNewEvent();
//    }

//    render() {
//       const { data, loading, error, fetchMore } = this.props;
//       if (loading) return <p>Loading...</p>;
//       if (error) return <p>Error</p>;
//       if (data.length === 0) return <p>No pictures found currently</p>;
//       return (
//          <>
//             {this.state.hasMoreItems && (
//                <Button
//                   onClick={() =>
//                      fetchMore({
//                         variables: {
//                            skip: data.events.length
//                         },
//                         updateQuery: (prev, { fetchMoreResult }) => {
//                            if (!fetchMoreResult) return prev;
//                            if (fetchMoreResult.events.length < 3) {
//                               this.setState({ hasMoreItems: false });
//                            }
//                            return {
//                               ...prev,
//                               events: [
//                                  ...fetchMoreResult.events,
//                                  ...prev.events
//                               ]
//                            };
//                         }
//                      })
//                   }
//                >
//                   Load More
//                </Button>
//             )}
//             <Grid>
//                {data.events.map(event => (
//                   <EventListItem key={event.id} event={event} />
//                ))}
//             </Grid>
//          </>
//       );
//    }
// }
