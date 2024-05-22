import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(8),
  },
  card: {
    maxWidth: 400,
    width: "100%",
    margin: "0 auto",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name can be at most 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUp = () => {
  const classes = useStyles();

  useEffect(() => {
    const superEmail = localStorage.getItem("super-email");
    if (superEmail) {
      window.location.href = "/dashboard";
    }
  }, []);

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name: name,
          email: email,
          password: password,
        }
      );
      if (response.status === 200) {

        console.log(response)
        toast.success("Signup successful!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        toast.error("Signup failed!");
      }
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data); 
      toast.error(error.response.data)
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <ToastContainer />
        <CardContent>
          <Typography variant="h5" component="h1" align="center">
            Password Manager Lite
          </Typography>
          <Typography variant="h5" component="h1" align="center">
            Signup
          </Typography>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              // Handle form submission here

              try {
                let response = await signup(
                  values.name,
                  values.email,
                  values.password
                );
              } catch (error) {
                setSubmitting(false);
              }
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  autoComplete="name"
                  autoFocus
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="confirm Password"
                  type="confirmPassword"
                  id="confirmPassword"
                  autoComplete="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Sign Up
                </Button>
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontFamily: "Roboto",
                  }}
                >
                  Already have an account? Sign In
                </Link>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
