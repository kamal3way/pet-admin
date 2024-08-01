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

import { Select } from "@mui/material";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from '@themesberg/react-bootstrap';
export const Banner = () => {
  const [fileTopBuffer, setFileTopBuffer] = useState("");
  const [upperBanners, setUpperBanners] = useState([]);
  const [fileBottomBuffer, setFileBottomBuffer] = useState("");
  const [bottomBanners, setBottomBanners] = useState([]);
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


  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [imgReload, setImgReload] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const reloadImgs = () => {
    setImgReload(true);
    setImgReload(false);
  };

  const fileERef = useRef(null);

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
  const [bannerData, setMyBannerData] = useState({});

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

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
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
        const res = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/deleteBanner/${myNewData._id}/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        getBannerData();

        Swal.fire("Deleted!", "Banner has been deleted.", "success");
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

  const getBannerData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Banner/getBanner`,
        {
          headers: { Authorization: token },
        }
      );
      setMyNewData(res.data);
      setUpperBanners(res.data.upperbanner);
      setBottomBanners(res.data.lowerbanner);

      setIsLoadingData(true);
    } catch (error) {
      setIsError(error.response);
    }
  };
  useEffect(() => {
    getBannerData();
  }, []);

  const [myNewData, setMyNewData] = useState({
    offer: "",
    upperbanner_url: "",
    lowerbanner_url: "",
    upperbanner: [],
    lowerbanner: [],
  });

  const SigninNewSchema = Yup.object().shape({
    offer: Yup.string().required("offer text is Required"),
    upperbanner: Yup.array() // Change the field type to array
      // .min(1, "At least one banner is required")
      // .required("upper banner is Required"),
    // upperbanner_url: Yup.string().required("upperbanner url is Required"),
  });

  const createBanner = async (values) => {
    const formData = new FormData();
    // if (fileTopBuffer || fileBottomBuffer) {
      if (fileTopBuffer) {
        formData.append("upperbanner_img", fileTopBuffer);
      }
      if (fileBottomBuffer) {
        formData.append("lowerbanner_img", fileBottomBuffer);
      }
      if (fileTopBuffer && values.upperbanner_url) {
        formData.append("upperbanner_url", values.upperbanner_url);
      }
      if (fileBottomBuffer && values.lowerbanner_url) {
        formData.append("lowerbanner_url", values.lowerbanner_url);
      }

      formData.append("offer", values.offer || "");
      const token = localStorage.getItem("token");
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/createbanner`,
          formData,
          {
            headers: { Authorization: `${token}` },
            "Content-Type": "multipart/form-data",
          }
        );
        getBannerData();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Details updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.log("error ------------------------------ ", error);
      }
    // } else {
    //   console.log("else ------------------------------ ");
    // }
  };

  const fileToDataUri = (image) => {
    return new Promise((res) => {
      const reader = new FileReader();
      const { type, name, size } = image;
      reader.addEventListener("load", () => {
        res(reader.result);
      });
      reader.readAsDataURL(image);
    });
  };

  const handleTopBannerChange = async (e) => {
    // const file = e.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const base64Data =
    //       e.target.result.split(",")[1];
    setFileTopBuffer(e.target.files[0]);
    //   };
    //   reader.readAsDataURL(file);
    // }
    // const newTopImagesPromises = []
    // for (let i = 0; i < e.target.files.length; i++) {
    //   newTopImagesPromises.push(fileToDataUri(e.target.files[i]))
    // }
    // const newTopImages = await Promise.all(newTopImagesPromises)
    // setFileTopBuffer(await fileToDataUri(e.target.files[0]));
    // console.log("newTopImages",newTopImages)
  };

  const handleBottomBannerChange = async (e) => {
    // const file = e.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const base64Data =
    //       e.target.result.split(",")[1];
    setFileBottomBuffer(e.target.files[0]);
    // };
    // reader.readAsDataURL(file);
    // }
    // const newBottomImagesPromises = []
    // for (let i = 0; i < e.target.files.length; i++) {
    //   newBottomImagesPromises.push(fileToDataUri(e.target.files[i]))
    // }
    // const newBottomImages = await Promise.all(newBottomImagesPromises)

    // setFileBottomBuffer(await fileToDataUri(e.target.files[0]));
  };

  return (
    <>
      <div className="container">
        <h2>App Banners</h2>
        <hr></hr>
        {isLoadingData ? (
          <Formik
            initialValues={myNewData}
            validationSchema={SigninNewSchema}
            onSubmit={(values) => {
              createBanner(values);
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
                {console.log(errors)}
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="body">
                      <Form.Label>Offer Text</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Offer Text here"
                        name="offer"
                        value={values.offer}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.offer && touched.offer && errors.offer}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="emal">
                      <Form.Label>Top Banner</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Upload banner"
                        name="upperbanner"
                        multiple={true}
                        onChange={(event) => {
                          handleTopBannerChange(event);
                        }}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.upperbanner &&
                        touched.upperbanner &&
                        errors.upperbanner}
                    </div>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="emal">
                      <Form.Label>Top URL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Top URL"
                        name="upperbanner_url"
                        value={values.upperbanner_url}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <div className="mt-3">
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                  </div>
                  <div className="row">
                    {upperBanners?.map((img, imgIndex) => (
                      <div className="col-md-6">
                        <img
                          src={`${
                            "https://api.sushrutalgs.in/getImage/" +
                            img.upperbanner_img.split("/")[
                              img.upperbanner_img.split("/").length - 1
                            ]
                          }`}
                          alt={`Top Banner ${imgIndex + 1}`}
                          className="explanation-image"
                          style={{ width: 500, marginTop: 10 }}
                        />
                        <span
                          style={{
                            marginLeft: 10,
                          }}
                        >
                          {img.upperbanner_url}
                        </span>
                        <FontAwesomeIcon
                          className="mx-3"
                          icon={faTrash}
                          onClick={() => handleDelete(img._id)}
                        />
                      </div>
                    ))}
                  </div>
                </Row>

                <Row>
                  <Col md={12} className="mb-3 mt-5">
                    <Form.Group id="emal">
                      <Form.Label>Bottom Banner</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Upload banner"
                        name="lowerbanner"
                        multiple={true}
                        onChange={(event) => {
                          handleBottomBannerChange(event);
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="emal">
                      <Form.Label>Bottom URL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Bottom URL"
                        name="lowerbanner_url"
                        value={values.lowerbanner_url}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <div className="mt-3">
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                  </div>
                  <div className="row">
                    {bottomBanners?.map((img, imgIndex) => {
                      return (
                        <div className="col-md-6">
                          <img
                            src={`${
                              "https://api.sushrutalgs.in/getImage/" +
                              img.lowerbanner_img.split("/")[
                                img.lowerbanner_img.split("/").length - 1
                              ]
                            }`}
                            alt={`Bottom Banner ${imgIndex + 1}`}
                            className="explanation-image"
                            style={{ width: 500, marginTop: 10 }}
                          />
                          <span
                            style={{
                              marginLeft: 10,
                            }}
                          >
                            {img.lowerbanner_url}
                          </span>
                          <FontAwesomeIcon
                            className="mx-3"
                            icon={faTrash}
                            onClick={() => handleDelete(img._id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </Row>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="loader-container">
          <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
          </div>
        )}
      </div>
    </>
  );
};

// export default Notification;
