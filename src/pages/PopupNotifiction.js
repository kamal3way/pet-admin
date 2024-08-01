import React, { useState, useEffect, } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Col,
  Row,
  Form,
  Button,
} from "@themesberg/react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import "react-responsive-modal/styles.css";
import "react-time-picker/dist/TimePicker.css";
import { Select, MenuItem } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
export const PopupNotification = () => {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isError, setIsError] = useState("");
  const [notificationData, setNotificationData] = useState({
    title: "",
    body: "",
    preparing_for: "",
    subscription_id: ""
  })
  const [PreparingFor, setPreparingFor] = useState([]);
  const [subPlanData, setSubPlanData] = useState([]);
  const getPreparingData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/preparing/getpreparing`,
        {
          headers: { Authorization: token },
        }
      );
      setPreparingFor(res.data);
    } catch (error) {
      // setIsError(error.response);
      // setIsLoadingData(false);
    }
  };
  const getMySubscriptionData = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Subscription/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setSubPlanData(res.data);
      console.log(res.data);
      setIsLoadingData(false);
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };
  useEffect(() => {
    getPreparingData();
    getMySubscriptionData();
  }, []);
  const [selectedPreparingFor, setSelectedPreparingFor] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const handleGroupChange = (event) => {
    setSelectedPreparingFor(event.target.value);
  };
  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };
  const handleTypeChange = (event) => {
    setNotificationType(event.target.value);
  };

  const sendNotification = async (values, resetForm) => {
    const token = localStorage.getItem("token");
    try {
      let requestData = {
        title: values.title,
        body: values.body,
        preparing_for: "",
        subscription_id: ""
      };

      if (notificationType === "Plan") {
        // If Plan is selected, set subscription_id
        requestData.subscription_id = selectedPlan;
      } else if (notificationType === "Group") {
        // If Group is selected, set preparing_for
        requestData.preparing_for = selectedPreparingFor;
      }
      console.log("notificationData", requestData);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/sendPopUpNotification`,
        requestData,
        {
          headers: { Authorization: token }
        }
      );
      resetForm();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Notification Sent Successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Something Went Wrong!",
        showConfirmButton: false,
        timer: 1500
      });
      console.log(error);
    }
  };
  return (
    <>
      <div className="container">
        <h2>PopUp Notifications</h2>
        <hr></hr>
        <Col md={12} className="mb-3">
          <Form.Label>Send Notification By :&nbsp;&nbsp;&nbsp; </Form.Label>
          {/* Dropdown to select notification type */}
          <Select
            name="notificationType"
            value={notificationType}
            onChange={handleTypeChange}
            style={{ minWidth: "20em" }}
          >
            <MenuItem value="Plan">Subscription Plan</MenuItem>
            <MenuItem value="Group">Group</MenuItem>
          </Select>
        </Col>
        <Formik
          initialValues={notificationData}
          // validationSchema={SigninNewSchema}
          onSubmit={(values, { resetForm }) => {
            sendNotification(values, resetForm);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
          }) => (
            <Form>
              {notificationType === "Plan" ?
                (<>
                  <Col md={12} className="mb-3">
                    <Form.Label >Select Subscription Plan  :&nbsp;&nbsp;&nbsp;</Form.Label>
                    <Select
                      name="Plan"
                      value={selectedPlan}
                      onChange={handlePlanChange}
                      style={{ minWidth: "20em" }}
                    >
                      {subPlanData.map((option) => (
                        <MenuItem key={option.sid} value={option.sid}>
                          {option.plan_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Col>

                </>) : notificationType === "Group" ?
                  (<>
                    <Col md={12} className="mb-3">
                      <Form.Label >Select Group  :&nbsp;&nbsp;&nbsp; </Form.Label>
                      <Select
                        name="preparingFor"
                        value={selectedPreparingFor}
                        onChange={handleGroupChange}
                        style={{ minWidth: "20em" }}
                      >
                        {PreparingFor.map((option) => (
                          <MenuItem key={option._id} value={option._id}>
                            {option.preparing_for}
                          </MenuItem>
                        ))}
                      </Select>
                    </Col>
                  </>) : (<></>)}
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group id="body">
                    <Form.Label>Notification Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Notification Title here"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="mb-3 text-danger">
                    {errors.title &&
                      touched.title &&
                      errors.title}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Group id="body">
                    <Form.Label>Notification Text</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Notification Text here"
                      name="body"
                      value={values.body}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="mb-3 text-danger">
                    {errors.body &&
                      touched.body &&
                      errors.body}
                  </div>
                </Col>

              </Row>
              <div className="mt-3">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Send
                </Button>
              </div>
            </Form>
          )}
        </Formik>

      </div>

    </>
  );
};

// export default Notification;

