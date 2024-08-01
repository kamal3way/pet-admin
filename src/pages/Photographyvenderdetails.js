import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Form,
  Table,
  Button,
  Modal,
  CardBody,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import axios from "axios";
import { FieldArray } from "formik";

export const Photographyvenderdetails = () => {
  const location = useLocation();
  const history = useHistory();

  const [showClinicModal, setShowClinicModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedClinicHour, setSelectedClinicHour] = useState(null);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedHomeHour, setSelectedHomeHour] = useState(null);

  const { personalDetails, serviceType, items } = location.state || {};

  const navigateBack = () => {
    history.goBack();
  };

  const handleSaveClinicHour = async (values) => {
    console.log(items._id, "valuesvalues");
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const payload = {
        _id: items._id,
        serviceId: serviceType[0].serviceId,
        updateData: {
        
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

      console.log("Sending payload:", payload); // Log the payload for debugging

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

      console.log("Response received:", response.data); // Log the response for debugging

      if (response.status === 200) {
        console.log("Clinic service updated successfully");
        setShowClinicModal(false);
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

  const handleSaveService = async (values) => {
    console.log(items._id, "valuesvalues");
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const payload = {
        _id: items._id,
        serviceId: serviceType[0].serviceId,
        updateData: {
          service: values.service,
          service: [
            {
              serviceTitle: values.serviceTitle,
              serviceDescription: values.serviceDescription,
              serviceSaloonHourCharge: values.serviceSaloonHourCharge,
              serviceHomeHourCharge: values.serviceHomeHourCharge,
            },
          ],
        },
      };

      console.log("Sending payload:", payload); // Log the payload for debugging

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

      console.log("Response update service :", response.data); // Log the response for debugging

      if (response.status === 200) {
        console.log("Clinic service updated successfully");
        setShowClinicModal(false);
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

  const handleSaveSlot = async (values) => {
    console.log(items._id, "valuesvalues");
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    
    try {
      const payload = {
        _id: items._id,
        serviceId: serviceType[0].serviceId,
        updateData: {
          homeWorkingHours: [
            {
              isOpen: values.isOpen,
              day: values.day,
              slot: values.slot // Ensure slot data is correctly included here
            },
          ],
        },
      };
  
      console.log("Sending payload:", payload); // Log the payload for debugging
  
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
  
      console.log("Response received:", response.data); // Log the response for debugging
  
      if (response.status === 200) {
        console.log("Slot updated successfully");
        setShowHomeModal(false);
      } else {
        console.error(
          "Error updating slot:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error updating slot:", error);
    }
  };
  

  const handleSaveHomeHour = (values) => {
    setShowHomeModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowHomeModal(false);
    setShowClinicModal(false);
  };

  const handleEditHomeHour = (hour) => {
    setSelectedHomeHour(hour);
    setShowHomeModal(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleEditClinicHour = (service) => {
    setSelectedClinicHour(service.serviceAddress);
    setShowClinicModal(true);
  };
  return (
    <Card border="light" className="bg-black shadow-sm mb-4">
      <Card.Body>
        <div>
          <FontAwesomeIcon
            style={{
              height: "20px",
              width: "20px",
              marginBottom: "10px",
              color: "white",
            }}
            icon={faArrowLeft}
            onClick={navigateBack}
          />
        </div>
        <h5 style={{ color: "white" }}>Personal Details</h5>
        {personalDetails && (
          <Formik
            initialValues={personalDetails}
            onSubmit={(values) => {
              console.log("Form Values:", values);
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group id="pName">
                      <Form.Label style={{ color: "white" }}>
                        Personal Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pName"
                        value={values.pName}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group id="pMobile">
                      <Form.Label style={{ color: "white" }}>Mobile</Form.Label>
                      <Form.Control
                        type="text"
                        name="pMobile"
                        value={values.pMobile}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group id="pEmail">
                      <Form.Label style={{ color: "white" }}>Email</Form.Label>
                      <Form.Control
                        type="text"
                        name="pEmail"
                        value={values.pEmail}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        )}

<Modal show={showHomeModal} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Home Working Hour</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedHomeHour && (
      <Formik
        initialValues={selectedHomeHour} // Ensure this includes existing slots
        onSubmit={(values) => handleSaveSlot(values)}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group id="day">
              <Form.Label>Day</Form.Label>
              <Form.Control
                type="text"
                name="day"
                value={values.day}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group id="isOpen">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="isOpen"
                value={values.isOpen}
                onChange={handleChange}
              >
                <option value={true}>Open</option>
                <option value={false}>Closed</option>
              </Form.Control>
            </Form.Group>
            <FieldArray name="slot">
              {({ remove, push }) => (
                <div>
                  {values.slot.map((slot, index) => (
                    <div key={index}>
                      <Form.Group id={`slot.${index}.fromTime`}>
                        <Form.Label>From Time</Form.Label>
                        <Form.Control
                          type="text"
                          name={`slot.${index}.fromTime`}
                          value={slot.fromTime}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group id={`slot.${index}.toTime`}>
                        <Form.Label>To Time</Form.Label>
                        <Form.Control
                          type="text"
                          name={`slot.${index}.toTime`}
                          value={slot.toTime}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {/* <Button variant="danger" onClick={() => remove(index)}>
                        Remove Slot
                      </Button> */}
                    </div>
                  ))}
                  {/* <Button variant="primary" onClick={() => push({ fromTime: '', toTime: '' })}>
                    Add Slot
                  </Button> */}
                </div>
              )}
            </FieldArray>
            {/* <Button variant="secondary" onClick={handleClose} style={{ marginLeft: "180px" }}>
              Close
            </Button> */}
            <Button
              variant="primary"
              type="submit"
              style={{ marginTop: "20px" }}
            >
              Update
            </Button>
          </Form>
        )}
      </Formik>
    )}
  </Modal.Body>
</Modal>
        {serviceType.map((service, index) => (
          <Card border="light" className="bg-black shadow-sm mb-4" key={index}>
            <CardBody>
              <h5 style={{ color: "white" }}>Home Working Hours</h5>
              <Table className="table table-dark">
                <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Open</th>
                    <th scope="col">From Time</th>
                    <th scope="col">To Time</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {service.homeWorkingHours.map((hour, hourIndex) => (
                    <tr key={index}>
                      <td>{hour.day}</td>
                      <td style={{ color: hour.isOpen ? "green" : "red" }}>
                        {hour.isOpen ? "Open" : "Closed"}
                      </td>
                      <td>
                        {hour.slot.length > 0 ? (
                          <ul className="list-unstyled">
                            {hour.slot.map((slot, slotIndex) => (
                              <li key={slotIndex}>
                                {slotIndex + 1}. {slot.fromTime}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {hour.slot.length > 0 ? (
                          <ul className="list-unstyled">
                            {hour.slot.map((slot, slotIndex) => (
                              <li key={slotIndex}>
                                {slotIndex + 1}. {slot.toTime}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleEditHomeHour(hour)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Modal show={showClinicModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Service Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedClinicHour && (
                    <Formik
                      initialValues={{
                        buildingName: selectedClinicHour.buildingName,
                        landmark: selectedClinicHour.landmark,
                        city: selectedClinicHour.city,
                        state: selectedClinicHour.state,
                        pinCode: selectedClinicHour.pinCode,
                        latitude: selectedClinicHour.latitude,
                        longitude: selectedClinicHour.longitude,
                      }}
                      onSubmit={(values) => handleSaveClinicHour(values)}
                    >
                      {({ values, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                          <Form.Group id="buildingName">
                            <Form.Label>Building Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="buildingName"
                              value={values.buildingName}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group id="landmark">
                            <Form.Label>Landmark</Form.Label>
                            <Form.Control
                              type="text"
                              name="landmark"
                              value={values.landmark}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group id="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={values.city}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group id="state">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              value={values.state}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group id="pinCode">
                            <Form.Label>Pin Code</Form.Label>
                            <Form.Control
                              type="number"
                              name="pinCode"
                              value={values.pinCode}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group id="latitude">
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control
                              type="number"
                              name="latitude"
                              value={values.latitude}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group id="longitude">
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control
                              type="number"
                              name="longitude"
                              value={values.longitude}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Button
                            variant="primary"
                            type="submit"
                            style={{ marginTop: "20px" }}
                          >
                            Update
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  )}
                </Modal.Body>
              </Modal>
              <h5 style={{ color: "white", marginTop: "20px" }}>
                Service Address
              </h5>
              {serviceType &&
                serviceType.map((service, index) => (
                  <Table striped bordered hover variant="dark" key={index}>
                    <thead>
                      <tr>
                        <th>Building Name</th>
                        <th>Landmark</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Pin Code</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
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
                            onClick={() => handleEditClinicHour(service)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                ))}
              {serviceType.map((service, index) => (
                <Card
                  border="light"
                  className="bg-black shadow-sm mb-4"
                  key={index}
                >
                  <CardBody>
                    <h5 style={{ color: "white" }}>Services</h5>
                    <Table className="table table-dark">
                      <thead>
                        <tr>
                          <th scope="col">Service Title</th>
                          <th scope="col">Description</th>
                          <th scope="col">service Saloon HourCharge</th>
                          <th scope="col">service Home HourCharge</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {service.service.map((svc, svcIndex) => (
                          <tr key={svcIndex}>
                            <td>{svc.serviceTitle}</td>
                            <td>{svc.serviceDescription}</td>
                            <td>{svc.serviceSaloonHourCharge}</td>
                            <td>{svc.serviceHomeHourCharge}</td>
                            <td>
                              <Button
                                variant="primary"
                                onClick={() => handleEditService(svc)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Modal show={showModal} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Edit Service</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {selectedService && (
                          <Formik
                            initialValues={{
                              serviceTitle: selectedService.serviceTitle,
                              serviceDescription:
                                selectedService.serviceDescription,
                              serviceSaloonHourCharge:
                                selectedService.serviceSaloonHourCharge,
                              serviceHomeHourCharge:
                                selectedService.serviceHomeHourCharge,
                            }}
                            onSubmit={(values) => handleSaveService(values)}
                          >
                            {({ values, handleChange, handleSubmit }) => (
                              <Form onSubmit={handleSubmit}>
                                <Form.Group id="serviceTitle">
                                  <Form.Label>Service Title</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="serviceTitle"
                                    value={values.serviceTitle}
                                    onChange={handleChange}
                                  />
                                </Form.Group>
                                <Form.Group id="serviceDescription">
                                  <Form.Label>Description</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="serviceDescription"
                                    value={values.serviceDescription}
                                    onChange={handleChange}
                                  />
                                </Form.Group>
                                <Form.Group id="serviceHomeCharge">
                                  <Form.Label>
                                    serviceSaloonHourCharge
                                  </Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="serviceSaloonHourCharge"
                                    value={values.serviceSaloonHourCharge}
                                    onChange={handleChange}
                                  />
                                </Form.Group>
                                <Form.Group id="serviceHomeCharge">
                                  <Form.Label>serviceHomeHourCharge</Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="serviceHomeHourCharge"
                                    value={values.serviceHomeHourCharge}
                                    onChange={handleChange}
                                  />
                                </Form.Group>
                                <Button
                                  variant="primary"
                                  type="submit"
                                  style={{ marginTop: "20px" }}
                                >
                                  Update
                                </Button>
                              </Form>
                            )}
                          </Formik>
                        )}
                      </Modal.Body>
                    </Modal>
                  </CardBody>
                </Card>
              ))}
            </CardBody>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
};
