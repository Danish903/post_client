import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { Image, Button, Label, Icon } from "semantic-ui-react";

export default class EventListItem extends PureComponent {
   render() {
      const { event } = this.props;

      return (
         <Image.Group>
            <Link className="imageContainer" to={`/photoDetails/${event.id}`}>
               <img
                  src={event.imageURL}
                  style={{
                     width: "400px",
                     height: "400px",
                     objectFit: "cover"
                  }}
                  alt={event.title}
               />
               <div className="imageAction">
                  <Button as="div" labelPosition="right">
                     <Button color="red" icon>
                        <Icon name="heart" />
                     </Button>
                     <Label basic pointing="left">
                        {event.likesCount}
                     </Label>
                  </Button>
                  <Button as="div" labelPosition="right">
                     <Button icon>
                        <Icon name="comment alternate outline" />
                     </Button>
                     <Label basic pointing="left">
                        {event.comments.length}
                     </Label>
                  </Button>
               </div>
            </Link>
         </Image.Group>
      );
   }
}
