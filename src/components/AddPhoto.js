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
import { toast } from "react-semantic-toasts/build/toast";
import { USER_POST_QUERY } from "./UserProfile";
import Dropzone from "./Dropzone";

const styleLoadingImage = { opacity: "0.3", filter: "grayscale(100)" };
const upload = gql`
   mutation(
      $file: Upload!
      $title: String!
      $imageURL: String!
      $description: String!
      $published: Boolean!
      $disableComment: Boolean!
      $imageURL_ID: String!
   ) {
      singleUpload(
         data: {
            title: $title
            imageURL: $imageURL
            description: $description
            published: $published
            disableComment: $disableComment
            imageURL_ID: $imageURL_ID
            file: $file
         }
      ) {
         success
      }
   }
`;

const initState = {
   title: "",
   imageURL: "",
   imageURL_ID: "",
   description: "",
   isPublished: false,
   published: true,
   disableComment: false,
   file: null,
   imagePreview: "",
   error: ""
};
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
      imageUploaded: false,
      file: null,
      imagePreview: null,
      error: ""
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

   onDrop = ([file]) => {
      const preview = URL.createObjectURL(file);
      this.setState({
         file,
         image: file,
         imagePreview: preview,
         imageURL: preview,
         imageURL_ID: preview
      });
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

   _onSubmit = async upload => {
      if (!this.state.file || !this.state.title || !this.state.description) {
         this.setState({ error: "You need to upload an image" });
         return;
      }
      this.setState({ error: "" });
      const variables = {
         title: this.state.title,
         imageURL: this.state.imageURL,
         description: this.state.description,
         published: this.state.published,
         disableComment: this.state.disableComment,
         imageURL_ID: this.state.imageURL_ID,

         file: this.state.file
      };
      this.setState({ loading: true });
      try {
         await upload({ variables });

         this.setState({ loading: false, ...initState });
         this.imageUploadedSuccessfully();
         this.props.history.push("/");
         return;
      } catch (error) {
         console.log(error);
      }
      this.setState({ loading: false, ...initState });
   };

   render() {
      return (
         <Mutation
            mutation={upload}
            refetchQueries={[
               { query: GET_EVENTS_QUERY },
               {
                  query: USER_POST_QUERY
               }
            ]}
         >
            {(upload, { data, loading, error }) => {
               if (error) return <p>{error.message}</p>;
               return (
                  <Container>
                     <Message
                        attached
                        header="Upload your beautiful pciture !"
                        content="Fill out the form below to share your photo"
                     />

                     {this.state.imagePreview && (
                        <img
                           width="200px"
                           src={this.state.imagePreview}
                           alt="imagdde"
                           style={loading ? styleLoadingImage : null}
                        />
                     )}
                     <Form
                        className="attached fluid segment"
                        onSubmit={() => this._onSubmit(upload)}
                     >
                        {!!this.state.error && !this.state.imagePreview && (
                           <Message negative>
                              <p>{this.state.error}</p>
                           </Message>
                        )}
                        {!this.state.imagePreview && !loading && (
                           <Dropzone onDrop={this.onDrop} />
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
                              value={this.state.description}
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
