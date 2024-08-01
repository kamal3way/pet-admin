import React, { useState } from 'react';
import { Col, Row, Card, Form, Button, Modal } from "@themesberg/react-bootstrap";
import { Formik, FieldArray } from 'formik';
import { useLocation, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import Swal from 'sweetalert2';

const updateServices = async (values) => {
  const token1 = localStorage.getItem("token1");
  const accessToken = localStorage.getItem("accessToken");

  if (!values._id) {
    console.error("Error: _id is undefined");
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Error updating services",
      text: "_id is undefined",
      showConfirmButton: true,
    });
    return null;
  }

  try {
    console.log("Submitting data to API:", values);
    const res = await axios.put(
      `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/clinic_services/update-by-id/${values._id}`,
      {
        serviceType: [
          {
            serviceId: values.serviceId,
            clinicSaloonWorkingHour: values.clinicSaloonWorkingHour
          }
        ]
      },
      {
        headers: {
          "x-am-authorization": token1,
          "x-am-user-authorization": accessToken,
        },
      }
    );
    console.log("API response:", res);
    if (res.status === 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Services have been Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      return res.data; // Return the response data
    }
  } catch (error) {
    console.error("API error:", error); // Log any errors
    if (error.response && error.response.status === 400) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error updating services",
        text: error.response.data.errors.map(err => err.message).join(', '),
        showConfirmButton: true,
      });
    }
  }
  return null;
};


const HomeWorkingHoursComponent = ({ homeWorkingHours }) => (
  <div className="home-working-hours">
    <h5>Home Working Hours</h5>
    <table className="table table-dark">
      <thead>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Status</th>
          <th scope="col">Slots</th>
        </tr>
      </thead>
      <tbody>
        {homeWorkingHours?.map((hour, index) => (
          <tr key={index}>
            <td>{hour.day}</td>
            <td>{hour.isOpen ? 'Open' : 'Closed'}</td>
            <td>
              <ul className="list-unstyled">
                {hour.slot.map((slot, slotIndex) => (
                  <li key={slotIndex}>
                    {slotIndex + 1}. {slot.fromTime} - {slot.toTime}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ClinicSaloonWorkingHour = ({ clinicSaloonWorkingHour }) => (
  <div className="clinic-saloon-working-hours">
    <h5>Clinic Saloon Working Hours</h5>
    <table className="table table-dark">
      <thead>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Status</th>
          <th scope="col">Slots</th>
        </tr>
      </thead>
      <tbody>
        {clinicSaloonWorkingHour?.map((hour, index) => (
          <tr key={index}>
            <td>{hour.day}</td>
            <td>{hour.isOpen ? 'Open' : 'Closed'}</td>
            <td>
              <ul className="list-unstyled">
                {hour.slot.map((slot, slotIndex) => (
                  <li key={slotIndex}>
                    {slotIndex + 1}. {slot.fromTime} - {slot.toTime}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Vetservicedetails = () => {
  const location = useLocation();
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [isHomeWorkingHour, setIsHomeWorkingHour] = useState(true);

  const bankDetails = location?.state?.bankDetails || [];
  const personalDetails = location?.state?.personalDetails || {};
  const idProof = location?.state?.idProof || {};
  const serviceType = location?.state?.serviceType || [];
  const id = location?.state?._id;
  const homeWorkingHours = location?.state?.homeWorkingHours || [];
  const clinicSaloonWorkingHour = location?.state?.clinicSaloonWorkingHour || [];
  console.log(serviceType)

  const [editData, setEditData] = useState({
    _id: id,
    serviceId: serviceType[0]?.serviceId || '', // Assuming the service ID is the same as the _id
    bankName: bankDetails.map((item) => item.bankName).join(', '),
    accountHolderName: bankDetails.map((item) => item.accountHolderName).join(', '),
    accountNumber: bankDetails.map((item) => item.accountNumber).join(', '),
    ifscCode: bankDetails.map((item) => item.ifscCode).join(', '),
    upiID: bankDetails.map((item) => item.upiID).join(', '),
    pName: personalDetails.pName,
    pMobile: personalDetails.pMobile,
    pEmail: personalDetails.pEmail,
    iName: idProof.iName,
    iImage: idProof.iImage,
    businessName: serviceType.businessName,
    isOpen: serviceType[0]?.homeWorkingHours[0]?.isOpen,
    homeWorkingHours: serviceType[0]?.homeWorkingHours || [],
    clinicSaloonWorkingHour: serviceType[0]?.clinicSaloonWorkingHour || [],
    day: serviceType[0]?.homeWorkingHours[0]?.day,
  });

  const handleEdit = (hour, isHome) => {
    setSelectedHour(hour);
    setEditMode(true);
    setIsHomeWorkingHour(isHome);
  };

  const handleClose = () => {
    setEditMode(false);
    setSelectedHour(null);
  };

  const handleSave = async (values) => {
    const updatedData = await updateServices(values);
    if (updatedData) {
      setEditData((prevData) => ({
        ...prevData,
        homeWorkingHours: values.homeWorkingHours,
        // clinicSaloonWorkingHour: values.clinicSaloonWorkingHour
      }));
      setEditMode(false);
    }
  };

  const navigateBack = () => {
    history.goBack();
  };

  return (
    <>
      <Card border="light" className="bg-black shadow-sm mb-4">
        <Card.Body>
          <div>
            <FontAwesomeIcon
              style={{ height: '20px', width: "20px", marginBottom: "10px", color: "white" }}
              icon={faArrowLeft}
              onClick={navigateBack}
            />
          </div>
          <h5 style={{ color: "white" }}>Personal Details</h5>
          {editData && (
            <Formik
              initialValues={editData}
              onSubmit={(values) => {
                handleSave(values);
              }}
            >
              {({ values, handleChange, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group id="pName">
                        <Form.Label style={{ color: "white" }}>Personal Name</Form.Label>
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
        </Card.Body>
      </Card>

      <Card border="light" className="bg-black shadow-sm mb-4">
        <Card.Body>
          <h5 style={{ color: "white" }}>Home Working Hours</h5>
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Open</th>
                <th scope="col">From Time</th>
                <th scope="col">To Time</th>
                {/* <th scope="col">Edit</th> */}
              </tr>
            </thead>
            <tbody>
              {editData.homeWorkingHours?.map((hour, index) => (
                <tr key={index}>
                  <td>{hour.day}</td>
                  <td>{hour.isOpen ? "Yes" : "No"}</td>
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
                  {/* <td>
                      <Button variant="primary" onClick={() => handleEdit(hour, true)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>

      <Card border="light" className="bg-black shadow-sm mb-4">
        <Card.Body>
          <h5 style={{ color: "white" }}>Clinic Saloon Working Hours</h5>
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Open</th>
                <th scope="col">From Time</th>
                <th scope="col">To Time</th>
                {/* <th scope="col">Edit</th> */}
              </tr>
            </thead>
            <tbody>
              {editData.clinicSaloonWorkingHour?.map((hour, index) => (
                <tr key={index}>
                  <td>{hour.day}</td>
                  <td>{hour.isOpen ? "Yes" : "No"}</td>
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
                  {/* <td>
                      <Button variant="primary" onClick={() => handleEdit(hour, false)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>

      <Modal show={editMode} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit  Working Hours</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHour && (
            <Formik
              initialValues={selectedHour}
              onSubmit={(values) => {
                const updatedHours = {
                  ...editData,
                  homeWorkingHours: isHomeWorkingHour ?
                    editData.homeWorkingHours.map((hour) =>
                      hour.day === values.day ? values : hour
                    ) : editData.homeWorkingHours,
                  clinicSaloonWorkingHour: !isHomeWorkingHour ?
                    editData.clinicSaloonWorkingHour.map((hour) =>
                      hour.day === values.day ? values : hour
                    ) : editData.clinicSaloonWorkingHour
                };
                handleSave(updatedHours);
              }}
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
                      disabled
                    />
                  </Form.Group>
                  <Form.Group id="isOpen">
                    <Form.Label>Open</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="isOpen"
                      checked={values.isOpen}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <FieldArray
                    name="slot"
                    render={arrayHelpers => (
                      <div>
                        {values.slot.map((slot, index) => (
                          <div key={index} className="slot-entry">
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
                            {/* <Button
                                variant="danger"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove Slot
                              </Button> */}
                          </div>
                        ))}
                        {/* <Button
                            variant="primary"
                            onClick={() =>
                              arrayHelpers.push({ fromTime: '', toTime: '' })
                            }
                          >
                            Add Slot
                          </Button> */}
                      </div>
                    )}
                  />
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
