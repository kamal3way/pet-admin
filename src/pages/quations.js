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
import {
  faEdit,
  faTrash,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import JoditEditor from "jodit-react";
import { Select } from "@mui/material";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from '@themesberg/react-bootstrap';
const Quations = () => {
  const [fileBuffer, setFileBuffer] = useState("");
  const [examData, setExamData] = useState([]);
  const editor = useRef(null);
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
        `${process.env.REACT_APP_BASE_URL}/api/Exam/getAllExamName`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("***********",res);
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
      console.log("Update Responce:", res);
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
  useEffect(() => {
    getMyCategoryData();
    getMySubCategoryData();
    getMyTopicsData();
    getMyExamData();
    getMySubscriptionData();
  }, []);

  const [myNewData, setMyNewData] = useState({
    exam_name: "",
    category_id: "",
    subcategory_id: undefined,
    topic_id: undefined,
    marks_awarded: "",
    marks_deducted: "",
    time_duration: "",
    instruction: "",
    negative_marking: false,
    is_practice_mode: false,
  });

  const SigninNewSchema = Yup.object().shape({
    exam_name: Yup.string().required("Exam name is Required"),
    marks_awarded: Yup.string().required("Marks Awarded is Required"),
    category_id: Yup.string().required("categoty is Required"),
    instruction: Yup.string().required("instruction is Required"),
  });

  const getMyPostData = async (values) => {
    const token = localStorage.getItem("token");
    const formattedTime = time ? `${time}:00` : "00:00:00";
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Exam/create`,
        { ...values, time_duration: formattedTime },
        {
          headers: { Authorization: `${token}` },
        }
      );
      getMyExamData();
      console.log("e_id", res?.data["_id"]);
      setMyData({ exam_id: res?.data["_id"] });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Exam has been Created Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      // getMyExamData();
      onCloseModal();
      // setMyData({
      //   exam_name: "",
      //   category_id: "",
      //   subcategory_id: undefined,
      //   topic_id: undefined,
      //   marks_awarded: "",
      //   marks_deducted: "",
      //   time_duration: "",
      //   negative_marking: false,
      // });
      setTime("00:00:00");
      setIsExpanded(false);
    } catch (error) {
      setIsError(error.response.data.err.message);
    }
  };

  // const stripHtmlTags = (html) => {
  //   const tmp = document.createElement('div');
  //   tmp.innerHTML = html;
  //   return tmp.textContent || tmp.innerText || '';
  // };

  return (
    <>
      <div className="container">
        {/* <Card border="light" className="bg-white shadow-sm mb-4"> */}
        {/* <Card.Body> */}
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <h5 className="mb-4">Questions</h5>
          <button
            className={isExpanded ? "btn btn-danger" : "btn btn-primary"}
            onClick={handleToggle}
          >
            {isExpanded ? "Close Exam" : "Add Exam"}
            <FontAwesomeIcon
              icon={isExpanded ? faTimes : faPlus}
              className="mx-2"
            />
          </button>
          {/* <DownloadExcelButton jsonData={jsonData} fileName="Subscription" /> */}
        </div>
        {/* <Modal open={open} onClose={onCloseModal} center> */}
        <div className={`expanding-content ${isExpanded ? "expanded" : ""}`}>
          <h2>Add New Exam</h2>
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
                  {/* <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group id="gender">
                        <Form.Label>Select SubScription Plan</Form.Label>
                        <CreatableSelect
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
                  </Row> */}

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
                </Row>
                <Row>
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

                  <Col md={12} className="mb-3">
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
                          value={time}
                          onChange={(newTime) => setTime(newTime)}
                          format="HH:mm:ss"
                        />
                      </InputGroup>
                    </Form.Group>
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
        </div>
        {/* </Card.Body> */}
        {/* </Card> */}
        <Formik
          initialValues={myData}
          validationSchema={SigninSchema}
          onSubmit={(values, { setSubmitting, setFieldValue, resetForm }) => {
            UploadQuations(values, setFieldValue);
            resetForm();
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
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form>
              <div>
                <div className="form-group mb-3">
                  <Form.Label>Select Exam</Form.Label>
                  <CreatableSelect
                    name="exam_id"
                    value={values.exam_id}
                    onChange={(selectedOption) =>
                      setFieldValue("exam_id", selectedOption)
                    }
                    options={examData.map((exam) => ({
                      value: exam._id,
                      label: exam.exam_name,
                    }))}
                  />
                  <div className="mb-3 text-danger">
                    {errors.exam_id && touched.exam_id && errors.exam_id}
                  </div>
                </div>
                <DragAndDrop
                  getFiles={getFiles}
                  droppedFiles={droppedFiles}
                  setDroppedFiles={setDroppedFiles}
                />
              </div>
              <div className="container mt-3">
                <div className="row">
                  {data.length > 0 && (
                    <div className="text-center mt-2 mb-2">
                      <button className="btn btn-primary" onClick={onOpenModal}>
                        Add Question
                        <FontAwesomeIcon icon={faPlus} className="mx-2" />
                      </button>
                    </div>
                  )}
                  {isLoadingQuestions ? (
                <div className="loader-container">
                <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
                </div>
                  ) : (
                    data?.map((question, index) => (
                      <div key={index} className="question-card col-md-6">
                        <div>
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="mx-3 float-rightIcon"
                            onClick={() => handleDelete(index)}
                          />
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="float-rightIcon"
                            onClick={() => handleEdit(question, index)}
                          />
                        </div>
                        <div className="question-header">
                          <h2>Question {index + 1}</h2>
                        </div>
                        <div className="question-content">
                          {question.question_text && (
                            <p className="question-text">
                              {question.question_text}
                            </p>
                          )}
                          {question.question_image &&
                            question.question_image[0] && (
                              <img
                                src={`data:image/png;base64,${question.question_image[0]}`}
                                // src={question.question_image[0]}

                                alt={`Question ${index + 1}`}
                                className="question-image"
                              />
                            )}
                          <div className="options-container row">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={option.value}
                                className="option d-flex col-md-6 mb-2"
                              >
                                <p className="mx-1">{option.value}</p>

                                {option.answer_image ? (
                                  <img
                                    src={`data:image/png;base64,${option.answer_image}`}
                                    alt={`Option ${optionIndex + 1}`}
                                    className="option-image"
                                  />
                                ) : (
                                  // <button className="option-button">
                                  //   {option.answer_title}
                                  // </button>
                                  // <div className="ans-text">
                                  //   {option.answer_title}
                                  // </div>
                                  <div
                                    className={`ans-text ${option.value === question.correct_option
                                      ? "correct-option"
                                      : ""
                                      }`}
                                  >
                                    {option.answer_title}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="explanation">
                            <Col md={12} className="mb-3">
                              <div class="form-group">
                                <label for="explanation">
                                  Explanation (Read only)
                                </label>
                                <div
                                  className="form-control"
                                  id="explanation"
                                  style={{ whiteSpace: 'pre-wrap' }} // Preserve line breaks
                                  dangerouslySetInnerHTML={{ __html: question.explanation }}
                                ></div>
                                {/* <textarea
                                  readonly
                                  class="form-control"
                                  id="explanation"
                                  rows="12"
                                  name="explanation"
                                  value={stripHtmlTags(question.explanation)}
                                ></textarea> */}
                              </div>
                            </Col>

                            {/* {values.explanation_image && values.explanation_image[0] && ( */}

                            {question.explanation_image &&
                              question.explanation_image[0] &&
                              question.explanation_image.map(
                                (img, imgIndex) => (
                                  <img
                                    src={`data:image/png;base64,${img}`}
                                    alt={`Explanation ${imgIndex + 1}`}
                                    className="explanation-image"
                                  />
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {data.length > 0 && (
                  <div className="text-center mt-2 mb-2">
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Create Question Paper
                    </button>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <Modal open={Editopen} onClose={onEditCloseModal} center>
        <h2>Edit Question</h2>
        <Formik
          initialValues={editData}
          // validationSchema={EditSchema}
          onSubmit={(values) => {
            console.log("values", values);
            updateQuestion(editData.index, values); // Pass the ID and updated data to updateQuestion
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
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form>
              <Row>
                <div class="form-group">
                  <label for="question_text">Question</label>
                  <textarea
                    class="form-control"
                    id="question_text"
                    rows="6"
                    placeholder="Enter your Question"
                    name="question_text"
                    value={values.question_text}
                    onChange={handleChange}
                  ></textarea>
                </div>
                {/* {values.question_image && values.question_image[0] && (
                  <p>{values.question_image[0]}</p>
                  )} */}
                {/* <p>{values.question_image[0]}</p> */}
                {/* <div class="row"> */}

                {!imgReload &&
                  values.question_image.map((img, imgIndex) => (
                    <div class="image-area" style={{ width: "90%" }}>
                      <img
                        src={`data:image/png;base64,${img}`}
                        alt={`Explanation ${imgIndex + 1}`}
                      ></img>
                      <a
                        class="remove-image"
                        onClick={() => {
                          console.log(values.question_image);
                          let after_delet = values.question_image.splice(
                            imgIndex,
                            1
                          );
                          values.question_image.concat(after_delet);
                          setImgReload(true);
                          setTimeout(() => setImgReload(false), 1000);
                        }}
                        style={{ display: "inline" }}
                      >
                        &#215;
                      </a>
                    </div>
                  ))}
                {/* </div> */}

                <Col md={12} className="mb-3">
                  <Form.Group id="explanation_image">
                    <Form.Label>
                      Add {values.question_image[0] ? "More" : null} Question
                      Image
                    </Form.Label>

                    <Form.Control
                      type="file"
                      name="[question_image]"
                      multiple={true}
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const base64Data = e.target.result.split(",")[1];
                            setFieldValue(
                              "question_image",
                              values.question_image.concat(base64Data)
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group id="options">
                    <Form.Label>Options</Form.Label>
                    {values.options?.map((option, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Form.Control
                          type="text"
                          placeholder={`Enter option ${option.value} title`}
                          name={`options[${index}].answer_title`}
                          value={option.answer_title}
                          onChange={handleChange}
                        />
                        {option.answer_image && (
                          <Form.Control
                            type="file"
                            name={`options[${index}].answer_image`}
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const base64Data =
                                    e.target.result.split(",")[1];
                                  setFieldValue(
                                    `options[${index}].answer_image`,
                                    base64Data
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group id="correct_option">
                    <Form.Label>Correct Option</Form.Label>
                    <Form.Control
                      as="select"
                      name="correct_option"
                      value={values.correct_option}
                      onChange={handleChange}
                    >
                      {values.options?.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="mb-3">
                  {/* <Form.Group id="explanation">
                    <Form.Label>Explanation</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter explanation"
                      name="explanation"
                      value={values.explanation}
                      onChange={handleChange}
                    />
                  </Form.Group> */}
                  <div class="form-group">
                    <label for="explanation">Explanation</label>
                    {/* <textarea
                      class="form-control"
                      id="explanation"
                      rows="12"
                      placeholder="Enter your Explanation"
                      name="explanation"
                      value={values.explanation}
                      onChange={handleChange}
                    ></textarea> */}
                    <JoditEditor
                      ref={editor}
                      value={values.explanation}
                      onBlur={newContent => setFieldValue('explanation', newContent)}
                      onChange={newContent => setFieldValue('explanation', newContent)}
                      tabIndex={1} // tabIndex of textarea                      
                    />
                  </div>
                </Col>

                {/* {values.explanation_image && values.explanation_image[0] && ( */}
                <Col md={12} className="mb-3">
                  <Form.Group id="explanation_image">
                    <Form.Label>
                      Add {values.explanation_image[0] ? "More" : null}{" "}
                      Explanation Image
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="explanation_image"
                      fileRef={fileERef}
                      onChange={(event) => {
                        console.log(event.currentTarget.files);
                        const file = event.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const base64Data = e.target.result.split(",")[1];
                            console.log("base64Data", base64Data);
                            setFieldValue(
                              "explanation_image",
                              values.explanation_image.concat(base64Data)
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                {/* )} */}
                {!imgReload &&
                  values.explanation_image.map((img, imgIndex) => (
                    <div class="image-area" style={{ width: "90%" }}>
                      <img
                        src={`data:image/png;base64,${img}`}
                        alt={`Explanation ${imgIndex + 1}`}
                      ></img>
                      <a
                        class="remove-image"
                        onClick={() => {
                          console.log(values.explanation_image);
                          let after_delet = values.explanation_image.splice(
                            imgIndex,
                            1
                          );
                          values.explanation_image.concat(after_delet);
                          setImgReload(true);
                          setTimeout(() => setImgReload(false), 1000);
                        }}
                        style={{ display: "inline" }}
                      >
                        &#215;
                      </a>
                    </div>
                  ))}
              </Row>

              <div className="mt-3">
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                  Update
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal open={open} onClose={onCloseModal} center>
        <h2>Add Question</h2>
        <Formik
          initialValues={QuestionData}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            addQuestion(values); // Pass the ID and updated data to updateQuestion
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
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form>
              {console.log(errors, "errors")}
              <Row>
                <Col md={12} className="mb-3">
                  {/* <Form.Group id="firstName">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your Question"
                      name="question_text"
                      value={values.question_text}
                      onChange={handleChange}
                    />
                  </Form.Group> */}
                  <textarea
                    class="form-control"
                    id="question_text"
                    rows="6"
                    placeholder="Enter your Question"
                    name="question_text"
                    value={values.question_text}
                    onChange={handleChange}
                  ></textarea>
                  <div className="mb-3 text-danger">
                    {errors.question_text &&
                      touched.question_text &&
                      errors.question_text}
                  </div>
                </Col>
                {!imgReload &&
                  values.question_image.map((img, imgIndex) => (
                    <div class="image-area" style={{ width: "90%" }}>
                      <img
                        src={`data:image/png;base64,${img}`}
                        alt={`question_image ${imgIndex + 1}`}
                      ></img>
                      <a
                        class="remove-image"
                        onClick={() => {
                          console.log(values.question_image);
                          let after_delet = values.question_image.splice(
                            imgIndex,
                            1
                          );
                          values.question_image.concat(after_delet);
                          setImgReload(true);
                          setTimeout(() => setImgReload(false), 1000);
                        }}
                        style={{ display: "inline" }}
                      >
                        &#215;
                      </a>
                    </div>
                  ))}
                {/* </div> */}

                <Col md={12} className="mb-3">
                  <Form.Group id="explanation_image">
                    <Form.Label>
                      Add {values.question_image[0] ? "More" : null} Question
                      Image
                    </Form.Label>

                    <Form.Control
                      type="file"
                      name="[question_image]"
                      multiple={true}
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const base64Data = e.target.result.split(",")[1];
                            setFieldValue(
                              "question_image",
                              values.question_image.concat(base64Data)
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                {/* <Col md={12} className="mb-3">
                  <Form.Group id="explanation_image">
                    <Form.Label>Question Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="question_image"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const base64Data = e.target.result.split(",")[1];
                            setFieldValue("question_image", base64Data);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Form.Group>
                </Col> */}
                <Col md={12} className="mb-3">
                  <Form.Group id="options">
                    <Form.Label>Options</Form.Label>
                    {values.options.map((option, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Form.Select
                          className="mx-1 quation-select"
                          name={`options[${index}].value`}
                          value={option.value}
                          onChange={handleChange}
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </Form.Select>

                        <div>
                          <Form.Control
                            type="text"
                            placeholder={`Enter option title`}
                            name={`options[${index}].answer_title`}
                            value={option.answer_title}
                            onChange={handleChange}
                          />
                          <span>OR</span>
                          <Form.Control
                            type="file"
                            name={`options[${index}].answer_image`}
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const base64Data =
                                    e.target.result.split(",")[1];
                                  setFieldValue(
                                    `options[${index}].answer_image`,
                                    base64Data
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <div className="mb-3 text-danger">
                            {errors.options &&
                              errors.options[index] &&
                              (errors.options[index].answer_image ||
                                errors.options[index].answer_title)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group id="correct_option">
                    <Form.Label>Correct Option</Form.Label>
                    <Form.Select
                      as="select"
                      name="correct_option"
                      value={values.correct_option}
                      onChange={handleChange}
                    >
                      <option>Select Correct Option</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </Form.Select>
                  </Form.Group>
                  <div className="mb-3 text-danger">
                    {errors.correct_option &&
                      touched.correct_option &&
                      errors.correct_option}
                  </div>
                </Col>
              </Row>

              <Row>
                <div class="form-group">
                  <label for="explanation">Explanation</label>
                  {/* <textarea
                    class="form-control"
                    id="explanation"
                    rows="12"
                    placeholder="Enter your Explanation"
                    name="explanation"
                    value={values.explanation}
                    onChange={handleChange}
                  ></textarea> */}
                  <JoditEditor
                    ref={editor}
                    value={values.explanation}
                    onBlur={newContent => setFieldValue('explanation', newContent)}
                    onChange={newContent => setFieldValue('explanation', newContent)}
                    tabIndex={1} // tabIndex of textarea                      
                  />
                </div>
                <Col md={12} className="mb-3">
                  <Form.Group id="explanation_image">
                    <Form.Label>Add Explanation Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="explanation_image"
                      fileRef={fileERef}
                      onChange={(event) => {
                        console.log(event.currentTarget.files);
                        const file = event.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const base64Data = e.target.result.split(",")[1];
                            console.log("base64Data", base64Data);
                            setFieldValue(
                              "explanation_image",
                              values.explanation_image.concat(base64Data)
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                {/* )} */}
                {!imgReload &&
                  values.explanation_image.map((img, imgIndex) => (
                    <div class="image-area" style={{ width: "90%" }}>
                      <img
                        src={`data:image/png;base64,${img}`}
                        alt={`Explanation ${imgIndex + 1}`}
                      ></img>
                      <a
                        class="remove-image"
                        onClick={() => {
                          console.log(values.explanation_image);
                          let after_delet = values.explanation_image.splice(
                            imgIndex,
                            1
                          );
                          values.explanation_image.concat(after_delet);
                          setImgReload(true);
                          setTimeout(() => setImgReload(false), 1000);
                        }}
                        style={{ display: "inline" }}
                      >
                        &#215;
                      </a>
                    </div>
                  ))}
                {/* <Col md={12} className="mb-3">
                  <Form.Group id="explanation">
                    <Form.Label>Explanation</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter explanation"
                      name="explanation"
                      value={values.explanation}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="mb-3 text-danger">
                    {errors.explanation &&
                      touched.explanation &&
                      errors.explanation}
                  </div>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group id="explanation_image">
                    <Form.Label>Explanation Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="explanation_image"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const base64Data = e.target.result.split(",")[1];
                            setFieldValue("explanation_image", base64Data);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Form.Group>
                </Col> */}
              </Row>

              <div className="mt-3">
                <Button variant="primary" onClick={handleSubmit}>
                  Add Question
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default Quations;

// {data?.map((question, index) => (
//   <div key={index} className="question-card col-md-6">
//     <div>
//       <FontAwesomeIcon
//         icon={faTrash}
//         className="mx-3 float-rightIcon"
//       />
//       <FontAwesomeIcon
//         icon={faEdit}
//         className="float-rightIcon"
//         onClick={() => handleEdit(question, index)}
//       />
//     </div>
//     <div className="question-header">
//       <h2>Question {index + 1}</h2>
//     </div>
//     <div className="question-content">
//       {question.question_text && (
//         <p className="question-text">
//           {question.question_text}
//         </p>
//       )}
//       {question.question_image &&
//         question.question_image[0] && (
//           <img
//             src={`data:image/png;base64,${question.question_image[0]}`}
//             // src={question.question_image[0]}

//             alt={`Question ${index + 1}`}
//             className="question-image"
//           />
//         )}
//       <div className="options-container row">
//         {question.options.map((option, optionIndex) => (
//           <div
//             key={option.value}
//             className="option d-flex col-md-6 mb-2"
//           >
//             <p className="mx-1">{option.value}</p>

//             {option.answer_image ? (
//               <img
//                 src={`data:image/png;base64,${option.answer_image}`}
//                 alt={`Option ${optionIndex + 1}`}
//                 className="option-image"
//               />
//             ) : (
//               // <button className="option-button">
//               //   {option.answer_title}
//               // </button>
//               // <div className="ans-text">
//               //   {option.answer_title}
//               // </div>
//               <div
//                 className={`ans-text ${
//                   option.value === question.correct_option
//                     ? "correct-option"
//                     : ""
//                 }`}
//               >
//                 {option.answer_title}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="explanation">
//         {question.explanation && (
//           <p>Explanation: {question.explanation}</p>
//         )}
//         {question.explanation_image &&
//           question.explanation_image[0] && (
//             <img
//               src={`data:image/png;base64,${question.explanation_image}`}
//               alt={`Explanation ${index + 1}`}
//               className="explanation-image"
//             />
//           )}
//       </div>
//     </div>
//   </div>
// ))}
