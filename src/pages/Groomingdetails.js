import React, { useState } from 'react';
import { Col, Row, Card, Form, Table, Button, Modal } from "@themesberg/react-bootstrap";
import { Formik, FieldArray } from 'formik';
import { useLocation, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import Swal from 'sweetalert2';

export const Groomingdetails = () => {
  const location = useLocation();
  const history = useHistory();

  const { item } = location.state || {};
  const { serviceType = [] } = item || {};

  const [editData, setEditData] = useState({
    homeWorkingHours: item?.serviceType[0]?.homeWorkingHours || [],
    service: item?.serviceType[0]?.service || [],
    clinicSaloonWorkingHour: item?.serviceType[0]?.clinicSaloonWorkingHour || []
  });

  const [showModal, setShowModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedHomeHour, setSelectedHomeHour] = useState(null);
  const [selectedClinicHour, setSelectedClinicHour] = useState(null);

  const navigateBack = () => {
    history.goBack();
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleEditHomeHour = (hour) => {
    setSelectedHomeHour(hour);
    setShowHomeModal(true);
  };

  const handleEditClinicHour = (hour) => {
    setSelectedClinicHour(hour);
    setShowClinicModal(true);
  };

  const handleSaveService = async (values) => {
    // await updateServices(values);
    setShowModal(false);
  };

  const handleSaveHomeHour = (values) => {
    // Handle saving home working hours
    setShowHomeModal(false);
  };

  const handleSaveClinicHour = (values) => {
    // Handle saving clinic working hours
    setShowClinicModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowHomeModal(false);
    setShowClinicModal(false);
  };

  return (
    <>
      <Card border="light" className="bg-black shadow-sm mb-4">
        <Card.Body>
          <h5 style={{ color: "white" }}>Services</h5>
          {serviceType.map((service, index) => (
            <div key={index} className="mb-4">
              <h6 style={{ color: "white" }}>{service.businessName}</h6>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Service Title</th>
                    <th>Service Description</th>
                    <th>Service Saloon Charge</th>
                    <th>Service Home Charge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {service.service.map((svc, svcIndex) => (
                    <Formik
                      key={svcIndex}
                      initialValues={svc}
                      onSubmit={(values) => handleSaveService(values)}
                    >
                      {({ values, handleChange, handleSubmit }) => (
                        <tr>
                          <td>
                            <Form.Control
                              type="text"
                              name="serviceTitle"
                              value={values.serviceTitle}
                              onChange={handleChange}
                              disabled
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name="serviceDescription"
                              value={values.serviceDescription}
                              onChange={handleChange}
                              disabled
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name="serviceSaloonCharge"
                              value={values.serviceSaloonCharge}
                              onChange={handleChange}
                              disabled
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name="serviceHomeCharge"
                              value={values.serviceHomeCharge}
                              onChange={handleChange}
                              disabled
                            />
                          </td>
                          <td>
                            <Button variant="primary" onClick={() => handleEditService(values)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          </td>
                        </tr>
                      )}
                    </Formik>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </Card.Body>
      </Card>

      <Card border="light" className="bg-black shadow-sm mb-4">
        <Card.Body>
          <h5 style={{ color: "white" }}>Home Working Hours</h5>
          {editData.homeWorkingHours.length > 0 ? (
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
                {editData.homeWorkingHours.map((hour, index) => (
                  <tr key={index}>
                    <td>{hour.day}</td>
                    <td style={{ color: hour.isOpen ? 'green' : 'red' }}>{hour.isOpen ? 'Open' : 'Closed'}</td>
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
                      <Button variant="primary" onClick={() => handleEditHomeHour(hour)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "white" }}>No working hours available</p>
          )}
        </Card.Body>
      </Card>

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
                    {hour.slot[0]?.fromTime || 'N/A'}
                  </td>
                  <td>
                    {hour.slot[0]?.toTime || 'N/A'}
                  </td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditClinicHour(hour)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <Formik
              initialValues={selectedService}
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
                    <Form.Label>Service Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="serviceDescription"
                      value={values.serviceDescription}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group id="serviceSaloonCharge">
                    <Form.Label>Service Saloon Charge</Form.Label>
                    <Form.Control
                      type="text"
                      name="serviceSaloonCharge"
                      value={values.serviceSaloonCharge}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group id="serviceHomeCharge">
                    <Form.Label>Service Home Charge</Form.Label>
                    <Form.Control
                      type="text"
                      name="serviceHomeCharge"
                      value={values.serviceHomeCharge}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showHomeModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Home Working Hour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHomeHour && (
            <Formik
              initialValues={selectedHomeHour}
              onSubmit={(values) => handleSaveHomeHour(values)}
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
                    render={(arrayHelpers) => (
                      <>
                        {values.slot && values.slot.length > 0 ? (
                          values.slot.map((slot, index) => (
                            <div key={index}>
                              <Form.Group id={`slot[${index}].fromTime`}>
                                <Form.Label>From Time</Form.Label>
                                <Form.Control
                                  type="text"
                                  name={`slot[${index}].fromTime`}
                                  value={slot.fromTime}
                                  onChange={handleChange}
                                />
                              </Form.Group>
                              <Form.Group id={`slot[${index}].toTime`}>
                                <Form.Label>To Time</Form.Label>
                                <Form.Control
                                  type="text"
                                  name={`slot[${index}].toTime`}
                                  value={slot.toTime}
                                  onChange={handleChange}
                                />
                              </Form.Group>
                              <Button
                                variant="danger"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() =>
                              arrayHelpers.push({
                                fromTime: "",
                                toTime: ""
                              })
                            }
                          >
                            Add Slot
                          </Button>
                        )}
                      </>
                    )}
                  />
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showClinicModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Clinic Working Hour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClinicHour && (
            <Formik
              initialValues={selectedClinicHour}
              onSubmit={(values) => handleSaveClinicHour(values)}
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
                    render={(arrayHelpers) => (
                      <>
                        {values.slot && values.slot.length > 0 ? (
                          values.slot.map((slot, index) => (
                            <div key={index}>
                              <Form.Group id={`slot[${index}].fromTime`}>
                                <Form.Label>From Time</Form.Label>
                                <Form.Control
                                  type="text"
                                  name={`slot[${index}].fromTime`}
                                  value={slot.fromTime}
                                  onChange={handleChange}
                                />
                              </Form.Group>
                              <Form.Group id={`slot[${index}].toTime`}>
                                <Form.Label>To Time</Form.Label>
                                <Form.Control
                                  type="text"
                                  name={`slot[${index}].toTime`}
                                  value={slot.toTime}
                                  onChange={handleChange}
                                />
                              </Form.Group>
                              <Button
                                variant="danger"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() =>
                              arrayHelpers.push({
                                fromTime: "",
                                toTime: ""
                              })
                            }
                          >
                            Add Slot
                          </Button>
                        )}
                      </>
                    )}
                  />
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Groomingdetails;
