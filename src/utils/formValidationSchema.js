import * as yup from "yup";

const validationSchema = yup.object().shape({
   username: yup
      .string()
      .min(5, "Username must be at least 5 characters")
      .max(255)
      .required(),
   email: yup
      .string()
      .min(3, "Email must be at least 3 characters")
      .max(255)
      .email("Inavlid email")
      .required(),
   password: yup
      .string()
      .min(5, "Password must be at least 5 characters")
      .max(255)
      .required()
});

export const validateLoginSchema = yup.object().shape({
   email: yup
      .string()
      .min(3, "Email must be at least 3 characters")
      .max(255)
      .email("Inavlid email")
      .required(),
   password: yup
      .string()
      .min(5, "Password must be at least 5 characters")
      .max(255)
      .required()
});
export { validationSchema as default };
