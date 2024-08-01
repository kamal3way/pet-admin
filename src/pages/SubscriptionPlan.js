import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Col, Row, Card, Form, Button } from "@themesberg/react-bootstrap";
import { MDBDataTable } from "mdbreact";
import { Modal } from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

export const SubscriptionPlan = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [datatable, setDatatable] = useState({
    columns: [
      { label: "No", field: "No" },
      { label: "Plan Name", field: "planName" },
      { label: "Plan Price", field: "planPrice" },
      { label: "Actions", field: "actions" },
    ],
    rows: [],
  });

  const onEditCloseModal = () => setEditOpen(false);
  const onCreateCloseModal = () => setCreateOpen(false);

  const getUserList = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/subscription_plan`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );
      console.log(res.data);
      const data = res.data?.data?.map((item, index) => ({
        No: index + 1,
        planName: item.planName,
        planPrice: item.planPrice,
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
      }));
      setDatatable((prevState) => ({
        ...prevState,
        rows: data,
      }));
      // setJsonData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setEditOpen(true);
  };

  const handleCreate = () => {
    setEditData({ planName: "", planPrice: "" });
    setCreateOpen(true);
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
        // Proceed with the delete operation
        try {
          const token1 = localStorage.getItem("token1");
          const accessToken = localStorage.getItem("accessToken");
          const res = await axios.delete(
            `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/subscription_plan/${id}/?select=&deep=`,
            {
              headers: {
                "x-am-authorization": token1,
                "x-am-user-authorization": accessToken,
              },
            }
          );
          console.log("Delete response:", res.data); 
          getUserList();
          Swal.fire("Deleted!", "Plan has been deleted.", "success");
        } catch (error) {
          console.error(error.response); 
          Swal.fire("Error", "Failed to delete the plan.", "error");
        }
      }
    });
  };
  

  const updateUser = async (id, updatedData) => {
    try {
      console.log("Updating subscription plan:", id);
      console.log("Updated data:", updatedData);
      const token1 = localStorage.getItem("token1");
      const accessToken = localStorage.getItem("accessToken");
      if (Object.keys(updatedData).length === 0) {
        throw new Error("Please provide data to update.");
      }

      const res = await axios.put(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/subscription_plan/update-by-id/${id}`,
        updatedData,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      console.log("Update response:", res.data);
      getUserList();
      onEditCloseModal();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Subscription Plan Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error.response);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const createUser = async (newData) => {
    try {
      console.log("Creating new subscription plan:", newData);
      const token1 = localStorage.getItem("token1");
      const accessToken = localStorage.getItem("accessToken");
      if (Object.keys(newData).length === 0) {
        throw new Error("Please provide data to create.");
      }

      const res = await axios.post(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/subscription_plan/save-single-or-multiple?select=&deep=`,
        [newData],
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      console.log("Create response:", res.data);
      getUserList();
      onCreateCloseModal();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Subscription Plan Created Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error.response);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  const EditSchema = Yup.object().shape({
    planName: Yup.string().required("Plan name is required"),
    planPrice: Yup.number().required("Plan price is required"),
  });

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 style={{ marginTop: "30px", position: "absolute" }}>Subscription Plans</h5>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Button onClick={handleCreate} style={{marginTop:"5%"}}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Create New Plan
          </Button>
        </div>
        <Modal open={editOpen} onClose={onEditCloseModal} center>
            <h3>Update Plan  </h3>
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
            }) => (
              <Form>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="planName">
                      <Form.Label>Plan Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter plan name"
                        name="planName"
                        value={values.planName}
                        onChange={handleChange}
                      />
                      <div className="mb-3 text-danger">
                        {errors.planName && touched.planName && errors.planName}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="planPrice">
                      <Form.Label>Plan Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter plan price"
                        name="planPrice"
                        value={values.planPrice}
                        onChange={handleChange}
                      />
                      <div className="mb-3 text-danger">
                        {errors.planPrice && touched.planPrice && errors.planPrice}
                      </div>
                    </Form.Group>
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
        <Modal open={createOpen} onClose={onCreateCloseModal} center>
          <Formik
            initialValues={{ planName: "", planPrice: "" }}
            validationSchema={EditSchema}
            onSubmit={(values) => {
              createUser(values);
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
                    <Form.Group id="planName">
                      <Form.Label>Plan Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter plan name"
                        name="planName"
                        value={values.planName}
                        onChange={handleChange}
                      />
                      <div className="mb-3 text-danger">
                        {errors.planName && touched.planName && errors.planName}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="planPrice">
                      <Form.Label>Plan Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter plan price"
                        name="planPrice"
                        value={values.planPrice}
                        onChange={handleChange}
                      />
                      <div className="mb-3 text-danger">
                        {errors.planPrice && touched.planPrice && errors.planPrice}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Create
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
        <MDBDataTable striped bordered small data={datatable} />
      </Card.Body>
    </Card>
  );
};
