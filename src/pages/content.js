
import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
} from "@themesberg/react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import DownloadExcelButton from "./downloadExel";
import { MDBDataTable } from "mdbreact";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from '@themesberg/react-bootstrap';

export const Content = () => {
  const [filteredPDF, setFilteredPdf] = useState([]);
  const [isError, setIsError] = useState("");
  const [value, setValue] = useState("1");
  const [SubscriptionData, setMySubscriptionData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [editData, setEditData] = useState({});
  const [categoryData, setMyCategoryData] = useState([]);
  const [subcategoryData, setMysubCategoryData] = useState([]);
  const [fileBuffer, setFileBuffer] = useState(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setFileBuffer(null);
    setOpen(false);
  };

  const [openVideo, setOpenVideo] = useState(false);
  const onOpenVideoModal = () => setOpenVideo(true);
  const onCloseVideoModal = () => setOpenVideo(false);

  const [Editopen, setEditOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => setEditOpen(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [jsonData, setJsonData] = useState([]);

  const [myData, setMyData] = useState({
    title: '',
    content_id: "",
    content_type: [],
    content_url: "",
    topic_id: "",
    video_url: "",
    isfeatured: false,
    Banner_img: "",
    subscription_id: []
  });

  

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileBuffer(selectedFile);
  };

  const contentChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "No",
        field: "id",
        width: 270,
      },
      {
        label: "Title",
        field: "title",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Category",
        field: "category_name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Subcategory",
        field: "subcategory_name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Topic",
        field: "name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Linked PDF Title",
        field: "pdf_title",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Vimeo ID",
        field: "url",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Link",
        },
      },
      {
        label: "Action",
        field: "actions",
        width: 100,
      },
    ],
  });

  const [pdfdatatable, setpdfDatatable] = useState({
    columns: [
      {
        label: "No",
        field: "id",
        width: 270,
      },
      {
        label: "Title",
        field: "title",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Category",
        field: "category_name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Subcategory",
        field: "subcategory_name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Topic",
        field: "name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Action",
        field: "actions",
        width: 100,
      },
    ],
  });

  const getMyContentData = async (tabId) => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true)
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Content/V2/getAllByvideoV2`,
        {
          headers: { Authorization: token },
        }
      );
      const data = res.data?.map((item, index) => {
        return {
          ...item,
          id: index + 1,
          name: item.topic_name,
          url: item.video_url,
          plan_name:
            item.plan_name.length > 1
              ? item.plan_name.map((plan, planIndex) => (
                <div key={planIndex}>{`${planIndex + 1}. ${plan}`}</div>
              ))
              : item.plan_name[0],

          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEdit}
                className="mx-3"
                onClick={() => handleEdit(item, tabId)}
              />

              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
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

  const getMyPdfData = async (tabId) => {

    const token = localStorage.getItem("token");
    setIsLoadingData(true)
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Content/getAllByPdf`,
        {
          headers: { Authorization: token },
        }
      );
      const data = res.data?.map((item, index) => {
        return {
          ...item,
          id: index + 1,
          name: item.topic_name,
          plan_name:
            item.plan_name.length > 1
              ? item.plan_name.map((plan, planIndex) => (
                <div key={planIndex}>{`${planIndex + 1}. ${plan}`}</div>
              ))
              : item.plan_name[0],

          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEdit}
                className="mx-3"
                onClick={() => handleEdit(item, tabId)}
              />

              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });
      setJsonData(res.data);

      setpdfDatatable((prevState) => ({
        ...prevState,
        rows: data,
      }));
      setIsLoadingData(false)
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };

  const createContent = async (values) => {
    // const base64String = Buffer.from(fileBuffer).toString("base64");
    const token = localStorage.getItem("token");
    if (values?.video_url) {
      if (values?.video_url.includes("http")) {
        let newVal = values?.video_url.split("/");
        values.video_url = newVal[newVal.length - 1];
      }
      // values.content_type = "video";
    }
    const formData = new FormData();
    const videoFormData = new FormData();
    var video_data = {
      topic_id: values.topic_id,
      content_type: "video",
      video_url: values.video_url,
      isfeatured: values.isfeatured,
      Banner_img: values.Banner_img,
      subscription_id: JSON.stringify(values.subscription_id)
    }
    const category_id = topicsData.filter(i => i._id === values.topic_id)[0].category_id;
    const subcategory_id = topicsData.filter(i => i._id === values.topic_id)[0].subcategory_id;
    if (fileBuffer) {
      formData.append("file", fileBuffer);
      formData.append("content_type", "PDF");
      formData.append("isfeatured", values.isfeaturedpdf || false);
    }
    if (values.video_url) {
      videoFormData.append("content_type", "video");
      videoFormData.append("isfeatured", values.isfeatured || false);
      videoFormData.append("video_url", values.video_url);
    }
    if (values.Banner_img) {
      videoFormData.append("Banner_img", values.Banner_img);
    }
    formData.append("topic_id", values.topic_id);
    formData.append("category_id", category_id);
    formData.append("subcategory_id", subcategory_id);
    formData.append("title", values.title);
    videoFormData.append("topic_id", values.topic_id);
    videoFormData.append("category_id", category_id);
    videoFormData.append("subcategory_id", subcategory_id);
    videoFormData.append("pdf_id", values.pdf_id);
    videoFormData.append("title", values.title);
    formData.append(
      "subscription_id",
      JSON.stringify(values.subscription_id)
    );
    videoFormData.append(
      "subscription_id",
      JSON.stringify(values.subscription_id)
    );


    const selectedTopic = topicsData.find(
      (item) => item._id === values.topic_id
    );
    if (selectedTopic) {
      formData.append("content_id", selectedTopic.topic_name);
      video_data.content_id = selectedTopic.topic_name;
      videoFormData.append("content_id", selectedTopic.topic_name);
    }
    console.log("videoFormData -------- ", videoFormData);
    try {
      if (fileBuffer) {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v2/createContent`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": fileBuffer ? "multipart/form-data" : undefined,
            },
          }
        );
      }
      if (values.video_url) {
        const res2 = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v2/createContent`,
          videoFormData,
          {
            headers: {
              Authorization: `${token}`
            },
          }
        );
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Content has been Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setFileBuffer(null);
      getMyContentData();
      getMyPdfData();
      onCloseModal();
      onCloseVideoModal();
      getMyTopicData();
    } catch (error) {
      setIsError(error);
    }
  };

  const getMyTopicData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Topic/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      var newdata = [];
      res.data.forEach((element) => {
        if (element.content_type && element.content_type.length === 0) {
          element.hasVideo = false;
          element.hasNote = false;
          newdata.push(element);
        } else {
          if (
            element.content_type &&
            element.content_type.includes("PDF") &&
            element.content_type.includes("video")
          ) {
            element.hasVideo = true;
            element.hasNote = true;
            newdata.push(element);
          } else if (
            element.content_type &&
            element.content_type.includes("PDF")
          ) {
            element.hasVideo = false;
            element.hasNote = true;
            newdata.push(element);
          } else if (
            element.content_type &&
            element.content_type.includes("video")
          ) {
            element.hasVideo = true;
            element.hasNote = false;
            newdata.push(element);
          }
        }
      });
      setTopicsData(newdata);
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

  const handleEdit = (data, item) => {
    setEditData({ ...data }); // Set the data of the selected row
    setEditOpen(true); // Open the modal
  };

  useEffect(() => {
    getMySubscriptionData();
    getMyTopicData();
    getMyContentData();
    getMyCategoryData();
    getMySubCategoryData();
  }, []);

  const SigninSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    subscription_id: Yup.array()
      .of(Yup.string().required("subscription is required"))
      .min(1, "Select at least one subscription"),
    topic_id: Yup.string().required("Topic ID is required"),
  });

  const EditSchema = Yup.object().shape({
    // content_id: Yup.string().required("Category name is Required"),
    // content_type: Yup.string().required("content_type is Required"),
    category_id: Yup.string().required("Please select Category"),
    subscription_id: Yup.string().required("Please select subscription"),
  });

  const updateContent = async (id, updatedData) => {
    try {
      const formData = new FormData();
      if (fileBuffer) {
        // Append the file to the FormData object with a field name "file"
        formData.append("file", fileBuffer);

      }
      const category_id = topicsData.filter(i => i._id === updatedData.topic_id)[0].category_id;
      const subcategory_id = topicsData.filter(i => i._id === updatedData.topic_id)[0].subcategory_id;
      if (updatedData.video_url) {
        formData.append("video_url", updatedData.video_url);
      }
      if (updatedData.Banner_img) {
        formData.append("Banner_img", updatedData.Banner_img);
      }
      formData.append("topic_id", updatedData.topic_id);
      formData.append("category_id", category_id);
      formData.append("subcategory_id", subcategory_id);
      formData.append("content_type", updatedData.content_type);
      formData.append("isfeatured", updatedData.isfeatured);
      formData.append(
        "subscription_id",
        JSON.stringify(updatedData.subscription_id)
      );
      formData.append("topic_id", updatedData.topic_id);
      formData.append("title", updatedData.title);
      if(updatedData.pdf_id) {
        formData.append("pdf_id", updatedData.pdf_id);
      }
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/v2/updateContentdata/${updatedData._id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );


      // console.log(res.data); // Log the response or handle it as required.
      // Optionally, you can refetch the subcategory data after successful update.
      getMySubscriptionData();
      onEditCloseModal(); // Close the modal after successful update.
      Swal.fire({
        position: "center",
        icon: "success",
        title: " Content Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyContentData();
      getMyPdfData();
      setFileBuffer(null);
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
            `${process.env.REACT_APP_BASE_URL}/api/deleteContent/${id}`,
            {
              headers: { Authorization: token },
            }
          );
          console.log(res.data); // Log the response or handle it as required.
          // Optionally, you can refresh the subcategory data after successful deletion.
          // getMySubscriptionData();
          // Show a success message using SweetAlert
          Swal.fire("Deleted!", "Your Content has been deleted.", "success");

          setFileBuffer(null)
          getMyContentData();
          getMyPdfData();
          getMyTopicData();
        } catch (error) {
          console.error(error.response); // Handle error responses
          // Show an error message using SweetAlert
          Swal.fire("Error", "Failed to delete the file.", "error");
        }
      }
    });
  };

  const tabListStyles = {
    display: "flex",
    justifyContent: "center",
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "5px",
  };

  const tabStyles = {
    fontSize: "18px",
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: "10px 20px",
    margin: "0 5px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#333",
    background: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background 0.3s ease-in-out",
  };

  const activeTabStyles = {
    background: "#007bff", // Change this to the desired background color for the active tab
    color: "#fff", // Change this to the desired text color for the active tab
  };

  const handleChange = (event, newValue) => {
    if (newValue === "2") {
      getMyPdfData(newValue);
    } else {
      getMyContentData(newValue);
    }
    setValue(newValue);
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

  console.log("topicsData ------- ", topicsData);

  const handleCategoryChange = (categoryId) => {

    setFilteredSubcategories(subcategoryData.filter(
      (subcategory) => subcategory.category_id === categoryId
    ));
  };

  const handleSubcategoryChange = (subcategoryId) => {
    console.log("subcategoryId ------- ", subcategoryId);

    setFilteredTopics(topicsData.filter(
      (subcategory) => subcategory.subcategory_id === subcategoryId
    ));
  };

  const getPdfByTopic = async (topicId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getPdfByTopicId/${topicId}`,
        {
          headers: { Authorization: token },
        }
      );
      setFilteredPdf(res.data);
    } catch (error) {
      setIsError(error.response);
    }
  }
  console.log("filtered pfg  ------------ ", filteredPDF);
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Content</h5>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="">
            <button className="btn btn-primary " onClick={onOpenModal}>
              Add PDF
              <FontAwesomeIcon icon={faPlus} className="mx-2" />
            </button>
            <button className="btn btn-primary" style={{ marginLeft: 5 }} onClick={onOpenVideoModal}>
              Add Video
              <FontAwesomeIcon icon={faPlus} className="mx-2" />
            </button>
          </div>
          <DownloadExcelButton jsonData={jsonData} fileName="Content" />
        </div>
        <Modal open={open} onClose={onCloseModal} center>
          <h2>Add PDF</h2>
          <Formik
            initialValues={myData}
            validationSchema={SigninSchema}
            onSubmit={(values) => {
              createContent(values);
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
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter title"
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
                        {categoryData.map((item, index) =>
                          <option value={item._id} key={item._id}>
                            {item.category_name}
                          </option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
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
                        {filteredSubcategories.map((subcategory, index) =>
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.subcategory_name}
                          </option>
                        )}
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
                        {filteredTopics.map((item, index) =>
                        (
                          <option value={item._id}>
                            {item.topic_name}
                            {/* {item.hasVideo ? null : "| ▶️ Video missing"}{" "}
                              {item.hasNote ? null : "| 🗒️ PDF missing"} */}
                          </option>)

                        )}
                      </Form.Select>
                    </Form.Group>
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
                </Row>


                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="emal">
                      <Form.Label>Select Pdf</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Content url"
                        name="content_url"
                        onChange={(event) => {
                          handleFileChange(event);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row md={12}>
                  <Col>
                    <div class="form-check mb-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        checked={values.isfeaturedpdf}
                        id="flexCheckDefault"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("isfeaturedpdf", e.target.checked);
                        }}
                      />
                      <label class="form-check-label" for="flexCheckDefault">
                        Add this PDF to Feature list
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
          <h2>Edit Content</h2>
          <Formik
            initialValues={editData}
            validationSchema={SigninSchema}
            onSubmit={(values) => {
              if (values.content_type === "PDF") {
                updateContent(editData._id, values);
              } else if (values.content_type === "video") {
                updateContent(editData._id, values);
              }// Pass the ID and updated data to updateContent
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
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter title"
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
                    <Form.Group id="gender">
                      <Form.Label>Select Category</Form.Label>
                      <Form.Select
                        name="category_id"
                        value={values.category_id}
                        disabled={true}
                      >
                        <option>Select Category</option>
                        {categoryData.map((item, index) =>
                          <option value={item._id} key={item._id}>
                            {item.category_name}
                          </option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Subcategory</Form.Label>
                      <Form.Select
                        name="subcategory_id"
                        value={values.subcategory_id}
                        disabled={true}
                      >
                        <option>Select Subcategory</option>
                        {subcategoryData.map((subcategory, index) =>
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.subcategory_name}
                          </option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Topic</Form.Label>
                      <Form.Select
                        disabled={true}
                        name="topic_id"
                        value={values.topic_id}
                      // onChange={handleChange}
                      >
                        <option>Select Topic</option>
                        {topicsData.map((item, index) => (
                          <option value={item._id}>{item.topic_name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
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
                </Row>
                <Row></Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="lastName">
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        disabled={true}
                        name="content_type"
                        value={values.content_type}
                        onChange={handleChange}
                      >
                        <option>Select Content Type</option>
                        <option value="video">Video</option>
                        <option value="PDF">Pdf </option>
                      </Form.Select>
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.content_type &&
                        touched.content_type &&
                        errors.content_type}
                    </div>
                  </Col>
                </Row>
                <Row>
                  {value === "2" && (
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group id="emal">
                          <Form.Label>Select Pdf</Form.Label>
                          <Form.Control
                            type="file"
                            placeholder="Content url"
                            name="content_url"
                            onChange={(event) => {
                              handleFileChange(event);
                            }}
                          />
                          {values.content_url?.split("-")[1]}
                        </Form.Group>
                        <div className="mb-3 text-danger">
                          {/* {!fileBuffer && "Please select file"} */}
                        </div>
                      </Col>
                    </Row>
                  )}

                  {value === "1" && (
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group id="emal">
                          <Form.Label>Video url</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Video url"
                            name="video_url"
                            value={values.video_url}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
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
                        Add To Featur list
                      </label>
                    </div>
                  </Col>
                </Row>
                {values.content_type === "video" &&
                  values.isfeatured === true && (
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group id="emal">
                          <Form.Label>Banner Image</Form.Label>
                          <Form.Control
                            type="file"
                            name="Banner_img"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const base64Data =
                                    e.target.result.split(",")[1];
                                  setFieldValue("Banner_img", base64Data);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                      {
                        values.Banner_img && (
                          <img
                            src={`data:image/png;base64,${values.Banner_img}`}
                            className="question-image"
                          />
                        )
                      }
                    </Row>
                  )}

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

        <Modal open={openVideo} onClose={onCloseVideoModal} center>
          <h2>Add Video</h2>
          <Formik
            initialValues={myData}
            validationSchema={SigninSchema}
            onSubmit={(values) => {
              createContent(values);
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
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter title"
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
                        {categoryData.map((item, index) =>
                          <option value={item._id} key={item._id}>
                            {item.category_name}
                          </option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
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
                        {filteredSubcategories.map((subcategory, index) =>
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.subcategory_name}
                          </option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Topic</Form.Label>
                      <Form.Select
                        name="topic_id"
                        value={values.topic_id}
                        onChange={(e) => {
                          getPdfByTopic(e.target.value);
                          handleChange(e);
                        }}
                      >
                        <option>Select Topic</option>
                        {filteredTopics.map((item, index) =>
                        (
                          <option value={item._id}>
                            {item.topic_name}
                            {/* {" "}
                              {item.hasVideo ? null : "| ▶️ Video missing"}{" "}
                              {item.hasNote ? null : "| 🗒️ PDF missing"} */}
                          </option>
                        )
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select PDF</Form.Label>
                      <Form.Select
                        name="pdf_id"
                        value={values.pdf_id}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        <option>Select PDF</option>
                        {filteredPDF.map((item, index) =>
                        (
                          <option value={item._id}>
                            {item.title}
                            {/* {" "}
                              {item.hasVideo ? null : "| ▶️ Video missing"}{" "}
                              {item.hasNote ? null : "| 🗒️ PDF missing"} */}
                          </option>
                        )
                        )}
                      </Form.Select>
                    </Form.Group>
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
                </Row>
                <Row>
                  {/* {selectedOption === "video" && ( */}
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group id="emal">
                        <Form.Label>Vimeo video URL</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="https://vimeo.com/317784003"
                          name="video_url"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* )} */}
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
                        Add this video to Feature list
                      </label>
                    </div>
                  </Col>
                </Row>

                {values.isfeatured === true && (
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group id="emal">
                        <Form.Label>Banner Image</Form.Label>
                        <Form.Control
                          type="file"
                          name="Banner_img"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                const base64Data =
                                  e.target.result.split(",")[1];
                                setFieldValue("Banner_img", base64Data);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

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
        {/* <MDBDataTable striped bordered small data={datatable} /> */}
        <TabContext value={value}>
          <TabList style={tabListStyles} onChange={handleChange}>
            <Tab
              style={
                value === "1" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="Video"
              value="1"
            />
            <Tab
              style={
                value === "2" ? { ...tabStyles, ...activeTabStyles } : tabStyles
              }
              label="PDF"
              value="2"
            />
          </TabList>
          <TabPanel value="1">
          <div>
          {isLoadingData ? (
            <div className="loader-container">
          <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
          </div>
          ) : (
            <MDBDataTable striped bordered small data={datatable} />
          )}
        </div>            
          </TabPanel>
          <TabPanel value="2">
          <div>
          {isLoadingData ? (
            <div className="loader-container">
          <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
          </div>
          ) : (
            <MDBDataTable striped bordered small data={pdfdatatable} />
          )}
        </div>             
          </TabPanel>
        </TabContext>
      </Card.Body>
    </Card>
  );
};

