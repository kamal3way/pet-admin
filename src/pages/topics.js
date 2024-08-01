import React, { useState, useEffect, useMemo } from "react";
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
import DownloadExcelButton from "./downloadExel";
import { MDBDataTable } from "mdbreact";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { MaterialReactTable } from "material-react-table";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from '@themesberg/react-bootstrap';
export const Topics = () => {
  const [birthday, setBirthday] = useState("");
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [Editopen, setEditOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => setEditOpen(false);

  const [showMarksDeducted, setShowMarksDeducted] = useState(false);
  // const [time, setTime] = useState("00:00:00");
  const [jsonData, setJsonData] = useState([]);

  const [myData, setMyData] = useState({
    topic_name: "",
    description: "",
    subcategory_id: "",
    category_id: "",
    content_type: "",
    content_url: "",
    topic_id: "",
    video_url: "",
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isError, setIsError] = useState("");
  const [categoryData, setMyCategoryData] = useState([]);
  const [subcategoryData, setMysubCategoryData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [editData, setEditData] = useState({});
  const [showMarksDeductedField, setShowMarksDeductedField] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [SubscriptionData, setMySubscriptionData] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const columns = useMemo(
    () => [
      {
        accessorKey: "topic_name",
        header: "Topic name",
      },
      {
        accessorKey: "category_name",
        header: "Category name",
      },
      {
        accessorKey: "subcategory_name",
        header: "Subcategory name",
      },
      {
        accessorKey: "actions",
        header: "actions",
      },
    ],
    []
    //end
  );

  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "No",
        field: "id",
        width: 270,
      },
      {
        label: "topic name",
        field: "topic_name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "category name",
        field: "category_name",
        width: 100,
      },
      {
        label: "subcategory name",
        field: "subcategory_name",
        width: 100,
      },
      {
        label: "description",
        field: "description",
        width: 100,
      },
      {
        label: "Action",
        field: "actions",
        width: 100,
      },
    ],
  });

  const getMyTopicsData = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        id
          ? `${process.env.REACT_APP_BASE_URL}/api/getTopicBySubcategory/${id}`
          : `${process.env.REACT_APP_BASE_URL}/api/Topic/getAll`,
        {
          headers: { Authorization: token },
        }
      );

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          topic_name: item.topic_name,
          category_name: item.category_name,
          subcategory_name: item.subcategory_name,
          description: item.description,
          _id: item._id,
          actions: (
            <div>
              <FontAwesomeIcon
                icon={faEdit}
                className="mx-3"
                onClick={() => handleEdit(item)}
              />

              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          ),
        };
      });
      // setJsonData(res.data);
      // console.log("jsonData",jsonData)

      setJsonData(data);
      setIsLoadingData(false);
    } catch (error) {
      setIsError(error.response);   
       setIsLoadingData(false);
    }
  };

  const getMyPostData = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Topic/create`,
        values,
        {
          headers: { Authorization: `${token}` },
        }
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Topic has been Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyTopicsData();
      onCloseModal();
      setMyData({
        topic_name: "",
        description: "",
        subcategory_id: "",
        category_id: "",
        content_type: "",
        content_url: "",
        topic_id: "",
        video_url: "",
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
      console.log(res.data, "sub category");
    } catch (error) {
      setIsError(error.response);
    }
  };

  // const getMyTopicsData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/api/Topic/getAll`,
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     // setTopicsData(res.data);
  //     setTopicsData(
  //       res.data.map((i, index) => ({ ...i, recordNo: index + 1 }))
  //     );
  //     setPagination(calculateRange(res.data, PAGE_SIZE));
  //   } catch (error) {
  //     setIsError(error.response);
  //   }
  // };

  const getMySubCategoryData = async (values) => {
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

  const handleEdit = (data) => {
    setEditData(data); // Set the data of the selected row
    setEditOpen(true); // Open the modal
  };

  useEffect(() => {
    getMyCategoryData();
    getMySubCategoryData();
    getMyTopicsData();
    getMySubscriptionData();
  }, []);

  const SigninSchema = Yup.object().shape({
    topic_name: Yup.string().required("Topic name is Required"),
    description: Yup.string().required("description is Required"),
    category_id: Yup.string().required("Please Select Category"),
    subcategory_id: Yup.string().required("subcategory is Required"),
    // exam_name: Yup.string().required("exam name is Required"),
    // marks_awarded: Yup.string().required("Marks Awarded is Required"),
  });

  const EditSchema = Yup.object().shape({
    topic_name: Yup.string().required("Please Select Category"),
    description: Yup.string().required("description is Required"),
    category_id: Yup.string().required("Please select Category"),
    subcategory_id: Yup.string().required("Please select SubCategory"),
  });

  // const updateSubcategory = async (id, updatedData) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await axios.put(
  //       `${process.env.REACT_APP_BASE_URL}/api/updateTopic/${id}`,
  //       updatedData,
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     console.log(res.data); // Log the response or handle it as required.
  //     // Optionally, you can refetch the subcategory data after successful update.
  //     // getMySubCategoryData();
  //     onEditCloseModal(); // Close the modal after successful update.
  //     Swal.fire({
  //       position: "center",
  //       icon: "success",
  //       title: " Topic Updated Successfully",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     getMyTopicsData();
  //   } catch (error) {
  //     console.error(error.response); // Handle error responses
  //   }
  // };

  const updateSubcategory = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/updateTopic/updateContent/${id}`,
        {
          ...updatedData,
          topic_id: id,
        },
        {
          headers: { Authorization: token },
        }
      );
      console.log(res.data); // Log the response or handle it as required.
      // Optionally, you can refetch the subcategory data after successful update.
      // getMySubCategoryData();
      onEditCloseModal(); // Close the modal after successful update.
      Swal.fire({
        position: "center",
        icon: "success",
        title: " Topic Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyTopicsData();
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
            `${process.env.REACT_APP_BASE_URL}/api/deleteTopic/${id}`,
            {
              headers: { Authorization: token },
            }
          );
          console.log(res.data); // Log the response or handle it as required.
          // Optionally, you can refresh the subcategory data after successful deletion.
          // getMySubCategoryData();
          // Show a success message using SweetAlert
          Swal.fire("Deleted!", "Topic has been deleted.", "success");
          getMyTopicsData();
        } catch (error) {
          console.error(error.response); // Handle error responses
          // Show an error message using SweetAlert
          Swal.fire("Error", "Failed to delete the Topic.", "error");
        }
      }
    });
  };

  // Handle category selection change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };
  const [selectedOption, setSelectedOption] = useState("");

  const [fileBuffer, setFileBuffer] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileBuffer(selectedFile);
  };

  const contentChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Filter subcategory options based on selected category
  const filteredSubcategories = subcategoryData.filter(
    (subcategory) => subcategory.category_id === selectedCategoryId
  );

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Topics</h5>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <button className="btn btn-primary" onClick={onOpenModal}>
            Add Topics
            <FontAwesomeIcon icon={faPlus} className="mx-2" />
          </button>
          <DownloadExcelButton jsonData={jsonData} fileName="Topics" />
        </div>
        <Modal open={open} onClose={onCloseModal} center>
          <h2>Add Topics</h2>
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
                      <Form.Label>Topic Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Topic name"
                        name="topic_name"
                        value={values.topic_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.topic_name &&
                        touched.topic_name &&
                        errors.topic_name}
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
                        {categoryData.map((item, index) => (
                          <option value={item._id}>{item.category_name}</option>
                        ))}
                      </Form.Select>
                      <div className="mb-3 text-danger">
                        {errors.category_id &&
                          touched.category_id &&
                          errors.category_id}
                      </div>
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
                        onChange={handleChange}
                      >
                        <option>Select Subcategory</option>
                        {filteredSubcategories.map((subcategory) => (
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.subcategory_name}
                          </option>
                        ))}
                      </Form.Select>
                      <div className="mb-3 text-danger">
                        {errors.subcategory_id &&
                          touched.subcategory_id &&
                          errors.subcategory_id}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                {/* <Row>
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
                      {errors.exam_name &&
                        touched.exam_name &&
                        errors.exam_name}
                    </div>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="phone">
                      <Form.Label>Marks Awarded</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Marks Awarded Per Quation"
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
                          placeholder="Marks Deducted Per Quation"
                          name="marks_deducted"
                          value={values.marks_deducted}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )} */}
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="lastName">
                      <Form.Label>Description</Form.Label>

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
        {/* <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Topic Name</th>
              <th scope="col">Category Name</th>
              <th scope="col">Subcategory Name</th>
              <th scope="col">description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {topicsData
              .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
              .map((item, index) => (
                <tr>
                  <th scope="row">{item.recordNo}</th>
                  <td>{item.topic_name}</td>
                  <td>{item.category_name}</td>
                  <td>{item.subcategory_name}</td>
                  <td>{item.description}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="mx-3"
                      onClick={() => handleEdit(item)}
                    />

                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>

        </table> */}
        <Modal open={Editopen} onClose={onEditCloseModal} center>
          <h2>Edit Topics</h2>
          <Formik
            initialValues={editData}
            validationSchema={EditSchema}
            onSubmit={(values) => {
              updateSubcategory(editData._id, values); // Pass the ID and updated data to updateSubcategory
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
                      <Form.Label>Topic Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Topic name"
                        name="topic_name"
                        value={values.topic_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.topic_name &&
                        touched.topic_name &&
                        errors.topic_name}
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
                      <div className="mb-3 text-danger">
                        {errors.category_name &&
                          touched.category_name &&
                          errors.category_name}
                      </div>
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
                        onChange={handleChange}
                      >
                        <option>Select Subcategory</option>
                        {subcategoryData.map((item, index) => (
                          <option value={item._id}>
                            {item.subcategory_name}
                          </option>
                        ))}
                      </Form.Select>
                      <div className="mb-3 text-danger">
                        {errors.subcategory_id &&
                          touched.subcategory_id &&
                          errors.subcategory_id}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
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
                {editData.isContent === false && (
                  <>
                    {/* <Row>
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
                    </Row> */}
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group id="lastName">
                          <Form.Label>Type</Form.Label>
                          <Form.Select
                            name="content_type"
                            value={values.content_type}
                            onChange={(event) => {
                              contentChange(event);
                              handleChange(event);
                            }}
                          >
                            <option>Select Subcategory</option>
                            <option value="video">Video</option>
                            <option value="PDF">Note </option>
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
                      {selectedOption === "PDF" && (
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
                      )}

                      {selectedOption === "video" && (
                        <Row>
                          <Col md={12} className="mb-3">
                            <Form.Group id="emal">
                              <Form.Label>Video url</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Video url"
                                name="video_url"
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}
                    </Row>
                  </>
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
        {/* <MDBDataTable striped bordered small data={datatable} /> */}
        <div>
          {isLoadingData ? (
            <div className="loader-container">
          <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
          </div>
          ) : (
            <MaterialReactTable
          autoResetPageIndex={false}
          columns={columns}
          data={jsonData}
          enableRowOrdering
          enableSorting={false}
          muiTableBodyRowDragHandleProps={({ table }) => ({
            onDragEnd: () => {
              const { draggingRow, hoveredRow } = table.getState();
              if (hoveredRow && draggingRow) {
                jsonData.splice(
                  hoveredRow.index,
                  0,
                  jsonData.splice(draggingRow.index, 1)[0]
                );
                setJsonData([...jsonData]);
                console.log("new jsonData", jsonData);
                let position_data = {
                  topic_id: [],
                  position: [],
                };
                jsonData.forEach((element, index) => {
                  position_data.topic_id.push(element._id);
                  position_data.position.push(index + 1);
                });

                var newtoken = localStorage.getItem("token");

                let config = {
                  method: "put",
                  maxBodyLength: Infinity,
                  url: "https://api.sushrutalgs.in/api/updateTopicPosition",
                  headers: {
                    Authorization: newtoken,
                    "Content-Type": "application/json",
                  },
                  data: position_data,
                };

                axios
                  .request(config)
                  .then((response) => {
                    console.log(JSON.stringify(response.data));
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            },
          })}
        />
          )}
        </div>

       

        {/* <div className="pagination">
          <button
            className={`page-button ${currentPage === 1 ? "disabled" : ""}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>

          {pagination.map((page) => (
            <button
              key={page}
              className={`page-button ${
                page === currentPage ? "current-page" : ""
              }`}
              onClick={() => __handleChangePage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`page-button ${
              currentPage === pagination.length ? "disabled" : ""
            }`}
            onClick={handleNextPage}
            disabled={currentPage === pagination.length}
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div> */}
      </Card.Body>
    </Card>
  );
};
