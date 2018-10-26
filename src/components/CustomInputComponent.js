import React from "react";
import { Form } from "semantic-ui-react";
const CustomInputComponent = ({
   field, // { name, value, onChange, onBlur }
   form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
   ...props
}) => (
   <React.Fragment>
      <Form.Input
         error={!!touched[field.name] && !!errors[field.name]}
         {...field}
         {...props}
         required
      />
      {touched[field.name] &&
         errors[field.name] && (
            <p style={{ color: "red", marginTop: "-10px" }}>
               {errors[field.name]}
            </p>
         )}
   </React.Fragment>
);

export default CustomInputComponent;
