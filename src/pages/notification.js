import React, { useState, useEffect, useRef } from "react";
import DragAndDrop from "./dragAndDrop";
import axios from "axios";
import Swal from "sweetalert2";
import CreatableSelect from "react-select";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faTimes, } from "@fortawesome/free-solid-svg-icons";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import { Select } from "@mui/material";

export const Notification = () => {
  const [fileBuffer, setFileBuffer] = useState("");
  const [examData, setExamData] = useState([]);

  const [isError, setIsError] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [data, setData] = useState([]);
  const [myData, setMyData] = useState({
    exam_id: "64f04163801721ec481e1e42",
  });
  const [droppedFiles, setDroppedFiles] = useState([]);
  const SigninSchema = Yup.object().shape({
    exam_id: Yup.object().required("Please Select Exam"),
  });
  const [time, setTime] = useState("00:00:00");
  const styles = { width: 224, display: "block", marginBottom: 10 };
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const [Editopen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const onEditCloseModal = () => setEditOpen(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [imgReload, setImgReload] = useState(false);

  const reloadImgs = () => {
    setImgReload(true);
    setImgReload(false);
  };


  const fileERef = useRef(null);

  const [QuestionData, setMyQuestionData] = useState({
    question_number: "",
    question_text: "",
    options: [
      {
        value: "A",
        answer_image: "",
        answer_title: "",
      },
      {
        value: "B",
        answer_image: "",
        answer_title: "",
      },
      {
        value: "C",
        answer_image: "",
        answer_title: "",
      },
      {
        value: "D",
        answer_image: "",
        answer_title: "",
      },
    ],
    correct_option: "",
    question_image: [],
    explanation: "",
    explanation_image: [],
  });

  const handleEdit = (QuestionData, index) => {
    console.log("QuestionData", QuestionData);
    setEditData({
      ...QuestionData,
      explanation_image: QuestionData.explanation_image,
      question_image: QuestionData.question_image,
      index: index,
    });
    setEditOpen(true);
  };

  const [SubscriptionData, setMySubscriptionData] = useState([]);
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

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const [categoryData, setMyCategoryData] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [subcategoryData, setMysubCategoryData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);

  const [showMarksDeductedField, setShowMarksDeductedField] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  const handleSubcategoryChange = (Id) => {
    setSelectedSubCategoryId(Id);
  };

  const filteredSubcategories = subcategoryData.filter(
    (subcategory) => subcategory.category_id === selectedCategoryId
  );

  const filteredTopics = topicsData.filter(
    (topic) => topic.subcategory_id === selectedSubCategoryId
  );

  const handleNegativeMarkingChange = (e) => {
    const selectedValue = e.target.value;
    setShowMarksDeductedField(selectedValue === "true");
  };

  const addQuestion = (values) => {
    console.log(values, "values");
    let newData = data;
    newData.push(values);
    setData(newData);
    setOpen(false);
  };

  const handleDelete = (index) => {
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
        console.log(index, "index");
        setData((prevData) => {
          const newData = [...prevData];
          newData.splice(index, 1);
          return newData;
        });

        Swal.fire("Deleted!", "Quation has been deleted.", "success");
      }
    });
  };

  const updateQuestion = (index, updatedData) => {
    // Assuming editData.index holds the index of the question being edited
    const newData = [...data];
    newData[index] = {
      ...updatedData,
      question_image: updatedData.question_image,
      explanation_image: updatedData.explanation_image,
    };
    console.log(newData, "newData");
    setData(newData);
    setEditOpen(false); // Close the modal after update
  };

  const getMyExamData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Exam/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setExamData(res.data);
      console.log(res.data, "examData");
    } catch (error) {
      setIsError(error.response);
    }
  };

  const getQuation = async () => {
    // const base64String = Buffer.from(fileBuffer).toString("base64");
    setIsLoadingQuestions(true);

    const formData = new FormData();

    // Append the file to the FormData object with a field name "file"

    formData.append("file", fileBuffer);
    // Append other form data properties to the FormData object
    formData.append("exam_id", selectedExam.value);
    // `https://docparser.sushrutalgs.in/process_file`,
    try {
      const res = await axios.post(
        `https://docparser.sushrutalgs.in/process_file`,
        formData,
        {
          headers: {
            // Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(res.data.data_list);
      setIsLoadingQuestions(false);
    } catch (error) {
      setIsError(error);
      setIsLoadingQuestions(false);
    }
  };

  // const [editableData, setEditableData] = useState(data);

  // // Function to handle question text change
  // const handleQuestionTextChange = (index, newText) => {
  //   const updatedData = [...editableData];
  //   updatedData[index].question_text = newText;
  //   setEditableData(updatedData);
  // };

  // // Function to handle option text change
  // const handleOptionTextChange = (questionIndex, optionIndex, newText) => {
  //   const updatedData = [...editableData];
  //   updatedData[questionIndex].options[optionIndex].answer_title = newText;
  //   setEditableData(updatedData);
  // };
  const UploadQuations = async (values, setFieldValue) => {
    const token = localStorage.getItem("token");
    try {
      const dataWithQuestionNumber = data.map((question, index) => ({
        ...question,
        question_number: index + 1,
        exam_id: values.exam_id.value,
      }));

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Question/createmultipleQue`,
        dataWithQuestionNumber,
        {
          headers: { Authorization: `${token}` },
        }
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Question has been Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setFieldValue("exam_id", "");
      setData([]);
      setFileBuffer(""); // Clear the file buffer
      setDroppedFiles("");
    } catch (error) {
      setIsError(error.response.data.err.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const OptionSchema = Yup.object().shape({
    value: Yup.string().required("Option value is required"),
    answer_image: Yup.mixed().test(
      "oneOfFields",
      "Either an answer image or title is required",
      function (value) {
        const answerTitle = this.parent.answer_title;
        return value || answerTitle;
      }
    ),
    answer_title: Yup.string(),
  });
  const validationSchema = Yup.object().shape({
    question_text: Yup.string().required("Question text is required"),
    options: Yup.array().of(OptionSchema),
    correct_option: Yup.string().required("Correct option is required"),
    explanation: Yup.string().required("explanation is required"),
  });

  const getFiles = (files) => {
    setFileBuffer(files[0]);
  };

  useEffect(() => {
    setData([]);
    getQuation();
  }, [fileBuffer]);



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
      console.log(res.data, "sub category");
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
      console.log(res.data, "setTopicsData");
    } catch (error) {
      setIsError(error.response);
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
      console.log(res.data, "sub category");
    } catch (error) {
      setIsError(error.response);
    }
  };
  // useEffect(() => {
  //   getMyCategoryData();
  //   getMySubCategoryData();
  //   getMyTopicsData();
  //   getMyExamData();
  //   getMySubscriptionData();
  // }, []);

  const [myNewData, setMyNewData] = useState({
    title: "",
    body: ""
  });

  const SigninNewSchema = Yup.object().shape({
    title: Yup.string().required("Notification title is Required"),
    body: Yup.string().required("Notification text is Required")
  });

  const sendNotification = async (values, resetForm) => {
    const token = localStorage.getItem("token");
    // const formattedTime = time ? `${time}:00` : "00:00:00";
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/sendpushNotification`,
        { ...values },
        {
          headers: { Authorization: `${token}` },
        }
      );
      resetForm();

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Notification sent Successfully",
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
        <h2>App Notifications</h2>
        <hr></hr>
        <Formik
          initialValues={myNewData}
          validationSchema={SigninNewSchema}
          onSubmit={(values, { resetForm }) => {
            sendNotification(values, resetForm);
          }}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
          }) => (
            <Form>
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

