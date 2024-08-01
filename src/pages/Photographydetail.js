import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';

export const Photographydetail = () => {
  const location = useLocation();
  const history = useHistory();
  const { service, serviceLocation } = location.state || {};

  const navigateBack = () => {
    history.goBack();
  };

  return (
    <div>
      <Card border="light" className="bg-black shadow-sm mb-4">
        <Card.Body>
          <div>
            <FontAwesomeIcon
              style={{ height: '20px', width: '20px', marginBottom: '10px', color: 'white' }}
              icon={faArrowLeft}
              onClick={navigateBack}
            />
          </div>
          <h5 style={{ color: 'white' }}>Service Details</h5>
          {service && service.length > 0 ? (
            service.map((serviceItem, index) => (
              <Formik
                key={index}
                initialValues={serviceItem}
                onSubmit={(values) => {
                  console.log('Form Values:', values);
                }}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group id="serviceTitle">
                          <Form.Label style={{ color: 'white' }}>Service Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="serviceTitle"
                            value={values.serviceTitle}
                            onChange={handleChange}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group id="serviceDescription">
                          <Form.Label style={{ color: 'white' }}>Service Description</Form.Label>
                          <Form.Control
                            type="text"
                            name="serviceDescription"
                            value={values.serviceDescription}
                            onChange={handleChange}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group id="serviceCharge">
                          <Form.Label style={{ color: 'white' }}>Service Charge</Form.Label>
                          <Form.Control
                            type="text"
                            name="serviceCharge"
                            value={values.serviceCharge}
                            onChange={handleChange}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group id="commissionPercentage">
                          <Form.Label style={{ color: 'white' }}>Commission Percentage</Form.Label>
                          <Form.Control
                            type="text"
                            name="commissionPercentage"
                            value={values.commissionPercentage}
                            onChange={handleChange}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group id="commissionCharge">
                          <Form.Label style={{ color: 'white' }}>Commission Charge</Form.Label>
                          <Form.Control
                            type="text"
                            name="commissionCharge"
                            value={values.commissionCharge}
                            onChange={handleChange}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group id="totalAmount">
                          <Form.Label style={{ color: 'white' }}>Total Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="totalAmount"
                            value={values.totalAmount}
                            onChange={handleChange}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            ))
          ) : (
            <p style={{ color: 'white' }}>No service details available</p>
          )}
        </Card.Body>
      </Card>

      {serviceLocation && (
        <Card border="light" className="bg-black shadow-sm mb-4">
          <Card.Body>
            <h5 style={{ color: 'white' }}>Service Location Details</h5>
            <Row>
              <Col md={6}>
                <Form.Group id="buildingName">
                  <Form.Label style={{ color: 'white' }}>Building Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="buildingName"
                    value={serviceLocation.buildingName}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group id="landmark">
                  <Form.Label style={{ color: 'white' }}>Landmark</Form.Label>
                  <Form.Control
                    type="text"
                    name="landmark"
                    value={serviceLocation.landmark}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group id="pinCode">
                  <Form.Label style={{ color: 'white' }}>Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="pinCode"
                    value={serviceLocation.pinCode}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group id="city">
                  <Form.Label style={{ color: 'white' }}>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={serviceLocation.city}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group id="state">
                  <Form.Label style={{ color: 'white' }}>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={serviceLocation.state}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group id="addressType">
                  <Form.Label style={{ color: 'white' }}>Address Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="addressType"
                    value={serviceLocation.addressType}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group id="latitude">
                  <Form.Label style={{ color: 'white' }}>Latitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="latitude"
                    value={serviceLocation.latitude}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group id="longitude">
                  <Form.Label style={{ color: 'white' }}>Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="longitude"
                    value={serviceLocation.longitude}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Photographydetail;
