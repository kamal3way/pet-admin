
import React, { useState, useEffect, useRef } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "@themesberg/react-bootstrap";

import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { MDBDataTable } from "mdbreact";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

export const UserDetails = () => {
  const [value, setValue] = useState("1");
  const [userExamDetails, setUserExamDetails] = useState([]);

  const [Editopen, setEditOpen] = useState(false);
  const [Addopen, setAddOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => setEditOpen(false);
  const onAddCloseModal = () => setAddOpen(false);
  const [isError, setIsError] = useState("");
  const [editData, setEditData] = useState({});
  const [SubscriptionData, setMySubscriptionData] = useState([]);
  const [DayData, setMyDayData] = useState([]);
  const [SubscriptionDataId, setMySubscriptionDataId] = useState([]);

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

  const getMySubscriptionDataId = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getbySubscription/` + id,
        {
          headers: { Authorization: token },
        }
      );
      // return res.data
      setMySubscriptionDataId(res.data.duration);
      setMyDayData(res.data.duration);
    } catch (error) {
      setIsError(error.response);
    }
  };

  const tableRef = useRef();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [addData, setAddData] = useState({
    subscription_id: "",
    user_id: id,
    day: 0,
    duration_id: "",
  });

  const getUserExamdata = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getReportbyUser/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      setUserExamDetails(res.data);
    } catch (error) {
      setIsError(error.response);
    }
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
    setValue(newValue);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Exam Name",
          "Category Name",
          "SubCategory Name",
          "Topic Name",
          "Attempt No",
          "Total Marks",
          "Mark's Obtained",
          "Rank",
          "Percentage",
        ],
      ],
      body: userExamDetails.map((user) => [
        user.examName,
        user.category_name,
        user.subcategory_name,
        user.topic_name,
        user.Attempt,
        user.totalMarks,
        user.mymark,
        user.userRank,
        user.percentage,
      ]),
      startY: 20,
    });
    doc.save("user-exam-details.pdf");
  };

  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "No",
        field: "id",
        width: 270,
      },
      {
        label: "Plane name",
        field: "plan_name",
        width: 100,
      },
      {
        label: "Start Date",
        field: "start_date",
        width: 100,
      },
      {
        label: "Expiration Date",
        field: "expiration_date",
        width: 100,
      },

      {
        label: "Action",
        field: "actions",
        width: 100,
      },
    ],
  });

  const getSubscription = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Order/getUserOrder/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      const data = res.data?.map((item, index) => {
        return {
          id: index + 1,
          fullname: item.name,
          plan_name: item.plan_name,
          start_date: formatDate(item.start_date),
          expiration_date: formatDate(item.expiration_date),
          amount: item.amount,

          actions: (
            <div>
              <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(item)} />
              <FontAwesomeIcon
                icon={faTrash}
                className="mx-3"
                onClick={() => handleDelete(item._id)}
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
      setIsError(error.response);
    }
  };

  const handleEdit = (data) => {
    let iajsbd = {
      ...data,
      start_date: new Date(data.start_date),
      expiration_date: new Date(data.expiration_date),
    };
    setEditData(iajsbd);
    setEditOpen(true);
    // Set the data of the selected row
  };

  const updateSubscription = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/updateOrder/${id}`,
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
        title: " user Subscription Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getSubscription();
    } catch (error) {
      console.error(error.response); // Handle error responses
    }
  };

  const updateOrderSubscription = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Order/createAdminOrder`,
        { ...updatedData, day: parseInt(updatedData.day) },
        {
          headers: { Authorization: token },
        }
      );
      console.log(res.data); // Log the response or handle it as required.
      // Optionally, you can refetch the subcategory data after successful update.
      // getMySubCategoryData();
      onAddCloseModal(); // Close the modal after successful update.
      Swal.fire({
        position: "center",
        icon: "success",
        title: " user Subscription Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      getSubscription();
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
            `${process.env.REACT_APP_BASE_URL}/api/deleteOrder/${id}`,
            {
              headers: { Authorization: token },
            }
          );
          console.log(res.data); // Log the response or handle it as required.
          // Optionally, you can refresh the subcategory data after successful deletion.
          // getMySubCategoryData();
          // Show a success message using SweetAlert
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          getSubscription();
        } catch (error) {
          console.error(error.response); // Handle error responses
          // Show an error message using SweetAlert
          Swal.fire("Error", "Failed to delete the Category.", "error");
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  const EditSchema = Yup.object().shape({
    name: Yup.string().required("Name is Require"),
    start_date: Yup.string().required("start date is Required"),
    expiration_date: Yup.string().required("expiry date is Required"),
  });

  const AddSchema = Yup.object().shape({
    subscription_id: Yup.string().required("Subscription is Require"),
    day: Yup.string().required("Day is Required"),
    duration_id: Yup.string().required("Duration is Required"),
  });

  useEffect(() => {
    getUserExamdata();
    getSubscription();
    getMySubscriptionData();
  }, []);

  const deviceType = [
    "androidMobile",
    "iosMobile",
    "androidTablet",
    "iosTablet",
    "web",
  ];

  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <TabContext value={value}>
            <TabList style={tabListStyles} onChange={handleChange}>
              <Tab
                style={
                  value === "1"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Subscription"
                value="1"
              />
              <Tab
                style={
                  value === "2"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Exam Details"
                value="2"
              />

              {/* <Tab
                style={
                  value === "3"
                    ? { ...tabStyles, ...activeTabStyles }
                    : tabStyles
                }
                label="Logout"
                value="3"
              /> */}
            </TabList>
            <TabPanel value="1">
              <Button
                className="btn btn-primary"
                onClick={() => {
                  setAddOpen(true);
                }}
              >
                Add subcription
              </Button>

              <MDBDataTable striped bordered small data={datatable} />
            </TabPanel>
            <TabPanel value="2">
              <div>
                {/* <h1>Data with PDF Table</h1> */}

                <Button className="btn btn-primary" onClick={generatePDF}>
                  Generate PDF
                </Button>
                <div>
                  <div>
                    <Table ref={tableRef}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Exam Name</TableCell>
                          <TableCell>Category Name</TableCell>
                          <TableCell>SubCategory Name</TableCell>
                          <TableCell>Topic Name</TableCell>
                          <TableCell>Attempt No</TableCell>
                          <TableCell>Total Marks</TableCell>
                          <TableCell>Mark's Obtained</TableCell>
                          <TableCell>Rank</TableCell>
                          <TableCell>Percentage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userExamDetails.map((user, index) => (
                          <TableRow key={index}>
                            <TableCell>{user.examName}</TableCell>
                            <TableCell>{user.category_name}</TableCell>
                            <TableCell>{user.subcategory_name}</TableCell>
                            <TableCell>{user.topic_name}</TableCell>
                            <TableCell>{user.Attempt}</TableCell>
                            <TableCell>{user.totalMarks}</TableCell>
                            <TableCell>{user.mymark}</TableCell>
                            <TableCell>{user.userRank}</TableCell>
                            <TableCell>{user.percentage}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div style={{ width: "100%" }}>
                {/* <h1>Data with PDF Table</h1> */}

                {/* <div> */}
                {/* <div> */}
                <label>Logout from :</label>
                <Select
                  name="logout"
                  options={deviceType.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={async (selectedOptions) => {
                    // setFieldValue(
                    //   "subscription_id",
                    //   selectedOptions.value
                    // );
                    // getMySubscriptionDataId(selectedOptions)
                    console.log("selectedOptions", selectedOptions.value);
                    try {
                      const token = localStorage.getItem("token");
                      const res = await axios.post(
                        `${process.env.REACT_APP_BASE_URL}/api/user/logOutUserByAdmin`,
                        {
                          "user_id":id,
                          "deviceType":selectedOptions.value
                      },
                        {
                          headers: { Authorization: token },
                        }
                      );
                      console.log(res.data); // Log the response or handle it as required.
                      // Optionally, you can refetch the subcategory data after successful update.
                      // getMySubCategoryData();
                      // onAddCloseModal(); // Close the modal after successful update.
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "User loggedout from "+selectedOptions.value+" Successfully",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                      // getSubscription();
                    } catch (error) {
                      console.error(error.response); // Handle error responses
                    }

                  }}
                />
                {/* </div> */}
                {/* </div> */}
              </div>
            </TabPanel>
          </TabContext>
        </Card.Body>
        <Modal open={Editopen} onClose={onEditCloseModal} center>
          <h2>Edit Subscription</h2>
          <Formik
            initialValues={editData}
            validationSchema={EditSchema}
            onSubmit={(values) => {
              updateSubscription(editData._id, values); // Pass the ID and updated data to updateSubscription
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
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your fullname"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.name && touched.name && errors.name}
                    </div>
                  </Col> */}
                  <Col md={12} className="mb-3 ">
                    {/* <Form.Group id="firstName"> */}
                    {/* <p>Start Date : <b>{(values.start_date).toString()}</b></p> */}
                    {/* <DatePicker
                      readOnly={true}
                        onChange={(date) => {
                          setFieldValue("start_date", date);
                        }}
                        selected={values.start_date}
                        //   formatValue={
                        //     (selectedDate) => formatDateObj(selectedDate) // Format the value for display
                        //   }
                      /> */}
                    {/* </Form.Group> */}

                    {/* <div className="mb-3 text-danger">
                      {errors.start_date &&
                        touched.start_date &&
                        errors.start_date}
                    </div> */}
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Label>expiration_date</Form.Label>
                    {/* <Form.Group id="lastName">
                      <Form.Control
                        type="text"
                        placeholder="expiration date"
                        name="expiration_date"
                        value={values.expiration_date}
                        onChange={handleChange}
                      />
                    </Form.Group> */}
                    <DatePicker
                      onChange={(date) => {
                        setFieldValue("expiration_date", date);
                      }}
                      selected={values.expiration_date}
                    />
                    <div className="mb-3 text-danger">
                      {errors.expiration_date &&
                        touched.expiration_date &&
                        errors.expiration_date}
                    </div>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    // type="submit"
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal open={Addopen} onClose={onAddCloseModal} center>
          <h2>Add Subscription</h2>
          <Formik
            initialValues={addData}
            validationSchema={AddSchema}
            onSubmit={(values) => {
              updateOrderSubscription(values); // Pass the ID and updated data to updateSubscription
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
                  <Col md={6} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Select Subscription Plan</Form.Label>
                      {/* <Select
                        name="subscription_id"
                        value={SubscriptionData.find((item) => item.sid === values.subscription_id)?.plan_name || values.subscription_id}
                        options={SubscriptionData.map((item) => ({
                          value: item.sid,
                          label: item.plan_name,
                        }))}
                        onChange={(selectedOptions) => {
                          setFieldValue(
                            "subscription_id",
                            selectedOptions.value
                          );
                          getMySubscriptionDataId(selectedOptions)
                        }}
                      /> */}

                      <Form.Select
                        name="subscription_id"
                        value={values.subscription_id}
                        // onChange={handleChange}
                        onChange={(selectedOptions) => {
                          // console.log(selectedOptions.target.value)
                          setFieldValue(
                            "subscription_id",
                            selectedOptions.target.value
                          );

                          getMySubscriptionDataId(selectedOptions.target.value);
                        }}
                      >
                        <option>Select Subscription</option>
                        {SubscriptionData.map((item, index) => (
                          <option value={item.sid}>{item.plan_name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group id="day">
                      <Form.Label>Days</Form.Label>
                      <Form.Select
                        name="day"
                        value={values.day}
                        // onChange={handleChange}
                        onChange={(selectedOptions) => {
                          setFieldValue("day", selectedOptions.target.value);
                          setFieldValue(
                            "duration_id",
                            DayData.filter(
                              (ele) => ele.day === selectedOptions.target.value
                            )[0]._id
                          );
                          setFieldValue(
                            "price",
                            DayData.filter(
                              (ele) => ele.day === selectedOptions.target.value
                            )[0].price
                          );
                          // getMySubscriptionDataId(selectedOptions.target.value)
                        }}
                      >
                        <option>Select Days</option>
                        {DayData.map((item, index) => (
                          <option value={item.day}>{item.day}</option>
                        ))}
                      </Form.Select>
                      {/* <Form.Control
                        type="number"
                        placeholder="Subscription days"
                        name="day"
                        value={values.day}
                        onChange={handleChange}
                      /> */}
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.day && touched.day && errors.day}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="gender">
                      {/* <Form.Label>Select Price</Form.Label> */}
                      {/* <Select
                        name="duration_id"
                        value={values.duration_id}
                        options={SubscriptionDataId.map((item) => ({
                          value: item._id,
                          label: item.price,
                        }))}
                        onChange={(selectedOptions) => {
                          setFieldValue(
                            "duration_id",
                            selectedOptions.value
                          );
                        }}
                      /> */}
                      <p>
                        Price : <b>{values.price}</b>
                      </p>
                      {/* <Form.Select
                        name="duration_id"
                        value={values.duration_id}
                        onChange={handleChange}
                      >
                        <option>Select Price</option>
                        {SubscriptionDataId.map((item, index) => (
                          <option value={item._id}>{item.price}</option>
                        ))}
                      </Form.Select> */}
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.duration_id &&
                        touched.duration_id &&
                        errors.duration_id}
                    </div>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    // type="submit"
                    onClick={handleSubmit}
                  >
                    Add
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      </Card>
    </>
  );
};

