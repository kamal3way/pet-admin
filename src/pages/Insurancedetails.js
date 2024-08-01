import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Card, Row, Col, Form, Table, Button, Modal ,CardBody} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FieldArray, Formik } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2';

export const Insurancedetails = () => {
  const location = useLocation();
  const [editMode, setEditMode] = useState(false);

  const history = useHistory();
  const [selectedHour, setSelectedHour] = useState(null);
  const [isHomeWorkingHour, setIsHomeWorkingHour] = useState(true);

  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedClinicHour, setSelectedClinicHour] = useState(null);
  const [selectedHomeHour, setSelectedHomeHour] = useState(null);
  const { personalDetails, serviceType ,serviceAddress,items} = location.state || {};
//   const { editData } = location.state || {};
const [editData, setEditData] = useState({
    clinicSaloonWorkingHour: location.state.clinicSaloonWorkingHour || [], // update with actual data
  });
  const firstService = serviceType[0]; 
  useEffect(() => {
    console.log('Location State:', location.state);
    console.log('Service Type:', serviceType);
  }, [location.state]);

  const navigateBack = () => {
    history.goBack();
  };

  // const handleSaveClinicHour = (values) => {
  //   setShowClinicModal(false);
  // };

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

  // const handleEditClinicHour = (hour, index) => {
  //   setSelectedClinicHour(hour);
  //   // setSelectedClinicHourIndex(index);
  //   setShowClinicModal(true);
  // };
  const handleSave = async (values) => {
    const updatedData = await handleSaveClinicHour(values);
    if (updatedData) {
      setEditData((prevData) => ({
        ...prevData,
        homeWorkingHours: values.homeWorkingHours,
        clinicSaloonWorkingHour: values.clinicSaloonWorkingHour
      }));
      setEditMode(false);
    }
  }
  const handleEditClinicHour = (service) => {
    setSelectedClinicHour(service.serviceAddress);
    setShowClinicModal(true);
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
        title: "Services have been Updated Successfully",
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
                    <Button variant="primary" type="submit" style={{ marginTop: "20px" }}>
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Modal.Body>
        </Modal>
        
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
      </Card.Body>
      <h5 style={{ color: 'white', marginTop: '20px' }}>Service Address</h5>
        {serviceType && serviceType.map((service, index) => (
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
                <Button variant="primary" onClick={() => handleEditClinicHour(service)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        ))}
        
     
        <Card border="light" className="bg-black shadow-sm mb-4">
  <Card.Body>
    <h5 style={{ color: "white" }}>Clinic Working Hours</h5>
    <table className="table table-dark">
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
        {editData.clinicSaloonWorkingHour.map((hour, index) => (
          <tr key={index}>
            <td>{hour.day}</td>
            <td style={{ color: hour.isOpen ? 'green' : 'red' }}>
              {hour.isOpen ? 'Open' : 'Closed'}
            </td>
            <td>
              {hour.slot[0].fromTime} {/ display the first fromTime /}
            </td>
            <td>
              {hour.slot[0].toTime} {/ display the first toTime /}
            </td>
            <td>
              <Button variant="primary" onClick={() => handleEditClinicHour(hour, index)}>
                <FontAwesomeIcon icon={faEdit} />
                Update
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card.Body>
</Card>



    </Card>
    
    
  );
};

export default Insurancedetails;
