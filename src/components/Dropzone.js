import React from "react";
import Dropzone from "react-dropzone";
import { Icon } from "semantic-ui-react";
const dropzoneStyle = {
   width: "100%",
   height: "20%",
   border: "1px solid rgba(34,36,38,.15)",
   marginBottom: "10px",
   textAlign: "center",
   cursor: "pointer"
};
export default class DZ extends React.Component {
   render() {
      return (
         <Dropzone
            multiple={false}
            accept="image/jpeg, image/png, image/jpg"
            onDrop={this.props.onDrop}
            style={dropzoneStyle}
         >
            <Icon
               name="cloud upload"
               size="big"
               style={{ paddingTop: "10px", marginBottom: "10px" }}
               color="grey"
            />
            <p>Try dropping file here, or click to select file to upload.</p>
         </Dropzone>
      );
   }
}
