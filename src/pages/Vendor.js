import React, { useState, useEffect } from "react";
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
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSignOutAlt, faTrash, faPlus, faClock, faEye, faCalendarAlt, faForward, faBackward } from "@fortawesome/free-solid-svg-icons";
import { MDBDataTable } from "mdbreact";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import DownloadExcelButton from "./downloadExel";
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons';

export const Vendor = () => {
  const [jsonData, setJsonData] = useState([]);
  const [Editopen, setEditOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => setEditOpen(false);
  const [userData, setUserData] = useState([]);
  const [time, setTime] = useState("00:00:00");
  const [expirationModal, setExpirationModal] = useState(false);
  const [myData, setMyData] = useState({
    uName: "",
    uEmail: "",
    uGender: "",
  });
  const [isError, setIsError] = useState("");

  const [editData, setEditData] = useState({});
  const [pagination, setPagination] = useState([]);


  const [datatable, setDatatable] = useState({
    columns: [
      { label: "name", field: "uName" },
      { label: "mobile", field: "uMobile" },
      // { label: "type", field: "uType" },
      { label: "gender", field: "uGender" },
      { label: "active", field: "active" },
      { label: "actions", field: "actions" },
    ],
  });

  const EditSchema = Yup.object().shape({
    uName: Yup.string().required("uName name is Required"),
    uMobile: Yup.string().required("uMobile is Required"),
    uType: Yup.string().required("uType is Required"),
    uGender: Yup.string().required("uGender is Required"),

  });
  const handleEdit = (data) => {
    setEditData(data);
    setEditOpen(true);
  };
  useEffect(() => {
    getUserList();
  }, []);
  const handleToggleActive = async (event, user) => {
    try {
      const token1 = localStorage.getItem("token1");
      const accessToken = localStorage.getItem("accessToken");
  
      const updatedData = { active: event.target.checked }; // Prepare updated data
  
      const res = await axios.put(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/users/update-by-id/${user._id}`,
        updatedData,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken
          }
        }
      );
  
      // If API call is successful, update the user's active status in the datatable
      if (res.status === 200) {
        getUserList(); // Refresh the user list to reflect the changes
        Swal.fire({
          position: "center",
          icon: "success",
          title: "User status updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update user status!"
      });
    }
  };
  


  const updateUser = async (id, updatedData) => {
    try {
      console.log("Updating user:", id);
      console.log("Updated data:", updatedData);
      const token1 = localStorage.getItem("token1");
      const accessToken = localStorage.getItem("accessToken");
      if (Object.keys(updatedData).length === 0) {
        throw new Error("Please provide data to update.");
      }

      const res = await axios.put(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/users/update-by-id/${id}`,
        updatedData,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken
          }
        }
      );

      console.log("Update response:", res.data);

      getUserList();
      onEditCloseModal();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Vendor Updated Successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error.response);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
      });
    }
  };
  const getUserList = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/users?find={"uType":"VENDOR"}`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken
          },
        }
      );
      console.log(res.data);
      const data = res.data?.data?.map((item, index) => {
        return {
          uName: item.uName,
          uMobile: item.uMobile,
          uType: item.uType,
          uGender: item.uGender,
          active: (
            <label className="switch-container">
              <span className="switch-label"></span>
              <div className="switch">
                <input
                  type="checkbox"
                  checked={item.active} // This determines if the switch is on or off
                  onChange={(event) => handleToggleActive(event, item)} // Call the function when toggled
                />
                <span className="slider"></span>
              </div>
            </label>
          ),
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
  
      setDatatable((prevState) => ({
        ...prevState,
        rows: data,
      }));
      setJsonData(res.data?.data);
    } catch (error) {
      console.error(error);
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
      handleCheckboxChange: "#CCFFCC"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token1 = localStorage.getItem("token1");
          const accessToken = localStorage.getItem("accessToken");

          const res = await axios.delete(
            `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/users/${id}`,
            {
              headers: {
                "x-am-authorization": token1,
                "x-am-user-authorization": accessToken
              }
            }
          );
          console.log(res.data);
          Swal.fire("Deleted!", "Vendor has been deleted.", "success");
          getUserList();
        } catch (error) {
          console.error(error.response);
          Swal.fire("Error", "Failed to delete the Vendor.", "error");
        }
      }
    });
  };
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <h5 style={{ marginTop: "30px", position: "absolute", marginLeft: "30px" }}>Vendor</h5>
      <Card.Body>
        <div style={{ marginLeft: "84%" }}>
          <DownloadExcelButton jsonData={jsonData} fileName="Vendor" />
        </div>
        <Modal open={Editopen} onClose={onEditCloseModal} center>
          <h2>Edit Vendor</h2>
          <Formik
            initialValues={editData}
            validationSchema={EditSchema}
            onSubmit={(values) => {
              updateUser(editData._id, values);
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
            }) => (
              <Form>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="firstName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your uName"
                        name="uName"
                        value={values.uName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.fullname &&
                        touched.fullname &&
                        errors.fullname}
                    </div>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="lastName">
                      <Form.Label>Mobile</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter phone uMobile"
                        name="uMobile"
                        value={values.uMobile}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.phone && touched.phone && errors.phone}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="lastName">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Your uType"
                        name="uType"
                        value={values.uType}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.email && touched.email && errors.email}
                    </div>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group id="lastName">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Your uGender"
                        name="uGender"
                        value={values.uGender}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.email && touched.email && errors.email}
                    </div>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="lastName">
                      <Form.Label>Active</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Your active"
                        name="active"
                        value={values.active}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="mb-3 text-danger">
                      {errors.email && touched.email && errors.email}
                    </div>
                  </Col>
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
        <MDBDataTable striped bordered small data={datatable} />
      </Card.Body>
    </Card>
  )
}
