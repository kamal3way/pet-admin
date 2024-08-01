
import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Card, Form, Button } from "@themesberg/react-bootstrap";
import "react-time-picker/dist/TimePicker.css";
import { Formik, FieldArray, } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import "rsuite/dist/rsuite.css";
import { MultiCascader } from "rsuite";
import Select from "react-select";

import JoditEditor from "jodit-react";
import { useHistory, useLocation, } from "react-router-dom";

import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from '@themesberg/react-bootstrap';
export const SubscriptionData = () => {
    const history = useHistory();
    const [isError, setIsError] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    // const otherParam = JSON.parse(queryParams.get("otherParam"));
    // const allParamsArray = Array.from(queryParams.entries());
    // const editData = location.state?.data; 
    const [editData, setEditData] = useState();
    const [categoryData, setMyCategoryData] = useState([]);
    const [examData, setMyExamData] = useState([]);
    const [videosData, setMyVideoData] = useState([]);
    const [notesData, setMyNotesData] = useState([]);
    const [subcategoryData, setMysubCategoryData] = useState([]);

    const [topicsData, setTopicsData] = useState([]);
    const [selectedExamOptions, setSelectedExamOptions] = useState([]);
    const [selectedVideosOptions, setSelectedVideosOptions] = useState([]);
    const [selectedNotesOptions, setSelectedNotesOptions] = useState([]);
    // const [finalselectedOptions, setFinalSelectedOptions] = useState([]);
    const [finalselectedExamOptions, setFinalSelectedExamOptions] = useState([]);
    const [finalselectedVideosOptions, setFinalSelectedVideosOptions] = useState([]);
    const [finalselectedNotesOptions, setFinalSelectedNotesOptions] = useState([]);
    const editor = useRef(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [preparingFor, setPreparingFor] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);

    const generateVideoCascadingOptions = () => {

        const cascadingOptions = categoryData?.map((category) => ({
            label: category.category_name,
            value: category._id,
            children: subcategoryData
                .filter((subcategory) => subcategory.category_id === category._id)
                .map((subcategory) => ({
                    label: subcategory.subcategory_name,
                    value: subcategory._id,
                    children: videosData
                        .filter((video) => video.subcategory_id === subcategory._id)
                        .map((video) => ({
                            label: video.topic_name,
                            value: video._id,
                        })),
                })),
        }));

        return cascadingOptions;
    };
    const generateNotesCascadingOptions = () => {
        const cascadingOptions = categoryData?.map((category) => ({
            label: category.category_name,
            value: category._id,
            children: subcategoryData
                .filter((subcategory) => subcategory.category_id === category._id)
                .map((subcategory) => ({
                    label: subcategory.subcategory_name,
                    value: subcategory._id,
                    children: notesData
                        .filter((note) => note.subcategory_id === subcategory._id)
                        .map((note) => ({
                            label: note.topic_name,
                            value: note._id,
                        })),
                })),
        }));

        return cascadingOptions;
    };
    const generateExamCascadingOptions = () => {
        const cascadingExamOptions = categoryData?.map((category) => ({
            label: category.category_name,
            value: category._id,
            children: subcategoryData
                .filter((subcategory) => subcategory.category_id === category._id)
                .map((subcategory) => ({
                    label: subcategory.subcategory_name,
                    value: subcategory._id,
                    children: examData
                        .filter((topic) => topic.subcategory_id === subcategory._id)
                        .map((topic) => ({
                            label: topic.exam_name,
                            value: topic._id,
                        })),
                })),
        }));

        return cascadingExamOptions;
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
    const getMyExamData = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/Exam/getAll`,
                {
                    headers: { Authorization: token },
                }
            );
            setMyExamData(res.data);

        } catch (error) {
            setIsError(error.response);

        }
    };
    const getMyVideoData = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/Content/AllVideoWithoutImg`,
                {
                    headers: { Authorization: token },
                }
            );
            setMyVideoData(res.data);

        } catch (error) {
            setIsError(error.response);

        }
    };
    const getMyNotesData = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/Content/getAllByPdf`,
                {
                    headers: { Authorization: token },
                }
            );
            setMyNotesData(res.data);

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
    const getPreparingFor = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/preparing/getpreparing`,
                {
                    headers: { Authorization: token },
                }
            );
            setPreparingFor(
                res.data.map((i) => ({
                    value: i.preparing_for,
                    label: i.preparing_for,
                }))
            );
        } catch (error) {
            setIsError(error.response);
        }
    };
    const handleExamSelect = (selectedValues) => {

        var final_select = [];
        selectedValues?.forEach((element) => {
            categoryData.filter((val) => {
                if (val._id === element) {
                    subcategoryData
                        .filter((subcategory) => subcategory.category_id === val._id)
                        .map((subcategory) => {
                            let tops = examData.filter(
                                (topic) => topic.subcategory_id === subcategory._id
                            );
                            if (tops[0]) {
                                tops?.forEach((element) => {
                                    final_select.push(element["_id"]);
                                });
                            }
                        });
                }
            });

            subcategoryData
                .filter((subcategory) => subcategory._id === element)
                .map((subcategory) => {
                    let tops = examData.filter(
                        (topic) => topic.subcategory_id === subcategory._id
                    );
                    if (tops[0]) {
                        tops?.forEach((element) => {
                            final_select.push(element["_id"]);
                        });
                    }
                });

            examData.filter((topic) => {
                if (topic._id === element) {
                    final_select.push(topic._id);
                }
            });
        });
        setSelectedExamOptions(selectedValues);
        setFinalSelectedExamOptions(final_select);
        console.log("Exam Content :", final_select);
    };
    const handleNotesSelect = (selectedValues) => {
      

        var final_select = [];
        selectedValues?.forEach((element) => {
            categoryData.filter((val) => {
                if (val._id === element) {
                    subcategoryData
                        .filter((subcategory) => subcategory.category_id === val._id)
                        .map((subcategory) => {
                            let tops = notesData.filter(
                                (topic) => topic.subcategory_id === subcategory._id
                            );
                            if (tops[0]) {
                                tops?.forEach((element) => {
                                    final_select.push(element["_id"]);
                                });
                            }
                        });
                }
            });

            subcategoryData
                .filter((subcategory) => subcategory._id === element)
                .map((subcategory) => {
                    let tops = notesData.filter(
                        (topic) => topic.subcategory_id === subcategory._id
                    );
                    if (tops[0]) {
                        tops?.forEach((element) => {
                            final_select.push(element["_id"]);
                        });
                    }
                });

            notesData.filter((topic) => {
                if (topic._id === element) {
                    final_select.push(topic._id);
                }
            });
        });
        setSelectedNotesOptions(selectedValues);
        setFinalSelectedNotesOptions(final_select);

        console.log("Note Content :", final_select);
    };
    const handleVideoSelect = (selectedValues) => {
  
        var final_select = [];
        selectedValues?.forEach((element) => {
            categoryData.filter((val) => {
                if (val._id === element) {
                    subcategoryData
                        .filter((subcategory) => subcategory.category_id === val._id)
                        .map((subcategory) => {
                            let tops = videosData.filter(
                                (topic) => topic.subcategory_id === subcategory._id
                            );
                            if (tops[0]) {
                                tops?.forEach((element) => {
                                    final_select.push(element["_id"]);
                                });
                            }
                        });
                }
            });

            subcategoryData
                .filter((subcategory) => subcategory._id === element)
                .map((subcategory) => {
                    let tops = videosData.filter(
                        (topic) => topic.subcategory_id === subcategory._id
                    );
                    if (tops[0]) {
                        tops?.forEach((element) => {
                            final_select.push(element["_id"]);
                        });
                    }
                });

            videosData.map((topic) => {
                if (topic._id === element) {
                    final_select.push(topic._id);
                }
            });
        });
        setSelectedVideosOptions(selectedValues);
        setFinalSelectedVideosOptions(final_select);
        // }
        // else {
        //     setIsLoadingData(true)
        // }
        console.log("Video Content :", final_select);
    };
    const geteditData = async () => {
        console.log(id, "id");
        const token = localStorage.getItem("token");
        setIsLoadingData(true);
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/getbySubscription/${id}`,
                {
                    headers: { Authorization: token },
                }
            );
            res.data = {
                ...res.data,
                duration: res.data.duration.map((i) => ({
                    ...i,
                    discountedPrice:
                        i.offer && typeof i.offer === "string"
                            ? (
                                (i.price *
                                    parseFloat(100 - parseFloat(i.offer.replace("%", "")))) /
                                100
                            ).toFixed(2)
                            : null,
                })),
            };
            setEditData(res.data);
            setSelectedVideosOptions(res.data.tempUIDataVideos);
            setSelectedNotesOptions(res.data.tempUIDataNotes);
            setSelectedExamOptions(res.data.tempUIDataExam);

            // console.log("editData :", res.data)
            setIsLoadingData(false);
        } catch (error) {
            setIsError(error.response);
            setIsLoadingData(false);
        }
    };
    useEffect(() => {
        getMyCategoryData();
        getMySubCategoryData();
        getMyTopicsData();
        getMyExamData();
        getPreparingFor();
        getMyVideoData();
        getMyNotesData();
    }, []);
    useEffect(() => {
        geteditData();
    }, []);

    const EditSchema = Yup.object().shape({
        // plan_id: Yup.string().required("Plan ID is required"),
        plan_name: Yup.string().required("Plan name is required"),
        description: Yup.string().required("description is required"),
        benifit: Yup.array().of(Yup.string().required("Benefit is required")),
        duration: Yup.array().of(
            Yup.object().shape({
                price: Yup.string().required("Price is required"),
                day: Yup.string().required("day is required"),
                // offer: Yup.string().required("Offer is required"),
            })
        ),
        select_preparing: Yup.array().test(
            "is-not-blank",
            "Group is required",
            (value) => {
                return value && value.length > 0;
            }
        ),
    });
    const updateSubscription = async (id, updatedData) => {
        try {
            const token = localStorage.getItem("token");
            updatedData = {
                ...updatedData,
                duration: updatedData.duration.map((i) => ({
                    ...i,
                    offer:
                        i.discountedPrice || parseInt(i.discountedPrice) === 0
                            ? (((i.price - i.discountedPrice) / i.price) * 100).toString() +
                            "%"
                            : "",
                })),
                exam_id: [...finalselectedExamOptions],
                content_id: [
                    ...finalselectedVideosOptions,
                    ...finalselectedNotesOptions,
                ],
                tempUIDataExam: selectedExamOptions,
                tempUIDataNotes: selectedNotesOptions,
                tempUIDataVideos: selectedVideosOptions,
            };

            const res = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/updateSubscription/${id}`,
                updatedData,
                {
                    headers: { Authorization: token },
                }
            );

            // Optionally, you can refetch the subcategory data after successful update.

            // onEditCloseModal(); // Close the modal after successful update.
            history.push(`/subscription`);
            Swal.fire({
                position: "center",
                icon: "success",
                title: " Subscription Updated Successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            // window.location.reload();

        } catch (error) {
            console.error(error.response); // Handle error responses
        }
    };
    const styles = {
        width: 224,
        display: "block",
        marginBottom: 10,
        zIndex: 100,
    };
    const handleEditClick = (data) => {
        setEditData(data);
        setIsDisabled(false);
    };
    return (
        <>

            {editData && !isLoadingData ?
                (<>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                                <h5 className="mb-4">Subscription Plans</h5>

                                <button className={"btn btn-primary"} onClick={() => {
                                    handleEditClick(editData);
                                    handleVideoSelect(editData.tempUIDataVideos);
                                    handleNotesSelect(editData.tempUIDataNotes);
                                    handleExamSelect(editData.tempUIDataExam);
                                }} disabled={!isDisabled}
                                >
                                    {"Edit Subscription"}
                                    {/* <FontAwesomeIcon
                                    icon={faPlus}
                                    className="mx-2"
                                /> */}
                                </button>
                            </div>
                            <>

                                <Formik
                                    initialValues={editData}
                                    validationSchema={EditSchema}
                                    onSubmit={(values) => {
                                        updateSubscription(editData.sid, values); // Pass the ID and updated data to updateSubscription
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
                                            {/* <h3>Edit {values.plan_name}</h3> */}

                                            <Row>
                                                <Col md={12} className="mb-3">
                                                    <Form.Group id="firstName">
                                                        <Form.Label>Plan name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter your first name"
                                                            name="plan_name"
                                                            value={values.plan_name}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                handleVideoSelect(editData.tempUIDataVideos);
                                                                handleNotesSelect(editData.tempUIDataNotes);
                                                                handleExamSelect(editData.tempUIDataExam);
                                                            }}
                                                            disabled={isDisabled}
                                                        />
                                                    </Form.Group>
                                                    <div className="mb-3 text-danger">
                                                        {errors.plan_name &&
                                                            touched.plan_name &&
                                                            errors.plan_name}
                                                    </div>
                                                </Col>

                                                <Col md={12} className="mb-3 ">
                                                    <Form.Group id="firstName">
                                                        <Form.Label>Description</Form.Label>
                                                        <JoditEditor
                                                            ref={editor}
                                                            value={values.description}
                                                            // onBlur={newContent => setFieldValue('description', newContent)}
                                                            onChange={newContent => {
                                                                setFieldValue('description', newContent);
                                                                handleVideoSelect(editData.tempUIDataVideos);
                                                                handleNotesSelect(editData.tempUIDataNotes);
                                                                handleExamSelect(editData.tempUIDataExam);
                                                            }
                                                            } // Update Formik state on change
                                                            // onChange={handleChange}                                 
                                                            tabIndex={1} // tabIndex of textarea    
                                                            isDisabled={isDisabled}
                                                        />
                                                    </Form.Group>
                                                    <div className="mb-3 text-danger">
                                                        {errors.description &&
                                                            touched.description &&
                                                            errors.description}
                                                    </div>
                                                </Col>
                                                <FieldArray name="benifit">
                                                    {({ push, remove }) => (
                                                        <>
                                                            {values?.benifit?.map((item, index) => (
                                                                <div key={index}>
                                                                    <Row>
                                                                        <Col md={12} className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>
                                                                                    Benefit {index + 1}
                                                                                </Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    placeholder="Enter Benefit"
                                                                                    name={`benifit.${index}`}
                                                                                    value={item}
                                                                                    onChange={(e) => {
                                                                                        handleChange(e);
                                                                                        handleVideoSelect(editData.tempUIDataVideos);
                                                                                        handleNotesSelect(editData.tempUIDataNotes);
                                                                                        handleExamSelect(editData.tempUIDataExam);
                                                                                    }}
                                                                                    disabled={isDisabled}
                                                                                />
                                                                                {errors?.benifit &&
                                                                                    touched?.benifit &&
                                                                                    touched?.benifit[index] && (
                                                                                        <div className="text-danger">
                                                                                            {errors.benifit[index]}
                                                                                        </div>
                                                                                    )}
                                                                            </Form.Group>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            ))}

                                                            {/* Show one "Benefit" field by default */}
                                                            {values?.benifit?.length === 0 && (
                                                                <div>
                                                                    <Row>
                                                                        <Col md={12} className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Benefit 1</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    placeholder="Enter Benefit"
                                                                                    name={`benifit.0`}
                                                                                    value={values.benifit[0]}
                                                                                    onChange={(e) => {
                                                                                        handleChange(e);
                                                                                        handleVideoSelect(editData.tempUIDataVideos);
                                                                                        handleNotesSelect(editData.tempUIDataNotes);
                                                                                        handleExamSelect(editData.tempUIDataExam);
                                                                                    }}
                                                                                    disabled={isDisabled}
                                                                                />
                                                                                {errors?.benifit &&
                                                                                    touched?.benifit &&
                                                                                    touched?.benifit[0] && (
                                                                                        <div className="text-danger">
                                                                                            {errors.benifit[0]}
                                                                                        </div>
                                                                                    )}
                                                                            </Form.Group>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            )}

                                                            <Row>
                                                                <Col md={12} className="mb-3">
                                                                    <Button
                                                                        variant="primary"
                                                                        onClick={() => push("")}
                                                                        disabled={isDisabled}
                                                                    >
                                                                        Add Benefit
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    )}
                                                </FieldArray>
                                            </Row>

                                            <FieldArray name="duration">
                                                {({ push, remove }) => (
                                                    <>
                                                        {values?.duration?.map((item, index) => (
                                                            <div key={index}>
                                                                <Row>
                                                                    <Col md={4} className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Price {index + 1}</Form.Label>
                                                                            <Form.Control
                                                                                type="text"
                                                                                placeholder="Enter Price"
                                                                                name={`duration[${index}].price`}
                                                                                value={item.price}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    handleVideoSelect(editData.tempUIDataVideos);
                                                                                    handleNotesSelect(editData.tempUIDataNotes);
                                                                                    handleExamSelect(editData.tempUIDataExam);
                                                                                }}
                                                                                disabled={isDisabled}
                                                                            />
                                                                            {errors?.duration &&
                                                                                errors?.duration[index] &&
                                                                                errors?.duration[index].price && (
                                                                                    <div className="text-danger">
                                                                                        {errors.duration[index].price}
                                                                                    </div>
                                                                                )}
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={4} className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>
                                                                                Discounted Price {index + 1}
                                                                            </Form.Label>
                                                                            <Form.Control
                                                                                type="number"
                                                                                placeholder="Enter Discounted Price"
                                                                                name={`duration[${index}].discountedPrice`}
                                                                                value={item.discountedPrice}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    handleVideoSelect(editData.tempUIDataVideos);
                                                                                    handleNotesSelect(editData.tempUIDataNotes);
                                                                                    handleExamSelect(editData.tempUIDataExam);
                                                                                }}
                                                                                disabled={isDisabled}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={4} className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>day {index + 1}</Form.Label>
                                                                            <Form.Control
                                                                                type="text"
                                                                                placeholder="Enter day"
                                                                                name={`duration[${index}].day`}
                                                                                value={item.day}
                                                                                onChange={(e) => {
                                                                                    handleChange(e);
                                                                                    handleVideoSelect(editData.tempUIDataVideos);
                                                                                    handleNotesSelect(editData.tempUIDataNotes);
                                                                                    handleExamSelect(editData.tempUIDataExam);
                                                                                }}
                                                                                disabled={isDisabled}
                                                                            />
                                                                            {errors?.duration &&
                                                                                errors?.duration[index] &&
                                                                                errors?.duration[index].day && (
                                                                                    <div className="text-danger">
                                                                                        {errors.duration[index].day}
                                                                                    </div>
                                                                                )}
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        ))}

                                                        <Row>
                                                            <Col md={12} className="mb-3">
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={() =>
                                                                        push({
                                                                            price: "",
                                                                            day: "",
                                                                            discountedPrice: "",
                                                                        })
                                                                    }
                                                                    disabled={isDisabled}
                                                                >
                                                                    Add Duration
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </FieldArray>
                                            <Col md={6} className="mb-3" style={{ zIndex: 100 }}>
                                                <Form.Group id="select_preparing">
                                                    <Form.Label>Select Group</Form.Label>
                                                    <Select
                                                        name="select_preparing"
                                                        value={values?.select_preparing.map((id) => ({
                                                            value: id,
                                                            label: id,
                                                        }))}
                                                        options={preparingFor}
                                                        isMulti
                                                        onChange={(selectedOptions) => {
                                                            setFieldValue(
                                                                "select_preparing",
                                                                selectedOptions.map((option) => option.value)
                                                            );
                                                            handleVideoSelect(editData.tempUIDataVideos);
                                                            handleNotesSelect(editData.tempUIDataNotes);
                                                            handleExamSelect(editData.tempUIDataExam);

                                                        }}
                                                        isDisabled={isDisabled}
                                                    />
                                                    {errors.select_preparing && (
                                                        <div className="text-danger">
                                                            {errors.select_preparing}
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Row>
                                                <Col md={4} className="mb-3 ">
                                                    <Form.Group id="firstName">
                                                        <Form.Label> Videos </Form.Label>
                                                        <MultiCascader
                                                            toggleAs={Button}
                                                            size="lg"
                                                            placeholder="Content Videos"
                                                            data={generateVideoCascadingOptions()}
                                                            value={selectedVideosOptions}
                                                            onChange={(selectedvalue) => { handleVideoSelect(selectedvalue);
                                                                handleNotesSelect(editData.tempUIDataNotes);
                                                                handleExamSelect(editData.tempUIDataExam); }}
                                                            style={styles}
                                                            disabled={isDisabled}
                                                        // parentSelectable={false}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4} className="mb-3 ">
                                                    <Form.Group id="firstName">
                                                        <Form.Label>Notes</Form.Label>
                                                        <MultiCascader
                                                            toggleAs={Button}
                                                            size="lg"
                                                            placeholder="Content Notes"
                                                            data={generateNotesCascadingOptions()}
                                                            value={selectedNotesOptions}
                                                            onChange={(selectedvalue) => {
                                                                handleNotesSelect(selectedvalue);
                                                                handleVideoSelect(editData.tempUIDataVideos);
                                                                handleExamSelect(editData.tempUIDataExam);
                                                            }}
                                                            style={styles}
                                                            disabled={isDisabled}
                                                        // parentSelectable={false}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4} className="mb-3 ">
                                                    <Form.Group id="firstName">
                                                        <Form.Label>Exams</Form.Label>
                                                        <MultiCascader
                                                            toggleAs={Button}
                                                            size="lg"
                                                            placeholder="Exam Topics"
                                                            data={generateExamCascadingOptions()}
                                                            value={selectedExamOptions}
                                                            onChange={(selectedvalue) => { handleExamSelect(selectedvalue); 
                                                                handleNotesSelect(editData.tempUIDataNotes);
                                                                handleVideoSelect(editData.tempUIDataVideos);}}
                                                            style={styles}
                                                            disabled={isDisabled}
                                                        // parentSelectable={false}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="py-3">
                                                <Col>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="viewall"
                                                        label="View All"
                                                        checked={values.viewall}
                                                        onChange={(e) => {
                                                            setFieldValue("liveClass", e.target.checked);
                                                            setFieldValue("mockExam", e.target.checked);
                                                            setFieldValue("exam", e.target.checked);
                                                            setFieldValue("videos", e.target.checked);
                                                            setFieldValue("notes", e.target.checked);
                                                            handleVideoSelect(editData.tempUIDataVideos);
                                                            handleNotesSelect(editData.tempUIDataNotes);
                                                            handleExamSelect(editData.tempUIDataExam);
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="liveClass"
                                                        label="Live Classes"
                                                        checked={values.liveClass}
                                                        onChange={(e) => {
                                                            setFieldValue("liveClass", e.target.checked);
                                                            handleVideoSelect(editData.tempUIDataVideos);
                                                            handleNotesSelect(editData.tempUIDataNotes);
                                                            handleExamSelect(editData.tempUIDataExam);
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="mockExam"
                                                        label="Mock Exams"
                                                        checked={values.mockExam}
                                                        onChange={(e) => {
                                                            setFieldValue("mockExam", e.target.checked);
                                                            handleVideoSelect(editData.tempUIDataVideos);
                                                            handleNotesSelect(editData.tempUIDataNotes);
                                                            handleExamSelect(editData.tempUIDataExam);
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="exam"
                                                        label="Only MCQ's"
                                                        checked={values.exam}
                                                        onChange={(e) => {
                                                            setFieldValue("exam", e.target.checked);
                                                            handleVideoSelect(editData.tempUIDataVideos);
                                                            handleNotesSelect(editData.tempUIDataNotes);
                                                            handleExamSelect(editData.tempUIDataExam);
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="videos"
                                                        label="Only Videos"
                                                        checked={values.videos}
                                                        onChange={(e) => {
                                                            setFieldValue("videos", e.target.checked);
                                                            handleVideoSelect(editData.tempUIDataVideos);
                                                            handleNotesSelect(editData.tempUIDataNotes);
                                                            handleExamSelect(editData.tempUIDataExam);
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="notes"
                                                        label="Only Notes"
                                                        checked={values.notes}
                                                        onChange={(e) => {
                                                            setFieldValue("notes", e.target.checked);
                                                            handleVideoSelect(editData.tempUIDataVideos);
                                                            handleNotesSelect(editData.tempUIDataNotes);
                                                            handleExamSelect(editData.tempUIDataExam);
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>


                                            </Row>
                                            <div className="mt-3">
                                                <Button
                                                    variant="primary"
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={isDisabled}
                                                >
                                                    Update
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </>




                        </Card.Body>
                    </Card></>) :
                (


                    <div className="loader-container">
                        <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
                    </div>

                )
            }



        </>

    );
};

