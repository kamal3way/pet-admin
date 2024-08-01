import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const CommanSubcategory = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [time, setTime] = useState("00:00:00");
  const [myData, setMyData] = useState({
    subcategory_name: "",
    description: "",
    exam_name: "",
    marks_awarded: "",
    marks_deducted: "",
    time_duration: "",
    negative_marking: false,
    category_id: "",
  });

  const [isError, setIsError] = useState("");
  const [categoryData, setMyCategoryData] = useState([]);
  const [showMarksDeductedField, setShowMarksDeductedField] = useState(false);

  const getMyPostData = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Subcategory/create`,
        { ...values, time_duration: time },
        {
          headers: { Authorization: `${token}` },
        }
      );
      setMyData(res.data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setIsError(error.response.data.err.message);
    }
  };

  const handleNegativeMarkingChange = (e) => {
    const selectedValue = e.target.value;
    setShowMarksDeductedField(selectedValue === "true");
  };

  const SigninSchema = Yup.object().shape({
    subcategory_name: Yup.string().required("Category name is Required"),
    description: Yup.string().required("description is Required"),
    marks_awarded: Yup.string().required("Marks Awarded is Required"),
    exam_name: Yup.string().required("exam name is Required"),
    category_id: Yup.string().required("exam name is Required"),
  });

  return (
    <>
      <h2>Add SubCategory</h2>
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
          /* and other goodies */
        }) => (
          <Form>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="firstName">
                  <Form.Label>Subcategory Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your first name"
                    name="subcategory_name"
                    value={values.subcategory_name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="mb-3 text-danger">
                  {errors.subcategory_name &&
                    touched.subcategory_name &&
                    errors.subcategory_name}
                </div>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group id="gender">
                  <Form.Label>Select Category</Form.Label>
                  <Form.Select
                    name="category_id"
                    value={values.category_id}
                    onChange={handleChange}
                  >
                    <option>Select Category</option>
                    {categoryData.map((item, index) => (
                      <option value={item._id}>{item.category_name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="emal">
                  <Form.Label>Exam Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Exam Name"
                    name="exam_name"
                    value={values.exam_name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="mb-3 text-danger">
                  {errors.exam_name && touched.exam_name && errors.exam_name}
                </div>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group id="phone">
                  <Form.Label>Marks Awarded</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Marks Awarded Per Question"
                    name="marks_awarded"
                    value={values.marks_awarded}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="mb-3 text-danger">
                  {errors.marks_awarded &&
                    touched.marks_awarded &&
                    errors.marks_awarded}
                </div>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md={12} className="mb-3">
                <Form.Group id="gender">
                  <Form.Label>Negative Marking</Form.Label>
                  <Form.Select
                    defaultValue="false"
                    name="negative_marking"
                    value={values.negative_marking}
                    onChange={(e) => {
                      handleChange(e);
                      handleNegativeMarkingChange(e);
                    }}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group id="timePicker">
                  <Form.Label>Time Duration</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faClock} />
                    </InputGroup.Text>
                    <TimePicker
                      disableClock={true}
                      clearIcon={null}
                      value={time}
                      onChange={(newTime) => setTime(newTime)}
                      format="HH:mm"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            {showMarksDeductedField && (
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group id="emal">
                    <Form.Label>Marks Deducted</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Marks Deducted Per Question"
                      name="marks_deducted"
                      value={values.marks_deducted}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="lastName">
                  <Form.Label>Description</Form.Label>
                  {/* <Form.Control
                    type="text"
                    placeholder="Enter Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                  /> */}
                    <textarea
                      class="form-control"
                      id="description"
                      rows="6"
                      placeholder="Enter Description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                    ></textarea>
                </Form.Group>
                <div className="mb-3 text-danger">
                  {errors.description &&
                    touched.description &&
                    errors.description}
                </div>
              </Col>
            </Row>

            <div className="mt-3">
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
