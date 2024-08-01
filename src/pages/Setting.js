import React, { useState, useEffect, useMemo } from "react";
import { Col, Row, Form, Button, FormCheck } from "@themesberg/react-bootstrap";
import "react-time-picker/dist/TimePicker.css";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";

import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from '@themesberg/react-bootstrap';
export const Setting = () => {
  const [isError, setIsError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const token = localStorage.getItem("token");
  const getBannerData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Setting/getSetting`,
        {
          headers: { Authorization: token },
        }
      );
      setMyNewData(res.data);
      setIsLoadingData(true);
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(true);
    }
  };

  const getRazorepayKeyData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Razorpaykey/getRazorpaykey`,
        {
          headers: { Authorization: token },
        }
      );
      setData(res.data);
      console.log(res.data, "razorpay");
      setIsLoadingData(true);
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(true);
    }
  };

  useEffect(() => {
    getBannerData();
    getRazorepayKeyData();
  }, []);

  const [myNewData, setMyNewData] = useState({
    phone: "",
    email: "",
    showActiveUser: false,
  });

  const [myData, setData] = useState({
    razorpayKey: "",
    razorpaySecretKey: "",
  });

  const SigninNewSchema = Yup.object().shape({
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().required("Email is required"),
  });

  const RezorepaySchema = Yup.object().shape({
    razorpayKey: Yup.string().required("razorpay Key is required"),
    razorpaySecretKey: Yup.string().required("razorpay SecretKey is required"),
  });

  const getMyPostData = async (values) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Setting/create`,
        { ...values },
        {
          headers: { Authorization: `${token}` },
        }
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Settings updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setIsError(error.response.data.err.message);
    }
  };

  const getRazorepayData = async (values) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Razorpaykey/createRazorpaykey`,
        { ...values },
        {
          headers: { Authorization: `${token}` },
        }
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Razorpay key updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setIsError(error.response.data.err.message);
    }
  };

  return (
    <>
      <div className="container">
        <h2>Settings</h2>
        <hr></hr>
        {isLoadingData ? (
          <Formik
            initialValues={myNewData}
            validationSchema={SigninNewSchema}
            onSubmit={(values) => {
              getMyPostData(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              /* and other goodies */
            }) => (
              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="body">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Phone here"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.phone && touched.phone && errors.phone}
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="body">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Email here"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.email && touched.email && errors.email}
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="body">
                      <FormCheck
                        type="checkbox"
                        label="Show Active User"
                        name="showActiveUser"
                        checked={values.showActiveUser}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
         
            <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
      
          // <p>Loading ..</p>
        )}
      </div>

      <div className="container">
        <h2>Rezorepay </h2>
        <hr></hr>
        {isLoadingData ? (
          <Formik
            initialValues={myData}
            validationSchema={RezorepaySchema}
            enableReinitialize
            onSubmit={(values) => {
              getRazorepayData(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              /* and other goodies */
            }) => (
              <Form>
                <Row>
                  {console.log(values, "values")}
                  <Col md={6} className="mb-3">
                    <Form.Group id="body">
                      <Form.Label>Razorpay Key</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter razorpay Key"
                        name="razorpayKey"
                        value={values.razorpayKey}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.razorpayKey &&
                        touched.razorpayKey &&
                        errors.razorpayKey}
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="body">
                      <Form.Label>Razorpay SecretKey</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter razorpay SecretKey"
                        name="razorpaySecretKey"
                        value={values.razorpaySecretKey}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.razorpaySecretKey &&
                        touched.razorpaySecretKey &&
                        errors.razorpaySecretKey}
                    </div>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
 
            <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
      
          // <p>Loading ..</p>
        )}
      </div>
    </>
  );
};
