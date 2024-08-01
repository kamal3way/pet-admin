import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Card, Row, Col, Form, Table, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FieldArray, Formik } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2';
export const Aquariumdetailss  = () => {
  const location = useLocation();
  const history = useHistory();
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedClinicHour, setSelectedClinicHour] = useState(null);
  const [selectedHomeHour, setSelectedHomeHour] = useState(null);
//   const { personalDetails, serviceType } = location.state || {};
  const { personalDetails, serviceType,items } = location.state || {};

  useEffect(() => {
    console.log('Location State:', location.state);
    console.log('Service Type:', serviceType);
  }, [location.state]);

  const navigateBack = () => {
    history.goBack();
  };

//   const handleSaveClinicHour = (values) => {
//     setShowClinicModal(false);
//   };

  const handleSaveHomeHour = (values) => {
    setShowHomeModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowHomeModal(false);
    setShowClinicModal(false);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleEditHomeHour = (hour) => {
    setSelectedHomeHour(hour);
    setShowHomeModal(true);
  };

  const handleEditClinicHour = (service) => {
    setSelectedClinicHour(service);
    setShowClinicModal(true);
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
              serviceDescription: values.serviceDescription ,
              serviceSaloonCharge: values.serviceSaloonCharge,
             
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

  const handleSaveClinicHour = async (values) => {
    console.log(items._id,"valuesvalues");
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
            landmark: values.landmark ,
            city: values.city ,
            state: values.state ,
            pinCode: values.pinCode ,
            latitude: values.latitude ,
            longitude: values.longitude ,
          },
        },
      };

      console.log('Sending payload:', payload);  // Log the payload for debugging

      const response = await axios.post(
        'https://pets.dev.savaapi.com/api/custom-api/dev1/clinic/update-clinic-service',
        payload,
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      console.log('Response received:', response.data);  // Log the response for debugging
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Service Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      if (response.status === 200) {
        console.log('Clinic service updated successfully');
        setShowClinicModal(false);
      } else {
        console.error('Error updating clinic service:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error updating clinic service:', error);
    }
  };

  return (
    <Card border="light" className="bg-black shadow-sm mb-4">
      <Card.Body>
        <div>
          <FontAwesomeIcon
            style={{ height: '20px', width: '20px', marginBottom: '10px', color: 'white' }}
            icon={faArrowLeft}
            onClick={navigateBack}
          />
        </div>
        <h5 style={{ color: 'white' }}>Personal Details</h5>
        {personalDetails && (
          <Formik
            initialValues={personalDetails}
            onSubmit={(values) => {
              console.log('Form Values:', values);
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group id="pName">
                      <Form.Label style={{ color: 'white' }}>Personal Name</Form.Label>
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
                      <Form.Label style={{ color: 'white' }}>Mobile</Form.Label>
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
                      <Form.Label style={{ color: 'white' }}>Email</Form.Label>
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

                                serviceSaloonCharge:
                                selectedService.serviceSaloonCharge,

                        
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
                                  serviceSaloonCharge
                                  </Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="serviceSaloonCharge"
                                    value={values.serviceSaloonCharge}
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
        <h5 style={{ color: 'white', marginTop: '20px' }}>Service Address</h5>
        {serviceType && serviceType.length > 0 ? (
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
                  <td>{service.serviceAddress.pinCode}</td>
                  <td>{service.serviceAddress.city}</td>
                  <td>{service.serviceAddress.state}</td>
                  <td>{service.serviceAddress.latitude}</td>
                  <td>{service.serviceAddress.longitude}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditClinicHour(service)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          ))
        ) : (
          <p style={{ color: 'white' }}>No service address available</p>
        )}

        <h5 style={{ color: 'white', marginTop: '20px' }}>Services</h5>
        {serviceType && serviceType.length > 0 ? (
          serviceType.map((service, index) => (
            <Table striped bordered hover variant="dark" key={index}>
              <thead>
                <tr>
                  <th>Service Title</th>
                  <th>Service Description</th>
                  <th>Service Saloon Charge</th>
          
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {service.service.map((serviceItem, i) => (
                  <tr key={i}>
                    <td>{serviceItem.serviceTitle}</td>
                    <td>{serviceItem.serviceDescription}</td>
                    <td>{serviceItem.serviceSaloonCharge}</td>
                    {/* <td>{serviceItem.serviceHomeCharge}</td> */}
                    <td>
                      <Button variant="primary" onClick={() => handleEditService(serviceItem)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))
        ) : (
          <p style={{ color: 'white' }}>No services available</p>
        )}

        {serviceType && serviceType.length > 0 ? (
          serviceType.map((service, index) => (
            <div key={index}>
              <h6 style={{ color: 'white' }}>{service.businessName}</h6>
              <h6 style={{ color: 'white' }}>Working Hours</h6>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Open</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {service.clinicSaloonWorkingHour.map((hour, i) => (
                    <tr key={i}>
                      <td>{hour.day}</td>
                      <td>{hour.isOpen ? 'Yes' : 'No'}</td>
                      <td>{hour.slot[0]?.fromTime}</td>
                      <td>{hour.slot[0]?.toTime}</td>
                      <td>
                        <Button variant="primary" onClick={() => handleEditHomeHour(hour)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))
        ) : (
          <p style={{ color: 'white' }}>No working hours available</p>
        )}

        {/* Modals for editing */}
        <Modal show={showHomeModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Home Working Hour</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedHomeHour && (
              <Formik
                initialValues={selectedHomeHour}
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
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                    <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showClinicModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Service Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedClinicHour && (
              <Formik
                initialValues={selectedClinicHour.serviceAddress}
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
                    <Form.Group id="pinCode">
                      <Form.Label>Pin Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="pinCode"
                        value={values.pinCode}
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
                    <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Modal.Body>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default Aquariumdetailss ;
