import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { GET_EVENTS_QUERY } from "./EventDashboard";
import {
   Button,
   Form,
   Message,
   Container,
   TextArea,
   Checkbox
} from "semantic-ui-react";

const CREATE_EVENT_MUTATION = gql`
   mutation(
      $title: String!
      $imageURL: String!
      $description: String!
      $published: Boolean!
      $disableComment: Boolean!
   ) {
      createEvent(
         data: {
            title: $title
            imageURL: $imageURL
            description: $description
            published: $published
            disableComment: $disableComment
         }
      ) {
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

class AddPhoto extends React.Component {
   state = {
      title: "",
      imageURL: "",
      description: "",
      isPublished: false,
      published: true,
      disableComment: false
   };
   _onChange = (e, data) => {
      const { name, value, checked } = data;
      if (name === "published") {
         this.setState({
            published: !checked,
            isPublished: checked
         });
      } else if (!!value) {
         this.setState({
            [name]: value ? value : checked
         });
      }
   };
   _onSubmit = async createEvent => {
      const data = { ...this.state };
      delete data.isPublished;
      try {
         await createEvent({
            variables: {
               ...data
            }
         });
         this.props.history.push("/");
      } catch (error) {
         console.log(error);
      }
   };
   _update = (cache, { data: { createEvent } }) => {
      const data = cache.readQuery({ query: GET_EVENTS_QUERY });
      if (createEvent.published) {
         data.events = [createEvent, ...data.events];
         cache.writeQuery({ query: GET_EVENTS_QUERY, data });
      }
   };
   render() {
      return (
         <Mutation mutation={CREATE_EVENT_MUTATION} update={this._update}>
            {(createEvent, { data, loading, error }) => {
               if (error) return <p>{error.message}</p>;
               return (
                  <Container>
                     <Message
                        attached
                        header="Upload your beautiful pciture !"
                        content="Fill out the form below to share your photo"
                     />
                     <Form
                        className="attached fluid segment"
                        onSubmit={() => this._onSubmit(createEvent)}
                     >
                        <Form.Field>
                           <Form.Input
                              fluid
                              label="Title"
                              placeholder="title"
                              type="text"
                              name="title"
                              value={this.state.title}
                              onChange={this._onChange}
                              required
                           />
                        </Form.Field>
                        <Form.Input
                           fluid
                           label="Upload photo"
                           placeholder="upload a photo"
                           type="text"
                           name="imageURL"
                           value={this.state.imageURL}
                           onChange={this._onChange}
                           required
                        />
                        <Form.Field>
                           <label>Description</label>
                           <TextArea
                              placeholder="Tell us more"
                              autoHeight
                              name="description"
                              onChange={this._onChange}
                              required
                           />
                        </Form.Field>
                        <Form.Field>
                           <Checkbox
                              type="checkbox"
                              label="Disable comments for your post"
                              toggle
                              name="disableComment"
                              checked={this.state.disableComment}
                              onChange={this._onChange}
                           />
                        </Form.Field>
                        <Form.Field>
                           <Checkbox
                              type="checkbox"
                              label="Make your post private"
                              toggle
                              name="published"
                              checked={this.state.isPublished}
                              onChange={this._onChange}
                           />
                        </Form.Field>

                        <Button
                           basic
                           color="black"
                           type="submit"
                           content="Upload your photo"
                           disabled={loading}
                           loading={loading}
                        />
                     </Form>
                  </Container>
               );
            }}
         </Mutation>
      );
   }
}

export default AddPhoto;
