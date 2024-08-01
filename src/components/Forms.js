import React, { useState, useEffect, useMemo } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";
import "react-time-picker/dist/TimePicker.css";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { MDBDataTable } from "mdbreact";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import DownloadExcelButton from "../pages/downloadExel";
import { MaterialReactTable } from "material-react-table";

import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";
import { Image } from '@themesberg/react-bootstrap';
export const GeneralInfoForm = () => {
  const [birthday, setBirthday] = useState("");
  const [showMarksDeducted, setShowMarksDeducted] = useState(false);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [Editopen, setEditOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => setEditOpen(false);

  const [time, setTime] = useState("00:00:00");
  const [myData, setMyData] = useState({
    category_name: "",
    description: "",
    // exam_name: "",
    // marks_awarded: "",
    // marks_deducted: "",
    // time_duration: "",
    // negative_marking: false,
  });
  const [isError, setIsError] = useState("");
  const [jsonData, setJsonData] = useState([]);
  const [editData, setEditData] = useState({});
  const [showMarksDeductedField, setShowMarksDeductedField] = useState(false);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const history = useHistory();

  const navigateDetails = (userId) => {
    history.push(`/subcategory?id=${userId}`);
  };

  const getMyPostData = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/category/create`,
        { ...values, time_duration: time },
        {
          headers: { Authorization: `${token}` },
        }
      );
      // setMyData(res.data);
      onCloseModal();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Category has been Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyCategoryData();
      // setMyData("");
    } catch (error) {
      setIsError(error.response.data.err.message);
    }
  };

  const SigninSchema = Yup.object().shape({
    category_name: Yup.string().required("Category name is Required"),
    description: Yup.string().required("description is Required"),
    // marks_awarded: Yup.string().required("Marks Awarded is Required"),
    // exam_name: Yup.string().required("exam name is Required"),
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "category_name",
        header: "Category name",
      },
      {
        accessorKey: "description",
        header: "Description",
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
        label: "category name",
        field: "category_name",
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

  const getMyCategoryData = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingData(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Category/getAll`,
        {
          headers: { Authorization: token },
        }
      );

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          category_name: item.category_name,
          description: item.description,
          _id: item._id,
          actions: (
            <div>
              <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(item)} />

              <FontAwesomeIcon
                className="mx-3"
                icon={faTrash}
                onClick={() => handleDelete(item._id)}
              />

             
               <button onClick={() => navigateDetails(item._id)}><FontAwesomeIcon
                icon={faEye}
              /> View Subcatagories</button>
            </div>
          ),
        };
      });
      setJsonData(data);
      setIsLoadingData(false);
      // setDatatable((prevState) => ({
      //   ...prevState,
      //   rows: data,
      // }));
    } catch (error) {
      setIsError(error.response);
      setIsLoadingData(false);
    }
  };

  // const getMyCategoryData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/api/Category/getAll`,
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     // setMyCategoryData(res.data);
  //     setMyCategoryData(
  //       res.data.map((i, index) => ({ ...i, recordNo: index + 1 }))
  //     );
  //     setPagination(calculateRange(res.data, PAGE_SIZE));
  //   } catch (error) {
  //     setIsError(error.response);
  //   }
  // };

  const handleEdit = (data) => {
    setEditData(data); // Set the data of the selected row
    setEditOpen(true); // Open the modal
  };

  const updateSubcategory = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/updateCategory/${id}`,
        updatedData,
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
        title: " Category Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getMyCategoryData();
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
            `${process.env.REACT_APP_BASE_URL}/api/deleteCategory/${id}`,
            {
              headers: { Authorization: token },
            }
          );
          console.log(res.data); // Log the response or handle it as required.
          // Optionally, you can refresh the subcategory data after successful deletion.
          // getMySubCategoryData();
          // Show a success message using SweetAlert
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          getMyCategoryData();
        } catch (error) {
          console.error(error.response); // Handle error responses
          // Show an error message using SweetAlert
          Swal.fire("Error", "Failed to delete the Category.", "error");
        }
      }
    });
  };

  const EditSchema = Yup.object().shape({
    category_name: Yup.string().required("Category name is Required"),
    description: Yup.string().required("description is Required"),
  });

  useEffect(() => {
    getMyCategoryData();
  }, []);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Category</h5>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <button className="btn btn-primary" onClick={onOpenModal}>
            Add Category
            <FontAwesomeIcon icon={faPlus} className="mx-2" />
          </button>
          <DownloadExcelButton jsonData={jsonData} fileName="Category" />
        </div>
        <Modal open={open} onClose={onCloseModal} center>
          <h2>Add Category</h2>
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
            }) => (
              <Form>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="firstName">
                      <Form.Label>Category Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        name="category_name"
                        value={values.category_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.category_name &&
                        touched.category_name &&
                        errors.category_name}
                    </div>
                  </Col>
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
                        <Form.Label>Nagitive Marks Deducted</Form.Label>
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

                <div className="mt-3 flex">
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
              <th scope="col">Category Name</th>
              <th scope="col">description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {categoryData
              .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
              .map((item, index) => (
                <tr>
                  <th scope="row">{item.recordNo}</th>
                  <td>{item.category_name}</td>
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
          <h2>Edit Category</h2>
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
              /* and other goodies */
            }) => (
              <Form>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="firstName">
                      <Form.Label>Category Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        name="category_name"
                        value={values.category_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.category_name &&
                        touched.category_name &&
                        errors.category_name}
                    </div>
                  </Col>
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
                  </Row> */}
                {/* <Row className="align-items-center">
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
                  console.log("new jsonData",jsonData)
                  let position_data = {
                    "category_id": [],
                    "position":[]
                  }
                  jsonData.forEach((element, index) => {
                    position_data.category_id.push(element._id)
                    position_data.position.push(index+1)
                  });
                  
                  var newtoken = localStorage.getItem("token");
                  
                  let config = {
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: 'https://api.sushrutalgs.in/api/updateCategoryPosition',
                    headers: { 
                     'Authorization': newtoken, 
                      'Content-Type': 'application/json'
                    },
                    data : position_data
                  };
                  
                  axios.request(config)
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
