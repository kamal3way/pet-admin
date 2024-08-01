import React, { useState } from "react";

import { useLocation, useHistory } from "react-router-dom";
import { Card, Row, Col, Form, Table, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export const Consultantdetails = () => {
  const location = useLocation();
  const history = useHistory();
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showVideoModal, setshowVideoModal] = useState(false);
  const [showAudioModal, setshowAudioModal] = useState(false);
  const [showServiceModal, setshowServiceModal] = useState(false);
  const [showDoctorModal, setShowDoctoModal] = useState(false);
  const [selectedClinicHour, setSelectedClinicHour] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const { items } = location.state || {};

  const {
    personalDetails,
    serviceType,
    subscriptionDetails,
    clinicServiceAt,
    service,
    videoCallWorkingHour,
    audioCallWorkingHour,
  } = location.state || {};

  const navigateBack = () => {
    history.goBack();
  };
  const handleEditClinicHour = (service) => {
    setSelectedClinicHour(service.serviceAddress);
    setShowClinicModal(true);
  };

  const handleEditDoctor = (service) => {
    setSelectedClinicHour(service.doctorDetails);
    setShowDoctoModal(true);
  };

  const handleEditAudio = (service) => {
    setSelectedClinicHour(service.audioCallWorkingHour);
    setshowAudioModal(true);
  };

  
  const handleEditVideo = (service) => {
    setSelectedClinicHour(service.videoCallWorkingHour);
    setshowVideoModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setShowHomeModal(false);
    setShowClinicModal(false);
    setShowDoctoModal(false);
    setshowServiceModal(false);
    setshowAudioModal(false);
    setshowVideoModal(false);
  
  };    

  const handleEditService = (service) => {
    setSelectedClinicHour(service.service);
    setshowServiceModal(true);
  };

  const handleSaveClinicHour = async (values) => {
    // console.log(items._id,"valuesvalues");
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const payload = {
        _id: items._id,
        serviceId: serviceType[0].serviceId,
        updateData: {
          service: values.service,
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

  const handleSaveDocter = async (values) => {
    // console.log(items._id,"valuesvalues");
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const payload = {
        _id: items._id,
        serviceId: serviceType[0].serviceId,
        updateData: {
          service: values.service,
  
          doctorDetails: {
            dName: values.dName,
            dSpecialist: values.dSpecialist,
            dExperience: values.dExperience,
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
                  addressType: selectedClinicHour.addressType,
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
                    <Form.Group id="addressType">
                      <Form.Label>addressType</Form.Label>
                      <Form.Control
                        type="text"
                        name="addressType"
                        value={values.addressType}
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

        {/* Editdoctor */}

        <Modal show={showDoctorModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Doctor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedClinicHour && (
              <Formik
                initialValues={{
                  dName: selectedClinicHour.dName,
                  dSpecialist: selectedClinicHour.dSpecialist,
                  dExperience: selectedClinicHour.dExperience,
                }}
                onSubmit={(values) => handleSaveDocter(values)}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group id="buildingName">
                      <Form.Label>Doctor name</Form.Label>
                      <Form.Control
                        type="text"
                        name="dName"
                        value={values.dName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group id="dSpecialist">
                      <Form.Label>dSpecialist</Form.Label>
                      <Form.Control
                        type="text"
                        name="dSpecialist"
                        value={values.dSpecialist}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group id="dExperience">
                      <Form.Label>dExperience</Form.Label>
                      <Form.Control
                        type="text"
                        name="dExperience"
                        value={values.dExperience}
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

        {/* closedoctor */}

        {/* editservice */}
        <Modal show={showServiceModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Service </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedClinicHour && (
              <Formik
                initialValues={{
                  serviceTitle: selectedClinicHour.serviceTitle,
                  serviceDescription: selectedClinicHour.serviceDescription,
                }}
                onSubmit={(values) => handleSaveClinicHour(values)}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group id="serviceTitle">
                      <Form.Label>serviceTitle</Form.Label>
                      <Form.Control
                        type="text"
                        name="serviceTitle"
                        value={values.serviceTitle}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group id="serviceDescription">
                      <Form.Label>serviceDescription</Form.Label>
                      <Form.Control
                        type="text"
                        name="serviceDescription"
                        value={values.serviceDescription}
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

        {/* closeservice */}

        <Modal show={showAudioModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Audio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedClinicHour && (
              <Formik
                initialValues={{
                  isOpen: selectedClinicHour.isOpen,
                  day: selectedClinicHour.day,
                }}
                onSubmit={(values) => handleSaveClinicHour(values)}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group id="isOpen">
                      <Form.Label>isOpen</Form.Label>
                      <Form.Control
                        type="text"
                        name="isOpen"
                        value={values.isOpen}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group id="day">
                      <Form.Label>day</Form.Label>
                      <Form.Control
                        type="text"
                        name="day"
                        value={values.day}
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


        <Modal show={showVideoModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Video</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedClinicHour && (
              <Formik
                initialValues={{
                  isOpen: selectedClinicHour.isOpen,
                  day: selectedClinicHour.day,
                }}
                onSubmit={(values) => handleSaveClinicHour(values)}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group id="isOpen">
                      <Form.Label>isOpen</Form.Label>
                      <Form.Control
                        type="text"
                        name="isOpen"
                        value={values.isOpen}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group id="day">
                      <Form.Label>day</Form.Label>
                      <Form.Control
                        type="text"
                        name="day"
                        value={values.day}
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
        
        <h5 style={{ color: "white" }}>Service Address</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Building</th>
              <th>Landmark</th>
              <th>City</th>
              <th>State</th>
              <th>Pin Code</th>
              <th>addressType</th>
              <th>latitude</th>
              <th>longitude</th>
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
                  <td>{service.serviceAddress.addressType}</td>
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
              ))}
          </tbody>
        </Table>

        <h5 style={{ color: "white" }}>Doctor Details</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialist</th>
              <th>Experience</th>
              {/* <th>Image</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {serviceType &&
              serviceType.map((service, index) => (
                <tr key={index}>
                  <td>{service.doctorDetails.dName}</td>
                  <td>{service.doctorDetails.dSpecialist}</td>
                  <td>{service.doctorDetails.dExperience}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditDoctor(service)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </td>
                  {/* <td>
                                    <img src={service.doctorDetails.dImage} alt="Doctor" style={{ width: '100px', height: '100px' }} />
                                </td> */}
                </tr>
              ))}
          </tbody>
        </Table>

        {subscriptionDetails && (
          <>
            <h5 style={{ color: "white" }}>Subscription Details</h5>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Subscription ID</th>
                  <th>Plan Name</th>
                  <th>Plan Price</th>
                  <th>Plan Expiry</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{subscriptionDetails.subscriptionID}</td>
                  <td>{subscriptionDetails.planName}</td>
                  <td>{subscriptionDetails.planPrice}</td>
                  <td>{subscriptionDetails.planExpiry}</td>
                </tr>
              </tbody>
            </Table>
          </>
        )}

        {clinicServiceAt && (
          <>
            <h5 style={{ color: "white" }}>Clinic Service At</h5>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Place</th>
                  <th>Charge</th>
                </tr>
              </thead>
              <tbody>
                {clinicServiceAt.map((service, index) => (
                  <tr key={index}>
                    <td>{service.place}</td>
                    <td>{service.charge}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {videoCallWorkingHour && (
          <>
            <h5 style={{ color: "white" }}>Video Call Working Hours</h5>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>From Time</th>
                  <th>To Time</th>
                  {/* <th>Action</th> */}

                </tr>
              </thead>
              <tbody>
                {videoCallWorkingHour.map((hour, index) => (
                  <tr key={index}>
                    <td>{hour.day}</td>
                    <td>{hour.slot[0].fromTime}</td>/
                    <td>{hour.slot[0].toTime}</td>
                    <td>
                   
                  </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {audioCallWorkingHour && (
          <>
            <h5 style={{ color: "white" }}>Audio Call Working Hours</h5>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>From Time</th>
                  <th>To Time</th>
                </tr>
              </thead>
              <tbody>
                {audioCallWorkingHour.map((hour, index) => (
                  <tr key={index}>
                    <td>{hour.day}</td>
                    <td>{hour.slot[0].fromTime}</td>
                    <td>{hour.slot[0].toTime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
        <h5 style={{ color: "white" }}>Service Details</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Service Title</th>
              <th>Service Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {serviceType &&
              serviceType.map((service, index) =>
                service.service.map((serv, idx) => (
                  <tr key={idx}>
                    <td>{serv.serviceTitle}</td>
                    <td>{serv.serviceDescription}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleEditService(service)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </Table>

        <h5 style={{ color: "white" }}>Audio Call Working Hours</h5>
        {/* <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>From Time</th>
                            <th>To Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceType && serviceType.map((service, index) => (
                            service.audioCallWorkingHour.map((hour, idx) => (
                                <tr key={idx}>
                                    <td>{hour.day}</td>
                                    <td>{hour.slot[0].fromTime}</td>
                                    <td>{hour.slot[0].toTime}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </Table> */}
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Day</th>
              <th>From Time</th>
              <th>To Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {serviceType &&
              serviceType.map((service, serviceIndex) =>
                service.audioCallWorkingHour.map((hour, index) => (
                  <tr key={index}>
                    <td>{hour.day}</td>
                    <td>
                      {hour.slot.length > 0 ? hour.slot[0].fromTime : "-"}
                    </td>
                    <td>{hour.slot.length > 0 ? hour.slot[0].toTime : "-"}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleEditAudio(service)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </Table>

        <h5 style={{ color: "white" }}>Video Call Working Hours</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Day</th>
              <th>From Time</th>
              <th>To Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {serviceType &&
              serviceType.map((service, index) =>
                service.videoCallWorkingHour.map((hour, idx) => (
                  <tr key={idx}>
                    <td>{hour.day}</td>
                    <td>{hour.slot[0].fromTime}</td>
                    <td>{hour.slot[0].toTime}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleEditVideo(service)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </Table>
        {service && (
          <>
            <h5 style={{ color: "white" }}>Additional Services</h5>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Service Title</th>
                  <th>Service Description</th>
                </tr>
              </thead>
              <tbody>
                {service.map((service, index) => (
                  <tr key={index}>
                    <td>{service.serviceTitle}</td>
                    <td>{service.serviceDescription}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Card.Body>
    </Card>
  );
};