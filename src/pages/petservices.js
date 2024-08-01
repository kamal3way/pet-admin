import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
} from "@themesberg/react-bootstrap";
import Swal from "sweetalert2";
import Modal from "react-responsive-modal";
import * as Yup from "yup";
import { Formik } from "formik";
import { MDBDataTable } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus ,faTrash} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export const Petservices = () => {
  const [jsonData, setJsonData] = useState([]);
  const[value,setValue] = useState({})
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [datatable, setDatatable] = useState({
    columns: [
      { label: "Service Name", field: "serviceName" },
      { label: "Service Category", field: "serviceCategory" },
      { label: "Service Img", field: "serviceImg" },
      { label: "Actions", field: "actions" },
    ],
    rows: []
  });

  useEffect(() => {
    getVetServices();
  }, []);
  useEffect(() => {
    if (value === "1") {
      getVetServices();
    } else if (value === "2") {
      // gettraningcenter();
    }
  }, [value]);
  const [myData, setMyData] = useState({
    serviceName: "",
    serviceCategory: "",
    serviceImg: "",
  });

  const handleEdit = (data) => {
    setEditData(data);
    setEditOpen(true);
  };

  const SigninSchema = Yup.object().shape({
    serviceName: Yup.string().required("Required"),
    serviceCategory: Yup.string().required("Required"),
    // serviceImg: Yup.string().required("Required"),
  });

  const EditSchema = Yup.object().shape({
    serviceName: Yup.string().required("Required"),
    serviceCategory: Yup.string().required("Required"),
    serviceImg: Yup.string().required("Required"),
  });

  const replacePlaceholderImage = (image) => {
    const defaultImageURL = "https://your-image-url.com/default-image.jpg"; 
    return image === "nemo" ? defaultImageURL : image;
  };

  const getVetServices = async () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services`,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );
      const data = res.data?.data?.map((item, index) => {
        return {
          serviceName: item.serviceName,
          serviceCategory: item.serviceCategory,
          serviceImg: (
            <img
              src={replacePlaceholderImage(item.serviceImg)}
              alt={item.serviceName}
              width="50"
              height="50"
            />
          ),
          actions: (
            <div>
              <FontAwesomeIcon
                icon={faTrash}
                className="mx-3"
                onClick={() => handleDelete(item._id)}
              />
              <FontAwesomeIcon
                icon={faEdit}
                className="mx-3"
                onClick={() => handleEdit(item)}
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

  const createServices = async (values, { setSubmitting, resetForm }) => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services/save-single-or-multiple`,
        values,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Services has been Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      if (res.status === 200) {
        getVetServices();
        setOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const updateServices = async (values) => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");

    const { _id, ...updateData } = values;

    try {
      const res = await axios.put(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services/update-by-id/${_id}`,
        updateData,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Services have been Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        getVetServices();
        setEditOpen(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.errors[0].code === 400) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error updating services",
          text: error.response.data.errors[0].message,
          showConfirmButton: true,
        });
      } else {
        console.error(error);
      }
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
            `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services/${id}`,
            {
              headers: {
                "x-am-authorization": token1,
                "x-am-user-authorization": accessToken
              }
            }
          );
          console.log(res.data);
          Swal.fire("Deleted!", "Services has been deleted.", "success");
          getVetServices();
        } catch (error) {
          console.error(error.response);
          Swal.fire("Error", "Failed to delete the Users.", "error");
        }
      }
    });
  };
  // const handleDelete = async (id) => {
  //   try {
  //     const token1 = localStorage.getItem("token1");
  //     const accessToken = localStorage.getItem("accessToken");
  //     const res = await axios.delete(
  //       `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services/${id}`,
  //       {
  //         headers: {
  //           "x-am-authorization": token1,
  //           "x-am-user-authorization": accessToken
  //         }
  //       }
  //     );
  //     console.log(res.data);
  //     Swal.fire("Deleted!", "Pet service has been deleted.", "success");
  //     getVetServices(); // Fetch updated list after deletion
  //   } catch (error) {
  //     console.error(error.response);
  //     Swal.fire("Error", "Failed to delete pet service.", "error");
  //   }
  // };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4 class="mb-0">Pet Services</h4>
  <Button class="btn btn-primary" onClick={() => setOpen(true)}>
    Add Services
    <FontAwesomeIcon icon={faPlus} className="mx-4" />
  </Button>
</div>
        <MDBDataTable striped bordered small data={datatable} />

        <Modal open={open} onClose={() => setOpen(false)} center>
          <h2>Add Service</h2>
          <Formik
            initialValues={myData}
            validationSchema={SigninSchema}
            onSubmit={createServices}
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
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="serviceName">
                      <Form.Label>Service Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Service Name"
                        name="serviceName"
                        value={values.serviceName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.serviceName && touched.serviceName && (
                        <div className="text-danger">{errors.serviceName}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="serviceCategory">
                      <Form.Label>Service Category</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Service Category"
                        name="serviceCategory"
                        value={values.serviceCategory}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.serviceCategory && touched.serviceCategory && (
                        <div className="text-danger">{errors.serviceCategory}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="serviceImg">
                      <Form.Label>Service Image URL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Service Image URL"
                        name="serviceImg"
                        value={values.serviceImg}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.serviceImg && touched.serviceImg && (
                        <div className="text-danger">{errors.serviceImg}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal open={editOpen} onClose={() => setEditOpen(false)} center>
          <h2>Edit Service</h2>
          <Formik
            initialValues={editData}
            validationSchema={EditSchema}
            onSubmit={(values) => {
              updateServices(values);
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="serviceName">
                      <Form.Label>Service Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Service Name"
                        name="serviceName"
                        value={values.serviceName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="serviceCategory">
                      <Form.Label>Service Category</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Service Category"
                        name="serviceCategory"
                        value={values.serviceCategory}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group id="serviceImg">
                      <Form.Label>Service Image URL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Service Image URL"
                        name="serviceImg"
                        value={values.serviceImg}
                        onChange={handleChange}
                      />
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
      </Card.Body>
    </Card>
  );
};
