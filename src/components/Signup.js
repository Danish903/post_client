import React from "react";
import { compose, graphql } from "react-apollo";
import { gql } from "apollo-boost";
import { Link, Redirect } from "react-router-dom";
import {
   Button,
   Container,
   Form,
   Header,
   Message,
   Icon
} from "semantic-ui-react";
import { withFormik, Field } from "formik";
import { ME_QUERY } from "./User";

import validationSchema from "../utils/formValidationSchema";
import CustomInputComponet from "./CustomInputComponent";

const SIGN_UP_MUTATION = gql`
   mutation($username: String!, $email: String!, $password: String!) {
      createUser(
         data: { username: $username, email: $email, password: $password }
      ) {
         token
      }
   }
`;
const Signup = props => {
   const { errors, handleSubmit, isSubmitting } = props;
   return (
      <Container fluid={false} text>
         {errors && errors.message ? (
            <Header as="h4" color="red">
               {errors.message}
            </Header>
         ) : null}

         <Message
            attached
            header="Welcome to our site!"
            content="Fill out the form below to sign-up for a new account"
         />
         <Form className="attached fluid segment" onSubmit={handleSubmit}>
            <Field
               label="Username"
               type="text"
               name="username"
               placeholder="Username"
               component={CustomInputComponet}
            />
            <Field
               label="Email"
               type="email"
               name="email"
               placeholder="example@example.com"
               component={CustomInputComponet}
            />
            <Field
               label="Password"
               type="password"
               name="password"
               placeholder="***************"
               component={CustomInputComponet}
            />
            <Button type="submit" disabled={isSubmitting}>
               Submit
            </Button>
         </Form>
         <Message attached="bottom" warning>
            <Icon name="help" />
            Already signed up?&nbsp;
            <Link to="/login">Login here</Link>
            &nbsp;instead.
         </Message>
      </Container>
   );
};
export default compose(
   graphql(ME_QUERY),
   graphql(SIGN_UP_MUTATION),
   withFormik({
      mapPropsToValues: () => ({ email: "", password: "", username: "" }),
      validationSchema,
      handleSubmit: async (
         values,
         { props, setErrors, setSubmitting, resetForm }
      ) => {
         try {
            const res = await props.mutate({
               variables: values
            });

            localStorage.setItem("token", res.data.createUser.token);
            await props.data.refetch({
               query: ME_QUERY
            });
            resetForm();
            props.history.push("/");
         } catch (error) {
            setErrors(error);
         }
         setSubmitting(false);
      }
   })
)(Signup);
