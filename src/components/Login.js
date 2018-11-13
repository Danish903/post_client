import React from "react";
import { compose, graphql } from "react-apollo";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import {
   Button,
   Container,
   Form,
   Header,
   Message,
   Icon
} from "semantic-ui-react";
import { withFormik, Field } from "formik";
import { validateLoginSchema } from "../utils/formValidationSchema";
import CustomInputComponet from "./CustomInputComponent";
import { ME_QUERY } from "./User";
import Loader from "./Loader";

const LOGIN_MUTATION = gql`
   mutation($email: String!, $password: String!) {
      login(data: { email: $email, password: $password }) {
         token
      }
   }
`;

const _onSubmit = handleSubmit => {
   handleSubmit();
};
const Login = ({
   errors,
   handleSubmit,
   isSubmitting,
   data: { me, loading }
}) => {
   if (loading) return <Loader />;
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
            content="Fill out the form below to sign-in"
         />
         <Form
            className="attached fluid segment"
            onSubmit={() => _onSubmit(handleSubmit)}
         >
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
               Login
            </Button>
         </Form>
         <Message attached="bottom" warning>
            <Icon name="help" />
            Don't have account?&nbsp;
            <Link to="/signup">Signup Here</Link>
            &nbsp;instead.
         </Message>
      </Container>
   );
};

// export default Login;
export default compose(
   graphql(ME_QUERY),
   graphql(LOGIN_MUTATION, {
      options: ({ values }) => ({
         refetchQueries: [
            {
               query: ME_QUERY
            }
         ],
         ...values
      })
   }),
   withFormik({
      mapPropsToValues: () => ({ email: "", password: "" }),
      validationSchema: validateLoginSchema,
      handleSubmit: async (
         values,
         { props, setErrors, setSubmitting, resetForm }
      ) => {
         try {
            const res = await props.mutate({
               variables: values
            });

            localStorage.setItem("token", res.data.login.token);
            setSubmitting(false);
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
)(Login);
