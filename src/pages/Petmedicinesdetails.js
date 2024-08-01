import React, { useState } from 'react';
import { useLocation ,useHistory} from 'react-router-dom';
import { Card, Form, Row, Col,Modal, Table,Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export const Petmedicinesdetails = () => {
  const location = useLocation();
  const { items } = location.state || {};
  const { personalDetails, serviceType, idProof } = items || {};
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedClinicHour, setSelectedClinicHour] = useState(null);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showClinicModal1, setShowClinicModal1] = useState(false);
  const history = useHistory();

  const navigateBack = () => {
    history.goBack();
  };




  // const handleClose = () => {
  //   setShowModal(false);
  //   // setShowHomeModal(false);
  //   // setShowClinicModal(false);
  // };

  const handleClose = () => {
    setShowModal(false);
    // setShowHomeModal(false);
    setShowClinicModal(false);
  };
  const handleClose1 = () => {
    setShowModal(false);
    // setShowHomeModal(false);
    setShowClinicModal1(false);
  };

  const handleEditService1 = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };
  const handleEditClinicHour = (service) => {
    setSelectedClinicHour(service.serviceAddress);
    setShowClinicModal(true);
  };

    const handleEditClinicHour1 = (service) => {
    setSelectedClinicHour(service.petMarketPrimaryDetail);
    setShowClinicModal1(true);
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



  const handleSaveClinicHour1 = async (values) => {
    console.log(items._id, "valuesvalues");
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");
    try {
      const payload = {
        _id: items._id,
        serviceId: serviceType[0].serviceId,
        updateData: {
        
          petMarketPrimaryDetail: {
            name: values.name,
            mobile: values.mobile,
            email: values.email,
     
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
            style={{ height: '20px', width: '20px', marginBottom: '10px', color: 'white' }}
            icon={faArrowLeft}
            onClick={navigateBack}
          />
        </div>

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




              <Modal show={showClinicModal1} onHide={handleClose1}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Service </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedClinicHour && (
                    <Formik
                      initialValues={{
                        name: selectedClinicHour.name,
                        mobile: selectedClinicHour.mobile,
                        email: selectedClinicHour.email,
            
                      }}
                      onSubmit={(values) => handleSaveClinicHour1(values)}
                    >
                      {({ values, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                          <Form.Group id="name">
                            <Form.Label> Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group id="mobile">
                            <Form.Label>mobile</Form.Label>
                            <Form.Control
                              type="text"
                              name="mobile"
                              value={values.mobile}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group id="email">
                            <Form.Label>email</Form.Label>
                            <Form.Control
                              type="text"
                              name="email"
                              value={values.email}
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









<h5 style={{ color: "white", marginTop: "20px" }}>
petMarket Primary Detail
              </h5>
              {serviceType &&
                serviceType.map((service, index) => (
                  <Table striped bordered hover variant="dark" key={index}>
                    <thead>
                      <tr>
                        <th> Name</th>
                        <th>mobile</th>
                        <th>email</th>
                   
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{service.petMarketPrimaryDetail.name}</td>
                        <td>{service.petMarketPrimaryDetail.mobile}</td>
                        <td>{service.petMarketPrimaryDetail.email}</td>
               
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => handleEditClinicHour1(service)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                ))}
        {/* <h5 style={{ color: 'white' }}>Personal Details</h5>
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
        <h5 style={{ color: 'white', marginTop: '20px' }}>ID Proof</h5>
        {idProof && (
          <Row className="mb-4">
            <Col md={6}>
              <Card className="bg-light shadow-sm">
                <Card.Body>
                  <Card.Img 
                    variant="top" 
                    src={idProof.iImage} 
                    style={{ height: '100px', width: '100px', }} 
                  />
                  <Card.Title className="mt-2">{idProof.iName}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )} */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Service</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedService && (
              <Formik
                initialValues={{
                  serviceTitle: selectedService.serviceTitle,
                  serviceDescription: selectedService.serviceDescription,
                  serviceSaloonCharge: selectedService.serviceSaloonCharge,
                  serviceHomeCharge: selectedService.serviceHomeCharge,
                }}
                // onSubmit={(values) => {
                //   console.log('Updated Values:', values);
                //   setShowModal(false);
                // }}
                // onSubmit={(values) => serviceHomeCharge(values)}
                

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
                    <Form.Group id="serviceSaloonCharge">
                      <Form.Label>Salon Charge</Form.Label>
                      <Form.Control
                        type="number"
                        name="serviceSaloonCharge"
                        value={values.serviceSaloonCharge}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group id="serviceHomeCharge">
                      <Form.Label>Home Charge</Form.Label>
                      <Form.Control
                        type="number"
                        name="serviceHomeCharge"
                        value={values.serviceHomeCharge}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{ marginTop: "20px" }}>
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Modal.Body>
        </Modal>
        {/* <h5 style={{ color: 'white', marginTop: '20px' }}>Service Type</h5>
        {serviceType && (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Business Name</th>
                <th>Is Active</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {serviceType.map((service, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{service.businessName}</td>
                  <td>{service.isActive ? 'Yes' : 'No'}</td>
                  <td>{service.petMarketPrimaryDetail.name}</td>
                  <td>{service.petMarketPrimaryDetail.mobile}</td>
                  <td>{service.petMarketPrimaryDetail.email}</td>
                  <td>
                  <Button variant="primary" onClick={() => handleEditService(service)}>
                    <FontAwesomeIcon icon={faEdit} />
                  
                  </Button>
                  
                </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )} */}
      </Card.Body>
    </Card> 
  );
};

export default Petmedicinesdetails;
