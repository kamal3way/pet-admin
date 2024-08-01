import React, { useState, useEffect, useRef } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
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
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from '@themesberg/react-bootstrap';
export const QuizDetails = () => {
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState("");
    const [time, setTime] = useState("00:00:00");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    const [Editopen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const onEditOpenModal = () => setEditOpen(true);
    const onEditCloseModal = () => setEditOpen(false);
    const editor = useRef(null);
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [QuestionData, setMyQuestionData] = useState({
        question_text: "",
        quiz_id: id,
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
        question_image: " ",
        explanation: "",
    });

    const handleEdit = (QuestionData) => {
        setEditData(QuestionData);
        console.log("EditDAta", QuestionData)
        setEditOpen(true);
    };

    const getQuestionData = async () => {
        const token = localStorage.getItem("token");
        setIsLoadingData(true);

        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/getAllQuestionByQuizId/${id}`,
                {
                    headers: { Authorization: token },
                }
            );
            setData(res.data);
            setIsLoadingData(false);
        } catch (error) {
            setIsError(error.response);
            setIsLoadingData(false);
        }
    };

    const updateQuestion = async (id, updatedData) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/updateQuizQuestion/${id}`,
                { ...updatedData },
                {
                    headers: { Authorization: token },
                }
            );
            console.log(res.data);
            onEditCloseModal();
            Swal.fire({
                position: "center",
                icon: "success",
                title: " Question Updated Successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            getQuestionData();
        } catch (error) {
            console.error(error.response);
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
                        `${process.env.REACT_APP_BASE_URL}/api/deleteQuizQuestion/${id}`,
                        {
                            headers: { Authorization: token },
                        }
                    );
                    console.log(res.data);
                    Swal.fire("Deleted!", "Question has been deleted.", "success");
                    getQuestionData();
                } catch (error) {
                    console.error(error.response);
                    Swal.fire("Error", "Failed to delete the Question.", "error");
                }
            }
        });
    };
    const addQuestion = async (values) => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/createQuizQuestion`,
                { ...values, quiz_id: id },
                {
                    headers: { Authorization: `${token}` },
                }
            );

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Question has been Created Successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            getQuestionData();
            onCloseModal();
        } catch (error) {
            setIsError(error.response.data.err.message);
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
    useEffect(() => {
        getQuestionData();
    }, []);
    const [imgReload, setImgReload] = useState(false);

    const fileERef = useRef(null);

    return (
        <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
                <h5 className="mb-4">Content</h5>

                <div className="container">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                        <button className="btn btn-primary" onClick={onOpenModal}>
                            Add Question
                            <FontAwesomeIcon icon={faPlus} className="mx-2" />
                        </button>
                    </div>
                    <div className="row">
                        {isLoadingData ? (
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
                                            onClick={() => handleDelete(question._id)}
                                        />
                                        {/* <FontAwesomeIcon
                                            icon={faEdit}
                                            className="float-rightIcon"
                                            onClick={() => handleEdit(question, index)}
                                        /> */}
                                    </div>
                                    <div className="question-header">
                                        <h2>Question {index + 1}</h2>
                                    </div>
                                    <div className="question-content">
                                        {question.question_text && (
                                            <p className="question-text">{"Q : "}{question.question_text}</p>
                                        )}
                                        <Col md={12} className="mb-3">
                                            <img
                                                src={`data:image/png;base64,${question.question_image[0]}`}
                                                // src={question.question_image[0]}
                                                alt={`Explanation`}
                                                className="explanation-image"
                                            />
                                        </Col>

                                        <div className="options-container row">
                                            {question.options.map((option, optionIndex) => (
                                                <div
                                                    key={option.value}
                                                    className="option d-flex col-md-6 mb-2"
                                                >
                                                    <p className="mx-1">{option.value}</p>

                                                    {option.answer_image ? (
                                                        <>
                                                            {option.answer_title}<br />
                                                            <img
                                                                src={`data:image/png;base64,${option.answer_image}`}
                                                                alt={`Option ${optionIndex + 1}`}
                                                                className="option-image"
                                                            />

                                                        </>

                                                    ) : (

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
                                                        Explanation
                                                    </label>
                                                    <div
                                                        className="form-control"
                                                        id="explanation"
                                                        style={{ whiteSpace: 'pre-wrap' }}
                                                        dangerouslySetInnerHTML={{ __html: question.explanation }}
                                                    ></div>

                                                </div>
                                            </Col>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>


                <Modal open={Editopen} onClose={onEditCloseModal} center>
                    <h2>Edit Question</h2>
                    <Formik
                        initialValues={editData}
                        // validationSchema={EditSchema}
                        onSubmit={(values) => {
                            console.log("values", values);
                            updateQuestion(editData._id, values); // Pass the ID and updated data to updateQuestion
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
                                    {/* <Col md={12} className="mb-3">
                  <Form.Group id="firstName">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your Question"
                      name="question_text"
                      value={values.question_text}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col> */}
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
{/* 
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
                                        ))} */}
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

                                   
                                    <Row className="mt-3">
                                                            {values.options.map((option, optionIndex) => (
                                                                <Col md={6} key={optionIndex} className="mt-2">
                                                                    <Form.Group controlId={`option${optionIndex}`}>
                                                                        <Form.Label>Option {String.fromCharCode(65 + optionIndex)}</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name={`option[${optionIndex}].value`}
                                                                            value={option.value}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <div>
                                                                            <Form.Control
                                                                                type="text"
                                                                                name={`option[${optionIndex}].answer_title`}
                                                                                value={option.answer_title}
                                                                                placeholder="Enter Option Title"
                                                                                onChange={handleChange}
                                                                            />
                                                                            <span>OR</span>
                                                                            <Form.Control
                                                                                type="file"
                                                                                name={`option[${optionIndex}].answer_image`}
                                                                                onChange={(event) => {
                                                                                    const file = event.currentTarget.files[0];
                                                                                    if (file) {
                                                                                        const reader = new FileReader();
                                                                                        reader.onload = (e) => {
                                                                                            const base64Data = e.target.result.split(",")[1];
                                                                                            setFieldValue(
                                                                                                `option[${optionIndex}].answer_image`,
                                                                                                base64Data
                                                                                            );
                                                                                        };
                                                                                        reader.readAsDataURL(file);
                                                                                    }
                                                                                }}
                                                                            />

                                                                        
                                                                            
                                                                        </div>
                                                                    </Form.Group>
                                                                </Col>
                                                            ))}
                                                        </Row>
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
                                        <div class="form-group">
                                            <label for="explanation">Explanation</label>
                                            <textarea
                        class="form-control"
                        id="explanation"
                        rows="12"
                        placeholder="Enter your Explanation"
                        name="explanation"
                        value={values.explanation}
                        onChange={handleChange}
                      ></textarea>

                                            {/* <JoditEditor
                                                ref={editor}
                                                value={values.explanation}
                                                onBlur={newContent => setFieldValue('explanation', newContent)}
                                                onChange={newContent => setFieldValue('explanation', newContent)}
                                                tabIndex={1} // tabIndex of textarea    
                                            /> */}
                                        </div>
                                    </Col>

                                    {/* {values.explanation_image && values.explanation_image[0] && ( */}
                                    {/* <Col md={12} className="mb-3">
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
                                    </Col> */}
                                    {/* )} */}
                                    {/* {!imgReload &&
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
                                        ))} */}
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

                <Modal open={open} onClose={onCloseModal} center>
                    <h2>Add Question</h2>
                    <Formik
                        initialValues={QuestionData} // Set initialValues to QuestionData
                        // validationSchema={validationSchema}
                        onSubmit={(values) => {
                            addQuestion(values);
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
                            setFieldValue
                        }) => (
                            <Form>
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <Form.Group controlId="question_text">
                                            <Form.Label>Question Text</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={6}
                                                placeholder="Enter your Question"
                                                name="question_text"
                                                value={values.question_text}
                                                onChange={handleChange}
                                            />
                                            <div className="mb-3 text-danger">
                                                {errors.question_text &&
                                                    touched.question_text &&
                                                    errors.question_text}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    {/* Options */}
                                    {/* <Col md={12} className="mb-3">
                                        <Form.Group controlId="options">

                                            <Form.Label>Options</Form.Label>
                                            {values.options.map((option, index) => (
                                                <Col md={12} className="mt-2">
                                                    <Form.Control
                                                        type="text"
                                                        name={`options[${index}].value`}
                                                        value={option.value}
                                                        onChange={handleChange}

                                                    />

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

                                                </Col>
                                            ))}
                                        </Form.Group>
                                    </Col> */}
                                    <Row className="mt-3">
                                        {values.options.map((option, index) => (
                                            <Col md={6} key={index} className="mt-2">
                                                <Form.Group controlId={`option_${index}`}>
                                                    <Form.Label>Option {String.fromCharCode(65 + index)}</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name={`options[${index}].value`}
                                                        value={option.value}
                                                        onChange={handleChange}
                                                    />
                                                    <div>
                                                        <Form.Control
                                                            type="text"
                                                            name={`options[${index}].answer_title`}
                                                            value={option.answer_title}
                                                            placeholder="Enter Option Title"
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
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                    {/* Correct Option */}
                                    <Col md={12} className="mb-3">
                                        <Form.Group controlId="correct_option">
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
                                            <div className="mb-3 text-danger">
                                                {errors.correct_option &&
                                                    touched.correct_option &&
                                                    errors.correct_option}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    {/* Question Image */}
                                    <Col md={12} className="mb-3">
                                        <Form.Group controlId="question_image">
                                            <Form.Label>Question Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="question_image"
                                                onChange={(event) => {
                                                    const file = event.currentTarget.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            const base64Data =
                                                                e.target.result.split(",")[1];
                                                            setFieldValue(
                                                                "question_image",
                                                                base64Data
                                                            );
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {/* Explanation */}
                                    <Col md={12} className="mb-3">
                                        <Form.Group controlId="explanation">
                                            <Form.Label>Explanation</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={6}
                                                placeholder="Enter your explanation"
                                                name="explanation"
                                                value={values.explanation}
                                                onChange={handleChange}
                                            />
                                            <div className="mb-3 text-danger">
                                                {errors.explanation &&
                                                    touched.explanation &&
                                                    errors.explanation}
                                            </div>
                                        </Form.Group>
                                    </Col>

                                </Row>
                                {/* Submit button */}
                                <div className="mt-3">
                                    <Button variant="primary" onClick={handleSubmit}>
                                        Add Question
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal>
            </Card.Body>
        </Card>
    );
};
