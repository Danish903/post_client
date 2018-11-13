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
   Checkbox,
   Header
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts/build/toast";
import { USER_POST_QUERY } from "./UserProfile";

const CREATE_EVENT_MUTATION = gql`
   mutation(
      $title: String!
      $imageURL: String!
      $description: String!
      $published: Boolean!
      $disableComment: Boolean!
      $imageURL_ID: String!
   ) {
      createEvent(
         data: {
            title: $title
            imageURL: $imageURL
            description: $description
            published: $published
            disableComment: $disableComment
            imageURL_ID: $imageURL_ID
         }
      ) {
         id
         title
         description
         published
         imageURL
         imageURL_ID
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
      imageURL_ID: "",
      description: "",
      isPublished: false,
      published: true,
      disableComment: false,
      image: "",
      loading: false,
      imageUploaded: false
   };

   _onChange = (e, data) => {
      const { name, value, checked } = data;

      if (name === "published") {
         this.setState({
            published: !checked,
            isPublished: checked
         });
      } else if (!value) {
         this.setState({
            [name]: value ? value : checked
         });
      } else {
         this.setState({
            [name]: value ? value : checked
         });
      }
   };

   imageUploading = () => {
      toast({
         description: `Image uploading...`,
         icon: "warning sign",
         type: "success"
      });
   };
   imageUploadedSuccessfully = () => {
      toast({
         description: `Image uploaded Successfully!`,
         icon: "warning sign",
         type: "success"
      });
   };
   uploadImage = async e => {
      const { files } = e.target;

      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "photoups");
      this.setState({ loading: true });
      this.imageUploading();
      try {
         const res = await fetch(
            "https://api.cloudinary.com/v1_1/dluo0wvst/image/upload",
            {
               method: "POST",
               body: data
            }
         );
         const file = await res.json();

         this.setState({
            imageURL: file.secure_url,
            imageURL_ID: file.public_id,
            imageUploaded: true
         });
         this.imageUploadedSuccessfully();
      } catch (error) {
         this.setState({
            imageUploaded: false
         });
      }

      this.setState({ loading: false });
   };
   _onSubmit = async createEvent => {
      const data = { ...this.state };
      delete data.isPublished;
      if (data.imageURL.length === 0) {
         toast({
            description: `Upload a image`,
            icon: "warning sign",
            type: "error"
         });
         return;
      }
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

   render() {
      return (
         <Mutation
            mutation={CREATE_EVENT_MUTATION}
            refetchQueries={[
               { query: GET_EVENTS_QUERY },
               {
                  query: USER_POST_QUERY
               }
            ]}
         >
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
                        {this.state.imageUploaded ? (
                           <Header as="h4" color="grey">
                              Image uploaded
                           </Header>
                        ) : (
                           <Form.Input
                              fluid
                              label={
                                 this.state.loading
                                    ? "Image uploading...wait until image is uploaded"
                                    : "Upload a Image"
                              }
                              type="file"
                              name="file"
                              value={this.state.image}
                              onChange={this.uploadImage}
                              loading={this.state.loading}
                              disabled={this.state.loading}
                              required
                           />
                        )}
                        <Form.Field>
                           <Form.Input
                              fluid
                              label="Title"
                              placeholder="title"
                              type="text"
                              name="title"
                              value={this.state.title}
                              onChange={this._onChange}
                              disabled={this.state.loading}
                              required
                           />
                        </Form.Field>

                        <Form.Field>
                           <label
                              style={
                                 this.state.loading
                                    ? { color: "rgba(0,0,0,.25)" }
                                    : null
                              }
                           >
                              Description
                           </label>
                           <TextArea
                              placeholder="Tell us more"
                              autoHeight
                              name="description"
                              onChange={this._onChange}
                              required
                              disabled={this.state.loading}
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
                              disabled={this.state.loading}
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
                              disabled={this.state.loading}
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
