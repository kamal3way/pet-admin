import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Card, Row, Col, Form, Table, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import axios from "axios";

export const Eventdetails = () => {
  const location = useLocation();
  const history = useHistory();
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { personalDetails, serviceType } = location.state || {};

  const handleCloseModal = () => {
    setShowClinicModal(false);
    setShowEventModal(false);
    setSelectedService(null);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setShowClinicModal(true); // Open clinic modal for service details
  };

  const handleEditEvent = (service) => {
    setSelectedService(service);
    setShowEventModal(true); // Open event modal for event details
  };

  const handleSaveService = async (values) => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const payload = {
        serviceId: selectedService.serviceId, // Ensure serviceId is correctly referenced
        updateData: {
          service: selectedService.service, // Include any other necessary service data
          serviceAddress: {
            buildingName: values.buildingName,
            landmark: values.landmark,
            city: values.city,
            state: values.state,
            pinCode: values.pinCode,
            latitude: values.latitude,
            longitude: values.longitude,
          },
        },
      };

      const response = await axios.post(
        "https://pets.dev.savaapi.com/api/custom-api/dev1/clinic/update-clinic-service",
        payload,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      if (response.status === 200) {
        console.log("Clinic service updated successfully");
        handleCloseModal();
      } else {
        console.error(
          "Error updating clinic service:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error updating clinic service:", error);
    }
  };


  return (
    <Card border="light" className="bg-black shadow-sm mb-4">
      <Card.Body>
        <h5 style={{ color: "white" }}>Personal Details</h5>
        {personalDetails && (
          <Formik
            initialValues={personalDetails}
            onSubmit={(values) => {
              console.log("Form Values:", values);
            }}
          >
            {({ values }) => (
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="pName">
                      <Form.Label style={{ color: "white" }}>
                        Personal Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pName"
                        value={values.pName}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="pMobile">
                      <Form.Label style={{ color: "white" }}>Mobile</Form.Label>
                      <Form.Control
                        type="text"
                        name="pMobile"
                        value={values.pMobile}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="pEmail">
                      <Form.Label style={{ color: "white" }}>Email</Form.Label>
                      <Form.Control
                        type="text"
                        name="pEmail"
                        value={values.pEmail}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        )}

        <h5 style={{ color: "white" }}>Service Address</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Building</th>
              <th>Landmark</th>
              <th>City</th>
              <th>State</th>
              <th>Pin Code</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {serviceType &&
              serviceType.map((service, index) => (
                <tr key={index}>
                  <td>{service.serviceAddress.buildingName}</td>
                  <td>{service.serviceAddress.landmark}</td>
                  <td>{service.serviceAddress.city}</td>
                  <td>{service.serviceAddress.state}</td>
                  <td>{service.serviceAddress.pinCode}</td>
                  <td>{service.serviceAddress.latitude}</td>
                  <td>{service.serviceAddress.longitude}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditService(service)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <Modal show={showClinicModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Service Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedService && (
              <Formik
                initialValues={{
                  ...selectedService.serviceAddress,
                }}
                onSubmit={(values) => handleSaveService(values)}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="buildingName">
                      <Form.Label>Building Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="buildingName"
                        value={values.buildingName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="landmark">
                      <Form.Label>Landmark</Form.Label>
                      <Form.Control
                        type="text"
                        name="landmark"
                        value={values.landmark}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="state">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={values.state}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="pinCode">
                      <Form.Label>Pin Code</Form.Label>
                      <Form.Control
                        type="number"
                        name="pinCode"
                        value={values.pinCode}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="latitude">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control
                        type="number"
                        name="latitude"
                        value={values.latitude}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="longitude">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        type="number"
                        name="longitude"
                        value={values.longitude}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Modal.Body>
        </Modal>


        <Modal show={showClinicModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit eventDetails</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedService && (
              <Formik
                initialValues={{
                  ...selectedService.eventDetails,
                }}
                onSubmit={(values) => handleSaveService(values)}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="eventStartDate">
                      <Form.Label>eventStartDate</Form.Label>
                      <Form.Control
                        type="text"
                        name="eventStartDate"
                        value={values.eventStartDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="eventEndDate">
                      <Form.Label>eventEndDate</Form.Label>
                      <Form.Control
                        type="text"
                        name="eventEndDate"
                        value={values.eventEndDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="eventStartTime">
                      <Form.Label>eventStartTime</Form.Label>
                      <Form.Control
                        type="text"
                        name="eventStartTime"
                        value={values.eventStartTime}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="eventEndTime">
                      <Form.Label>eventEndTime</Form.Label>
                      <Form.Control
                        type="text"
                        name="eventEndTime"
                        value={values.eventEndTime}
                        onChange={handleChange}
                      />
                    </Form.Group>
               
                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Modal.Body>
        </Modal>


        <h5 style={{ color: "white" }}>Event Detail</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>eventStartDate</th>
              <th>eventEndDate</th>
              <th>eventStartTime</th>
              <th>eventEndTime</th>
              <th>Action</th>
            
            </tr>
          </thead>
          <tbody>
            {serviceType &&
              serviceType.map((service, index) => (
                <tr key={index}>
                  <td>{service.eventDetails.eventStartDate}</td>
                  <td>{service.eventDetails.eventEndDate}</td>
                  <td>{service.eventDetails.eventStartTime}</td>
                  <td>{service.eventDetails.eventEndTime}</td>
                
                  <td>
                  <Button
                      variant="primary"
                      onClick={() => handleEditService(service)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Modal show={showClinicModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Service Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedService && (
          <Formik
            initialValues={{
              buildingName: selectedService.serviceAddress.buildingName || '',
              landmark: selectedService.serviceAddress.landmark || '',
              city: selectedService.serviceAddress.city || '',
              state: selectedService.serviceAddress.state || '',
              pinCode: selectedService.serviceAddress.pinCode || '',
              latitude: selectedService.serviceAddress.latitude || '',
              longitude: selectedService.serviceAddress.longitude || '',
            }}
            onSubmit={(values) => handleSaveService(values)}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="buildingName">
                  <Form.Label>Building Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="buildingName"
                    value={values.buildingName}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="landmark">
                  <Form.Label>Landmark</Form.Label>
                  <Form.Control
                    type="text"
                    name="landmark"
                    value={values.landmark}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="pinCode">
                  <Form.Label>Pin Code</Form.Label>
                  <Form.Control
                    type="number"
                    name="pinCode"
                    value={values.pinCode}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="latitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    name="latitude"
                    value={values.latitude}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="longitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    name="longitude"
                    value={values.longitude}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Modal.Body>
    </Modal>
        <h5 style={{ color: "white" }}>service</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>serviceTitle</th>
              <th>serviceDescription</th>
              <th>Action</th>
            
            </tr>
          </thead>
          <tbody>
          {serviceType &&
    serviceType.map((service, index) => (
      <tr key={index}>
        {service.service.map((s, i) => (
          <React.Fragment key={i}>
            <td>{s.serviceTitle}</td>
            <td>{s.serviceDescription}</td>
            <td>
              <Button
                variant="primary"
                onClick={() => handleEditService(service)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </td>
          </React.Fragment>
        ))}
      </tr>
    ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
