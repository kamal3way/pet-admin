import React, { useState, useEffect, useMemo } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
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
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import DownloadExcelButton from "./downloadExel";
import { MDBDataTable } from "mdbreact";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from "@themesberg/react-bootstrap";

export const Exam = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [Editopen, setEditOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => setEditOpen(false);
  const [category, setCategory] = React.useState("");
  const history = useHistory();

  const navigateDetails = (userId) => {
    history.push(`/questionDetails?id=${userId}`);
  };

  const [myData, setMyData] = useState({
    exam_name: "",
    category_id: "",
    subcategory_id: undefined,
    topic_id: undefined,
    marks_awarded: "",
    marks_deducted: "",
    instruction: "",
    negative_marking: false,
    is_practice_mode: false,
    isfeatured: false,
    time_duration: "00:00",
    attempt: "",
    fromtime: "",
    totime: "",
    examType: "Always Live",
  });
  const [isError, setIsError] = useState("");
  const [categoryData, setMyCategoryData] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [subcategoryData, setMysubCategoryData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [editData, setEditData] = useState({});
  const [showMarksDeductedField, setShowMarksDeductedField] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [SubscriptionData, setMySubscriptionData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const handleNegativeMarkingChange = (e) => {
    const selectedValue = e.target.value;
    setShowMarksDeductedField(selectedValue === "true");
  };

  const createExam = async (values) => {
    const token = localStorage.getItem("token");
    const formattedTime = values.time_duration
      ? `${values.time_duration}:00`
      : "00:00:00";
    const fromtime = values.fromtime
      ? moment(values.fromtime).format("YYYY-MM-DD HH:mm:ss")
      : "";
    const totime = values.totime
      ? moment(values.totime).format("YYYY-MM-DD HH:mm:ss")
      : "";

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Exam/create`,
        { ...values, time_duration: formattedTime, fromtime, totime },
        {
          headers: { Authorization: `${token}` },
        }
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Exam has been Created Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyExamData();
      onCloseModal();
      setMyData({
        exam_name: "",
        category_id: "",
        subcategory_id: undefined,
        topic_id: undefined,
        marks_awarded: "",
        marks_deducted: "",
        instruction: "",
        negative_marking: false,
        is_practice_mode: false,
        isfeatured: false,
        time_duration: "00:00",
        attempt: "",
        fromtime: "",
        totime: "",
        examType: "Always Live",
      });
    } catch (error) {
      setIsError(error.response.data.err.message);
    }
  };

  const getMyCategoryData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Category/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setMyCategoryData(res.data);
    } catch (error) {
      setIsError(error.response);
    }
  };

  const getMyTopicsData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Topic/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setTopicsData(res.data);
    } catch (error) {
      setIsError(error.response);
    }
  };

  const getMySubscriptionData = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Subscription/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setMySubscriptionData(res.data);
    } catch (error) {
      setIsError(error.response);
    }
  };
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "No",
        field: "id",
        width: 270,
      },
      {
        label: "Exam Name",
        field: "name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "subcategory name",
        field: "subcategory_name",
        width: 100,
      },
      {
        label: "category name",
        field: "category_name",
        width: 100,
      },
      {
        label: "marks awarded",
        field: "marks_awarded",
        width: 100,
      },
      {
        label: "marks deducted",
        field: "marks_deducted",
        width: 100,
      },
      {
        label: "time duration",
        field: "time_duration",
        width: 100,
      },
      {
        label: "topic name",
        field: "topic_name",
        width: 100,
      },
      {
        label: "Question Count",
        field: "QuestionCount",
        width: 100,
      },
      {
        label: "Action",
        field: "actions",
        width: 100,
      },
    ],
  });
  
  const getMyExamData = async (searchQuery, pageNumber,limitPage) => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Exam/getAll2` +
        "?" +
          `${searchQuery ? "searchQuery=" + searchQuery + "&" : ""}` +
          `${pageNumber ? "page=" + pageNumber + "&" : ""}` +
          `${limitPage ? "limit=" + limitPage + "&" : ""}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("res.data -------totalPages ", res.data.totalPages);
      setTotalPages(res.data.totalPages);
      const data = res.data.examList.map((item, index) => {
        return {
          id: index + 1,
          name: item.exam_name,
          category_name: item.category_name,
          subcategory_name: item.subcategory_name,
          topic_name: item.topic_name,
          marks_awarded: item.marks_awarded,
          marks_deducted: item.marks_deducted,
          time_duration: item.time_duration,
          QuestionCount: item.QuestionCount,
          actions: (
            <div>
              <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(item)} />

              <FontAwesomeIcon
                className="mx-3"
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />

              <FontAwesomeIcon
                icon={faEye}
                onClick={() => navigateDetails(item._id)}
              />
            </div>
          ),
        };
      });
      setJsonData(res.data);
      setDatatable((prevState) => ({
        ...prevState,
        rows: data,
      }));
      setIsLoadingData(false);
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };

  const getMySubCategoryData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Subcategory/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setMysubCategoryData(res.data);
    } catch (error) {
      setIsError(error.response);
    }
  };
  
  const handleEdit = (data) => {
    const fromtime = data.fromtime ? new Date(data.fromtime) : "";
    const totime = data.totime ? new Date(data.totime) : "";
    setEditData({
      ...data,
      fromtime,
      totime,
      examType: fromtime && totime ? "Time Period" : "Always Live",
    }); // Set the data of the selected row
    setEditOpen(true); // Open the modal
  };
  useEffect(() => {
    getMyCategoryData();
    getMySubCategoryData();
    getMyTopicsData();
    getMyExamData();
    getMySubscriptionData();
  }, []);

  const SigninSchema = Yup.object().shape({
    exam_name: Yup.string().required("Exam name is Required"),
    marks_awarded: Yup.string().required("Marks Awarded is Required"),
    category_id: Yup.string().required("categoty is Required"),
    instruction: Yup.string().required("instruction is Required"),
    attempt: Yup.string().required("Attempt is Required"),
  });

  const EditSchema = Yup.object().shape({
    exam_name: Yup.string().required("Exam name is Required"),
    category_id: Yup.string().required("Please select Category"),
    instruction: Yup.string().required("instruction is Required"),
    attempt: Yup.string().required("Attempt is Required"),
  });
  const handleDropdownChange = (value) => {
    getMyExamData("", currentPageNumber, value);
    console.log(value, "99999999");
    setCategory(value);
  };

  const updateExam = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      let suffix =
        updatedData.time_duration.split(":").length === 3 ? "" : ":00";

      const formattedTime = updatedData.time_duration
        ? `${updatedData.time_duration + suffix}`
        : "00:00" + suffix;
        const fromtime = updatedData.fromtime
        ? moment(updatedData.fromtime).format("YYYY-MM-DD HH:mm:ss")
        : "";
        const totime = updatedData.totime
        ? moment(updatedData.totime).format("YYYY-MM-DD HH:mm:ss")
        : "";
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/updateExam/${id}`,
        { ...updatedData, time_duration: formattedTime, fromtime, totime },
        {
          headers: { Authorization: token },
        }
      );
      // console.log(res.data); // Log the response or handle it as required.
      // Optionally, you can refetch the subcategory data after successful update.
      // getMySubCategoryData();
      onEditCloseModal(); // Close the modal after successful update.
      Swal.fire({
        position: "center",
        icon: "success",
        title: " Exam Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyExamData();
    } catch (error) {
      console.error(error.response); // Handle error responses
    }
  };

  const handleDelete = (id) => {
    // Show the confirmation dialog using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed with the delete operation
        try {
          const token = localStorage.getItem("token");
          const res = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/api/deleteExam/${id}`,
            {
              headers: { Authorization: token },
            }
          );
          // Optionally, you can refresh the subcategory data after successful deletion.
          // getMySubCategoryData();
          // Show a success message using SweetAlert
          Swal.fire("Deleted!", "Exam has been deleted.", "success");
          getMyExamData();
        } catch (error) {
          console.error(error.response); // Handle error responses
          // Show an error message using SweetAlert
          Swal.fire("Error", "Failed to delete the Exam", "error");
        }
      }
    });
  };

  // Handle category selection change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  // Filter subcategory options based on selected category
  const filteredSubcategories = subcategoryData.filter(
    (subcategory) => subcategory.category_id === selectedCategoryId
  );

  const handleSubcategoryChange = (Id) => {
    setSelectedSubCategoryId(Id);
  };

  // Assuming you have the topics data available as topicsData and the subcategories data as filteredSubcategories.

  // Function to filter the topics based on the selected subcategory.

  const filteredTopics = topicsData.filter(
    (topic) => topic.subcategory_id === selectedSubCategoryId
  );

  const handleChangedata = (e) => {
    console.log(e, "***********************************");
    setCurrentPageNumber(e);
    getMyExamData("", e);
  };
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Exam</h5>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <button className="btn btn-primary" onClick={onOpenModal}>
            Add Exam
            <FontAwesomeIcon icon={faPlus} className="mx-2" />
          </button>
          <DownloadExcelButton jsonData={jsonData} fileName="exam" />
        </div>
        <Modal open={open} onClose={onCloseModal} center>
          <h2>Add Exam</h2>
          <Formik
            initialValues={myData}
            validationSchema={SigninSchema}
            onSubmit={(values) => {
              createExam(values);
            }}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              /* and other goodies */
            }) => (
              <Form>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="firstName">
                      <Form.Label>Exam Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Exam name"
                        name="exam_name"
                        value={values.exam_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.exam_name &&
                        touched.exam_name &&
                        errors.exam_name}
                    </div>
                  </Col>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group id="gender">
                        <Form.Label>Select SubScription Plan</Form.Label>
                        <Select
                          name="subscription_id"
                          options={SubscriptionData.map((item) => ({
                            value: item.sid,
                            label: item.plan_name,
                          }))}
                          isMulti
                          onChange={(selectedOptions) => {
                            setFieldValue(
                              "subscription_id",
                              selectedOptions.map((option) => option.value)
                            );
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Category</Form.Label>
                      <Form.Select
                        name="category_id"
                        value={values.category_id}
                        onChange={(e) => {
                          handleCategoryChange(e.target.value);
                          handleChange(e);
                        }}
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
                    <Form.Group id="gender">
                      <Form.Label>Select Subcategory</Form.Label>
                      <Form.Select
                        name="subcategory_id"
                        value={values.subcategory_id}
                        onChange={(e) => {
                          handleSubcategoryChange(e.target.value);
                          handleChange(e);
                        }}
                      >
                        <option>Select Subcategory</option>
                        {filteredSubcategories.map((subcategory) => (
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.subcategory_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Topic</Form.Label>
                      <Form.Select
                        name="topic_id"
                        value={values.topic_id}
                        onChange={handleChange}
                      >
                        <option>Select Topic</option>
                        {filteredTopics.map((topic) => (
                          <option key={topic._id} value={topic._id}>
                            {topic.topic_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="phone">
                      <Form.Label>Attempt</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        placeholder="Attempt"
                        name="attempt"
                        value={values.attempt}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.attempt && touched.attempt && errors.attempt}
                    </div>
                  </Col>
                </Row>
                <Col md={12} className="mb-3">
                  <Form.Group id="gender">
                    <Form.Label>Exam Type</Form.Label>
                    <Form.Select
                      name="examType"
                      onChange={(e) => {
                        var selectedOption = e.target.value;
                        handleChange(e);
                        if (selectedOption === "Always Live") {
                          setFieldValue("fromtime", null);
                          setFieldValue("totime", null);
                        }
                      }}
                      onBlur={handleBlur}
                      value={values.examType}
                    >
                      <option value="Always Live">Always Live</option>
                      <option value="Time Period">Time Period</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                {values.examType === "Time Period" && (
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group id="fromdate" className="d-flex flex-column">
                        <Form.Label>From Datetime</Form.Label>
                        <DatePicker
                          onChange={(date) => {
                            setFieldValue("fromtime", date);
                          }}
                          showTimeSelect
                          selected={values.fromtime}
                          dateFormat="MM/dd/yyyy HH:mm"
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.fromtime && touched.fromtime && errors.fromtime}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="todate" className="d-flex flex-column">
                        <Form.Label>To Datetime</Form.Label>
                        <DatePicker
                          onChange={(date) => {
                            setFieldValue("totime", date);
                          }}
                          showTimeSelect
                          selected={values.totime}
                          dateFormat="MM/dd/yyyy HH:mm"
                        />
                      </Form.Group>
                      <div className="mb-3 text-danger">
                        {errors.totime && touched.totime && errors.totime}
                      </div>
                    </Col>
                  </Row>
                  
                )}
                
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="phone">
                      <Form.Label>Marks Awarded per Question</Form.Label>
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

                  <Col md={12} className="mb-3">
                    <Form.Label>Instruction</Form.Label>
                    {/* <Form.Group id="phone">
                      <Form.Label>Instruction</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="instruction"
                        name="instruction"
                        value={values.instruction}
                        onChange={handleChange}
                      />
                    </Form.Group> */}
                    <textarea
                      class="form-control"
                      id="instruction"
                      rows="6"
                      placeholder="Enter your instruction"
                      name="instruction"
                      value={values.instruction}
                      onChange={handleChange}
                    ></textarea>
                    <div className="mb-3 text-danger">
                      {errors.instruction &&
                        touched.instruction &&
                        errors.instruction}
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
                  {showMarksDeductedField && (
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
                  )}
                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Has Practice Mode?</Form.Label>
                      <Form.Select
                        defaultValue="false"
                        name="is_practice_mode"
                        value={values.is_practice_mode}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
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
                          value={values.time_duration}
                          onChange={(newTime) => {
                            setFieldValue("time_duration", newTime);
                          }}
                          format="HH:mm"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row md={12}>
                  <Col>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        checked={values.isfeatured}
                        id="flexCheckDefault"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("isfeatured", e.target.checked);
                        }}
                      />
                      <label class="form-check-label" for="flexCheckDefault">
                        Add this to Feature list
                      </label>
                    </div>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal open={Editopen} onClose={onEditCloseModal} center>
          <h2>Edit Exam</h2>
          <Formik
            initialValues={editData}
            validationSchema={EditSchema}
            onSubmit={(values) => {
              updateExam(editData._id, values); // Pass the ID and updated data to updateExam
            }}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="firstName">
                      <Form.Label>Exam Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Exam name"
                        name="exam_name"
                        value={values.exam_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.exam_name &&
                        touched.exam_name &&
                        errors.exam_name}
                    </div>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Subscription Plan</Form.Label>
                      <Select
                        name="subscription_id"
                        value={values.subscription_id.map((id) => ({
                          value: id,
                          label:
                            SubscriptionData.find((item) => item.sid === id)
                              ?.plan_name || "",
                        }))}
                        options={SubscriptionData.map((item) => ({
                          value: item.sid,
                          label: item.plan_name,
                        }))}
                        isMulti
                        onChange={(selectedOptions) => {
                          setFieldValue(
                            "subscription_id",
                            selectedOptions.map((option) => option.value)
                          );
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Category</Form.Label>
                      <Form.Select
                        name="category_id"
                        value={values.category_id}
                        onChange={(e) => {
                          handleCategoryChange(e.target.value);
                          handleChange(e);
                        }}
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
                    <Form.Group id="gender">
                      <Form.Label>Select Subcategory</Form.Label>
                      <Form.Select
                        name="subcategory_id"
                        value={values.subcategory_id}
                        onChange={(e) => {
                          handleSubcategoryChange(e.target.value);
                          handleChange(e);
                        }}
                      >
                        <option>Select Subcategory</option>
                        {filteredSubcategories.map((subcategory) => (
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.subcategory_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Topic</Form.Label>
                      <Form.Select
                        name="topic_id"
                        value={values.topic_id}
                        onChange={handleChange}
                      >
                        <option>Select Topic</option>
                        {filteredTopics.map((topic) => (
                          <option key={topic._id} value={topic._id}>
                            {topic.topic_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="phone">
                      <Form.Label>Attempt</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        placeholder="Attempt"
                        name="attempt"
                        value={values.attempt}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.attempt && touched.attempt && errors.attempt}
                    </div>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Exam Type</Form.Label>
                      <Form.Select
                        name="examType"
                        onChange={(e) => {
                          var selectedOption = e.target.value;
                          handleChange(e);
                          setFieldValue("fromtime", "");
                          setFieldValue("totime", "");
                        }}
                        value={values.examType}
                        onBlur={handleBlur}
                        // Set the value attribute based on the presence of values in fromtime and totime
                        // value={
                        //   values.fromtime && values.totime && values.fromtime != "" && values.totime != ""
                        //     ? "Time Period"
                        //     : "Always Live"
                        // }
                      >
                        <option value="Always Live">Always Live</option>
                        <option value="Time Period">Time Period</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* <p>{values.examType}</p> */}
                  {values.examType && values.examType == "Time Period" ? (
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group
                          id="fromdate"
                          className="d-flex flex-column"
                        >
                          <Form.Label>From Datetime</Form.Label>
                          <DatePicker
                            onChange={(date) => {
                              setFieldValue("fromtime", date);
                            }}
                            showTimeSelect
                            selected={values.fromtime}
                            dateFormat="MM/dd/yyyy HH:mm"
                          />
                        </Form.Group>
                        <div className="mb-3 text-danger">
                          {errors.fromtime &&
                            touched.fromtime &&
                            errors.fromtime}
                        </div>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group id="todate" className="d-flex flex-column">
                          <Form.Label>To Datetime</Form.Label>
                          <DatePicker
                            onChange={(date) => {
                              setFieldValue("totime", date);
                            }}
                            showTimeSelect
                            selected={values.totime}
                            dateFormat="MM/dd/yyyy HH:mm"
                          />
                        </Form.Group>
                        <div className="mb-3 text-danger">
                          {errors.totime && touched.totime && errors.totime}
                        </div>
                      </Col>
                    </Row>
                  ) : null}

                  {/* <Col md={6} className="mb-3">
                    <Form.Group id="fromtime" className="d-flex flex-column">
                      <Form.Label>From Datetime</Form.Label>
                      <DatePicker
                        onChange={(date) => {
                          setFieldValue("fromtime", date);
                        }}
                        showTimeSelect
                        selected={values.fromtime}
                        dateFormat="MM/dd/yyyy HH:mm"
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.fromtime && touched.fromtime && errors.fromtime}
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="totime" className="d-flex flex-column">
                      <Form.Label>To Datetime</Form.Label>
                      <DatePicker
                        onChange={(date) => {
                          setFieldValue("totime", date);
                        }}
                        showTimeSelect
                        selected={values.totime}
                        dateFormat="MM/dd/yyyy HH:mm"
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.totime && touched.totime && errors.totime}
                    </div>
                  </Col> */}
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="phone">
                      <Form.Label>Marks Awarded per Question</Form.Label>
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
                  <Col md={12} className="mb-3">
                    <Form.Group id="phone">
                      <Form.Label>Instruction</Form.Label>
                      {/* <Form.Control
                        required
                        type="text"
                        placeholder="instruction"
                        name="instruction"
                        value={values.instruction}
                        onChange={handleChange}
                      /> */}
                      <textarea
                        class="form-control"
                        id="instruction"
                        rows="6"
                        placeholder="Enter your instruction"
                        name="instruction"
                        value={values.instruction}
                        onChange={handleChange}
                      ></textarea>
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.instruction &&
                        touched.instruction &&
                        errors.instruction}
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

                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Has Practice Mode?</Form.Label>
                      <Form.Select
                        defaultValue="false"
                        name="is_practice_mode"
                        value={values.is_practice_mode}
                        onChange={(e) => {
                          handleChange(e);
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
                          value={values.time_duration}
                          format="HH:mm"
                          onChange={(newTime) => {
                            setFieldValue("time_duration", newTime);
                          }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Row md={12}>
                  <Col>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        checked={values.isfeatured}
                        id="flexCheckDefault"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("isfeatured", e.target.checked);
                        }}
                      />
                      <label class="form-check-label" for="flexCheckDefault">
                        Add this to Feature list
                      </label>
                    </div>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

        <h6 style={{ margin: "10px" }}>show entry</h6>
        <select
          name="category"
          value={category}
          onChange={(event) => handleDropdownChange(event.target.value)}
          style={{ width: "140px", height: "36px", marginTop: "0px" }}
        >
          {/* <option value="10">All</option> */}
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          
        </select>
        <div>
          {isLoadingData ? (
            <div className="loader-container">
              <Image
                className="loader-element animate__animated animate__jackInTheBox"
                src={ReactLogo}
                height={40}
              />
            </div>
          ) : (
            <MDBDataTable
              striped
              bordered
              small
              data={datatable}
              paging={false}
            />
          )}
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={totalPages}
            variant="outlined"
            shape="rounded"
            onChange={(e, page) => handleChangedata(page)}
            page={currentPageNumber} // Set the current page
            size="large" // Adjust size as needed
            siblingCount={1} // Adjust the number of sibling pages displayed
            boundaryCount={1} // Adjust the number of boundary pages displayed
          />
        </div>
      </Card.Body>
    </Card>
  );
};
