import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Container } from "@themesberg/react-bootstrap";
import { useHistory } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default () => {
  const history = useHistory();
  const [myData] = useState({
    uMobile: "",
    uPassword: "",
  });

  const [isError, setIsError] = useState("");

  const getMyPostData = async (values) => {
    const token1 = localStorage.getItem("token1");
    try {
      const res = await axios.post(
        `https://pets.dev.savaapi.com/api/custom-api/dev1/auth/root-admin-login`,
        values,
        {
          headers: { "x-am-authorization": token1 },
        }
      );

      console.log(res);
      console.log("qwertyuiop");
      localStorage.setItem("token", res.data.data.accessToken);

      if (res.data.data != null) {
      
        history.push("/User");
      } else {
        setIsError("Invalid Email Or Password");
      }
    } catch (error) {
      setIsError(error.response?.data?.err?.message || "We couldn't find an account matching the mobile or email and password You entered. Please try again");
    }
  };

  const SigninSchema = Yup.object().shape({
    uMobile: Yup.string().required("User Number Or Email is Required"),
    uPassword: Yup.string().required("Password is Required"),
  });

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row>
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <Formik
                  initialValues={myData}
                  validationSchema={SigninSchema}
                  onSubmit={(values) => {
                    getMyPostData(values);
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
                    <Form className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="email">Mobile Or Email</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FontAwesomeIcon icon={faEnvelope} />
                          </span>
                          <Field
                            autoFocus
                            type="text"
                            placeholder="Enter Mobile Or Email "
                            value={values.uMobile}
                            name="uMobile"
                            id="uMobile"
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="mb-3 text-danger">
                          {errors.uName &&
                            touched.uName &&
                            errors.uName}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FontAwesomeIcon icon={faUnlockAlt} />
                          </span>
                          <Field
                            type="Password"
                            placeholder="Enter Your Password"
                            value={values.uPassword}
                            name="uPassword"
                            id="uPassword"
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="mb-3 text-danger">
                          {errors.uMobile &&
                            touched.uMobile &&
                            errors.uMobile}
                        </div>
                        <div className="text-danger">{isError}</div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={handleSubmit}
                      >
                        Sign in
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
