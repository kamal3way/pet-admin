import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    Col,
    Row,
    Card,
    Form,
    Button,
    InputGroup,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faEye, faMinus, faClosedCaptioning, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import * as Yup from "yup";
import { Modal } from "react-responsive-modal";
import { MDBDataTable } from "mdbreact";
import Tab from "@mui/material/Tab";
import axios from "axios";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Formik, FieldArray } from "formik";
import TabPanel from "@mui/lab/TabPanel";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import { Image } from '@themesberg/react-bootstrap';
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { useHistory } from "react-router-dom";
export const QuizOfDay = () => {
    const [QuizData, setMyQuizData] = useState({
        day: 4,
        quiz_name: "",
        time_duration: "",
        dateTime: "",
        marks_deducted: 0,
        marks_awarded: 0,
        description: "",
        question: [
            {
                question_text: "",
                options: [
                    {
                        value: "A",
                        answer_image: "",
                        answer_title: ""
                    },
                    {
                        value: "B",
                        answer_image: "",
                        answer_title: ""
                    },
                    {
                        value: "C",
                        answer_image: "",
                        answer_title: ""
                    },
                    {
                        value: "D",
                        answer_image: "",
                        answer_title: ""
                    }
                ],
                correct_option: "D",
                question_image: "",
                explanation: ""
            },
        ],
    });
    const [AllQuizData, setAllQuizData] = useState({});
    const [Addopen, setAddOpen] = useState(false);
    const onAddOpenModal = () => setAddOpen(true);
    const onAddCloseModal = () => setAddOpen(false);
    const [Editopen, setEditOpen] = useState(false);
    const onEditOpenModal = () => setEditOpen(true);
    const onEditCloseModal = () => setEditOpen(false);
    const validationSchema = Yup.object().shape({
        quiz_name: Yup.string().required("Quiz name is required"),
        day: Yup.number().required("Quiz day is required"),
        time_duration: Yup.string().required("Time duration is required"),
        dateTime: Yup.string().required("Date time is required"),
        marks_deducted: Yup.number().required("Marks deducted is required"),
        marks_awarded: Yup.number().required("Marks awarded is required"),
        description: Yup.string().required("Description is required"),
        questions: Yup.array().of(
            Yup.object().shape({
                question_text: Yup.string().required("Question text is required"),
                options: Yup.array().of(
                    Yup.object().shape({
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
                    })
                ),
                correctOption: Yup.string().required("Correct option is required"),
                question_image: Yup.mixed().required("Question image is required"),
                explanation: Yup.string().required("Explanation is required"),
            })
        ),
    });
    const history = useHistory();
    const navigateDetails = (id) => {
        history.push(`/quizDetails?id=${id}`);
    };
    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "No",
                field: "id",
                width: 270,
            },
            {
                label: "Quiz Name",
                field: "quiz_name",
                width: 100,
            },
            {
                label: "Day",
                field: "day",
                width: 100,
            },
            {
                label: "Date Time",
                field: "dateTime",
                width: 100,
            },
            {
                label: "Time_Duration",
                field: "time_duration",
                width: 100,
            },
            {
                label: "Marks Deducted",
                field: "marks_deducted",
                width: 100,
            },
            {
                label: "Marks Awarded",
                field: "marks_awarded",
                width: 100,
            },
            {
                label: "Description",
                field: "description",
                width: 100,
            },
            {
                label: "Action",
                field: "actions",
                width: 100,
            },

        ],
        rows: [],
    });
    const getMyQuizData = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/getAllQuizExam`,
                {
                    headers: { Authorization: token },
                }
            );
            setAllQuizData(res.data);
            const data = res.data?.map((item, index) => {
                return {
                    id: index + 1,
                    _id: item._id,
                    quiz_name: item.quiz_name,
                    day: item.day,
                    dateTime: item.dateTime,
                    time_duration: item.time_duration,
                    marks_deducted: item.marks_deducted,
                    marks_awarded: item.marks_awarded,
                    description: item.description,
                    actions: (
                        <div>
                            <FontAwesomeIcon icon={faEdit}
                            // onClick={() => handleEdit(item)} 
                            />
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="mx-3"
                                onClick={() => handleDelete(item._id)}
                            />
                            <FontAwesomeIcon
                                style={{ marginRight: "1rem" }}
                                icon={faEye}
                                onClick={() => navigateDetails(item._id)}
                            />

                        </div>
                    ),
                };
            });
            setDatatable((prevState) => ({
                ...prevState,
                rows: data,
            }));
        } catch (error) {
            // setIsError(error.response);
        }
    };
    const handleDelete = (id) => {
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
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.delete(
                        `${process.env.REACT_APP_BASE_URL}/api/deleteQuizExam/${id}`,
                        {
                            headers: { Authorization: token },
                        }
                    );
                    Swal.fire("Deleted!", "Quiz has been deleted.", "success");
                    getMyQuizData();
                } catch (error) {
                    Swal.fire("Error", "Failed to delete the Quiz", "error");
                }
            }
        });
    };
    const createQuiz = async (values) => {
        const token = localStorage.getItem("token");
        const formattedTime = values.time_duration ? `${values.time_duration}:00` : "00:00:00";

        const date = new Date(values.dateTime);
        const formattedDateTime = date.toISOString().slice(0, 19).replace('T', ' ');
        // const formatedatetime = values.time_duration ? `${values.time_duration}:00` : "00:00:00";
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/quizExam/create`,
                { ...values, time_duration: formattedTime, dateTime: formattedDateTime },
                {
                    headers: { Authorization: `${token}` },
                }
            );
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Quiz has been Created Successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            // getMyExamData();
            onAddCloseModal();
            setMyQuizData({
                day: 4,
                quiz_name: "",
                time_duration: "",
                dateTime: "",
                marks_deducted: 0,
                marks_awarded: 0,
                description: "",
                question: [
                    {
                        question_text: "",
                        options: [
                            {
                                value: "A",
                                answer_image: "",
                                answer_title: ""
                            },
                            {
                                value: "B",
                                answer_image: "",
                                answer_title: ""
                            },
                            {
                                value: "C",
                                answer_image: "",
                                answer_title: ""
                            },
                            {
                                value: "D",
                                answer_image: "",
                                answer_title: ""
                            }
                        ],
                        correct_option: "D",
                        question_image: "",
                        explanation: ""
                    },
                ],
            });
            getMyQuizData();
        } catch (error) {
        }
    };
    useEffect(() => {
        getMyQuizData();
    }, []);
    return (
        <Card border="black">
            <Card.Body>
                <h5 className="mb-4">Opinion</h5>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <button className="btn btn-primary"
                        onClick={onAddOpenModal}
                    >
                        Add Quiz
                        <FontAwesomeIcon icon={faPlus} className="mx-2" />
                    </button>
                </div>
            </Card.Body>
            <Modal open={Addopen} onClose={onAddCloseModal} center>
                <h2>Add Quiz</h2>
                <Formik
                    initialValues={QuizData}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log(values);
                        createQuiz(values);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <Form>
                            <Row>
                                <Col md={12} className="mt-3">
                                    <Form.Group controlId="quiz_name">
                                        <Form.Label>Quiz Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="quiz_name"
                                            value={values.quiz_name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {touched.quiz_name && errors.quiz_name && <div className="text-danger">{errors.quiz_name}</div>}
                                </Col>
                                <Col md={4} className="mt-3">
                                    <Form.Group controlId="day">
                                        <Form.Label>Quiz day</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="day"
                                            value={values.day}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {touched.day && errors.day && <div className="text-danger">{errors.day}</div>}
                                </Col>
                                <Col md={4} className="mt-3">
                                    <Form.Group controlId="time_duration">
                                        <Form.Label>Time Duration</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="time_duration"
                                            placeholder="HH:MM:SS"
                                            value={values.time_duration}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {touched.time_duration && errors.time_duration && <div className="text-danger">{errors.time_duration}</div>}
                                </Col>
                                <Col md={4} className="mt-3">
                                    <Form.Group controlId="dateTime">
                                        <Form.Label>Date Time</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="dateTime"
                                            value={values.dateTime}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {touched.dateTime && errors.dateTime && <div className="text-danger">{errors.dateTime}</div>}

                                </Col>
                                <Col md={6} className="mt-3">
                                    <Form.Group controlId="marks_deducted">
                                        <Form.Label>marks_deducted</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="marks_deducted"
                                            value={values.marks_deducted}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {touched.marks_deducted && errors.marks_deducted && <div className="text-danger">{errors.marks_deducted}</div>}
                                </Col>
                                <Col md={6} className="mt-3">
                                    <Form.Group controlId="marks_awarded">
                                        <Form.Label>marks_awarded</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="marks_awarded"
                                            value={values.marks_awarded}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {touched.marks_awarded && errors.marks_awarded && <div className="text-danger">{errors.marks_awarded}</div>}
                                </Col>
                                <Col md={12} className="mt-3">
                                    <Form.Group controlId="description">
                                        <Form.Label>description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {touched.description && errors.description && <div className="text-danger">{errors.description}</div>}
                                </Col>
                                <Col md={12} className="mt-3">
                                    <FieldArray name="question">
                                        {({ push, remove }) => (
                                            <>
                                                {values.question.map((question, index) => (
                                                    <div key={index} className="mt-3" style={{ backgroundColor: "lightgray", padding: "15px" }}>
                                                        <center>   <h5>Question {index + 1}</h5></center>
                                                        <Form.Group controlId={`question_text_${index}`} className="mt-3">
                                                            <Form.Label>Question Text</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name={`question[${index}].question_text`}
                                                                value={question.question_text}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.question && touched.question[index] && errors.question && errors.question[index] && errors.question[index].question_text && (
                                                                <div className="text-danger">{errors.question[index].question_text}</div>
                                                            )}
                                                        </Form.Group>

                                                        <Row className="mt-3">
                                                            {question.options.map((option, optionIndex) => (
                                                                <Col md={6} key={optionIndex} className="mt-2">
                                                                    <Form.Group controlId={`option_${index}_${optionIndex}`}>
                                                                        <Form.Label>Option {String.fromCharCode(65 + optionIndex)}</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name={`question[${index}].options[${optionIndex}].value`}
                                                                            value={option.value}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <div>
                                                                            <Form.Control
                                                                                type="text"
                                                                                name={`question[${index}].options[${optionIndex}].answer_title`}
                                                                                value={option.answer_title}
                                                                                placeholder="Enter Option Title"
                                                                                onChange={handleChange}
                                                                            />
                                                                            <span>OR</span>
                                                                            <Form.Control
                                                                                type="file"
                                                                                name={`question[${index}].options[${optionIndex}].answer_image`}
                                                                                onChange={(event) => {
                                                                                    const file = event.currentTarget.files[0];
                                                                                    if (file) {
                                                                                        const reader = new FileReader();
                                                                                        reader.onload = (e) => {
                                                                                            const base64Data = e.target.result.split(",")[1];
                                                                                            setFieldValue(
                                                                                                `question[${index}].options[${optionIndex}].answer_image`,
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
                                                                    </Form.Group>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                        <Form.Group controlId={`correct_option${index}`} className="mt-3" >
                                                            <Form.Label>Correct Option</Form.Label>
                                                            <Form.Control
                                                                as="select"
                                                                name={`question[${index}].correct_option`}
                                                                value={question.correct_option}
                                                                onChange={handleChange}
                                                            >
                                                                {question.options.map((option, optionIndex) => (
                                                                    <option key={optionIndex} value={option.value}>
                                                                        {String.fromCharCode(65 + optionIndex)}
                                                                    </option>
                                                                ))}
                                                            </Form.Control>
                                                          
                                                            <Form.Group id="question_image" className="mt-2">
                                                                <Form.Label>
                                                                    Question Image
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    name={`question[${index}].question_image`}
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        if (file) {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (e) => {
                                                                                const base64Data =
                                                                                    e.target.result.split(",")[1];
                                                                                setFieldValue(
                                                                                    `question[${index}].question_image`,
                                                                                    base64Data
                                                                                );
                                                                            };
                                                                            reader.readAsDataURL(file);
                                                                        }
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId={`explanation_${index}`} className="mt-3">
                                                                <Form.Label>Explanation</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name={`question[${index}].explanation`}
                                                                    value={question.explanation}
                                                                    onChange={handleChange}
                                                                />
                                                            </Form.Group>
                                                        </Form.Group>
                                                        <Button variant="danger" onClick={() => remove(index)} className="mt-3 d-flex"  >
                                                            Remove Question
                                                        </Button>

                                                    </div>
                                                ))}

                                                <Button className="mt-3" variant="success" onClick={() => push({ questionText: "", options: [{ value: "A", answerTitle: "", answer_image: "" }, { value: "B", answerTitle: "", answer_image: "" }, { value: "C", answerTitle: "", answer_image: "" }, { value: "D", answerTitle: "",answer_image: "" }], correct_option: "",question_image:"",explanation:"" })}>
                                                    Add Question
                                                </Button>
                                            </>
                                        )}
                                    </FieldArray>
                                </Col>

                                <Col md={12} className="mt-3">
                                    <Button
                                        variant="primary"
                                        // type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </Button>
                                </Col>
                            </Row>


                        </Form>
                    )}
                </Formik>
            </Modal>
            <MDBDataTable striped bordered small data={datatable} />
        </Card>
    );
}