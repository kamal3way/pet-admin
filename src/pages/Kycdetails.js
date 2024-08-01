import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export const Kycdetails = () => {
  const location = useLocation();
  const [serviceType, setServiceType] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [formValues, setFormValues] = useState({
    kycStatus: '',
    kycRejectReason: '',
  });
  const [initialValues, setInitialValues] = useState({
    kycStatus: '',
    kycRejectReason: '',
    serviceName: '',
    serviceCategory: '',
  });
  const history = useHistory();
  const navigateBack = () => {
    history.goBack();
  };

  useEffect(() => {
    if (location.state) {
      setServiceType(location.state.serviceType);
    }
  }, [location]);

  const handleEditClinicHour = (service, index) => {
    setSelectedService(service);
    setSelectedIndex(index);
    setFormValues({
      kycStatus: service.kycStatus,
      kycRejectReason: service.kycRejectReason,
    });
    setInitialValues({
      kycStatus: service.kycStatus,
      kycRejectReason: service.kycRejectReason,
      serviceName: service.serviceId ? service.serviceId.serviceName : '',
      serviceCategory: service.serviceId ? service.serviceId.serviceCategory : '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token1 = localStorage.getItem("token1");
      const accessToken = localStorage.getItem("accessToken");

      const updateData = {
        kycStatus: formValues.kycStatus,
        kycRejectReason: formValues.kycRejectReason,
      };

      const response = await axios.post(
        `https://pets.dev.savaapi.com/api/custom-api/dev1/clinic/update-clinic-service`,
        {
          _id: selectedService._id,
          serviceId: selectedService.serviceId._id,
          updateData: updateData,
        },
        {
          headers: {
            "x-am-authorization": token1,
            "x-am-user-authorization": accessToken,
          },
        }
      );

      console.log('Update response:', response.data);
      setShowModal(false);

      // Update the specific item in the serviceType state
      setServiceType((prevServiceType) =>
        prevServiceType.map((item, index) =>
          index === selectedIndex
            ? { ...item, kycStatus: formValues.kycStatus, kycRejectReason: formValues.kycRejectReason }
            : item
        )
      );

    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  };

  return (
    <div>
      <h4>Kyc Details</h4>

      <table className="table table-dark" style={{ marginTop: "20px" }}>
        <thead>

          <tr>
            <th scope="col">#</th>
            <th scope="col">KYC Status</th>
            <th scope="col">KYC Reject Reason</th>
            <th scope="col">Service Name</th>
            <th scope="col">Service Category</th>
            <th scope="col">Action</th>

          </tr>

        </thead>
        <tbody>
          {Array.isArray(serviceType) ? (
            serviceType.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.kycStatus}</td>
                <td>{item.kycRejectReason}</td>
                <td>{item.serviceId ? item.serviceId.serviceName : "N/A"}</td>
                <td>{item.serviceId ? item.serviceId.serviceCategory : "N/A"}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEditClinicHour(item, index)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <th scope="row">1</th>
              <td>{serviceType.kycStatus}</td>
              <td>{serviceType.kycRejectReason}</td>
              <td>{serviceType.serviceId ? serviceType.serviceId.serviceName : "N/A"}</td>
              <td>{serviceType.serviceId ? serviceType.serviceId.serviceCategory : "N/A"}</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="kycStatus">
              <Form.Label>KYC Status</Form.Label>
              <Form.Select
                name="kycStatus"
                value={formValues.kycStatus}
                onChange={handleChange}
              >
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
                <option value="APPROVED">APPROVED</option>
              </Form.Select>
            </Form.Group>
            <br />
            {formValues.kycStatus === 'REJECTED' && (
              <Form.Group id="kycRejectReason">
                <Form.Label>KYC Reject Reason</Form.Label>
                <Form.Control
                  type="text"
                  name="kycRejectReason"
                  value={formValues.kycRejectReason}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            <br />
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Kycdetails;