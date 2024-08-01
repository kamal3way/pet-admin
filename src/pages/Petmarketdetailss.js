import React, { useState } from 'react';
import { Col, Row, Card, Form } from "@themesberg/react-bootstrap";
import { Formik } from 'formik';
import { useLocation, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const Petmarketdetailss = () => {
    const location = useLocation();
    const history = useHistory();
    const orderLocation = location?.state?.orderLocation || {};
    const orderDetails = location?.state?.orderDetails[0] || {};

    const [editData] = useState({
        buildingName: orderLocation.buildingName,
        landmark: orderLocation.landmark,
        pinCode: orderLocation.pinCode,
        city: orderLocation.city,
        state: orderLocation.state,
        addressType: orderLocation.addressType,
        latitude: orderLocation.latitude,
        longitude: orderLocation.longitude,
        commissionPercentage: orderDetails.commissionPercentage,
        commissionCharge: orderDetails.commissionCharge,
        productPrice: orderDetails.productPrice,
        totalAmount: orderDetails.totalAmount,
        productQuantity: orderDetails.productQuantity,
    });

    const navigateBack = () => {
        history.goBack();
    };

    return (
        <Row>
            <Col md={6}>
                <Card border="light" className="bg-black shadow-sm mb-4">
                    <Card.Body>
                        <div>
                            <FontAwesomeIcon
                                style={{ height: '20px', width: "20px", marginBottom: "10px", color: "white" }}
                                icon={faArrowLeft}
                                onClick={navigateBack}
                            />
                        </div>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                            <h5 className="mb-4" style={{ color: "white" }}>Order Location</h5>
                        </div>
                        <Formik
                            initialValues={editData}
                            onSubmit={(values) => {
                                console.log("Form values:", values);
                                // Submit form values
                            }}
                        >
                            {({
                                values,
                                handleChange,
                                handleSubmit,
                            }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group id="buildingName">
                                                <Form.Label style={{ color: "white" }}>Building Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="buildingName"
                                                    name="buildingName"
                                                    value={values.buildingName}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="landmark">
                                                <Form.Label style={{ color: "white" }}>Landmark</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="landmark"
                                                    name="landmark"
                                                    value={values.landmark}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="pinCode">
                                                <Form.Label style={{ color: "white" }}>Pin Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="pinCode"
                                                    name="pinCode"
                                                    value={values.pinCode}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="city">
                                                <Form.Label style={{ color: "white" }}>City</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="city"
                                                    name="city"
                                                    value={values.city}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="state">
                                                <Form.Label style={{ color: "white" }}>State</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="state"
                                                    name="state"
                                                    value={values.state}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="addressType">
                                                <Form.Label style={{ color: "white" }}>Address Type</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="addressType"
                                                    name="addressType"
                                                    value={values.addressType}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="latitude">
                                                <Form.Label style={{ color: "white" }}>Latitude</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="latitude"
                                                    name="latitude"
                                                    value={values.latitude}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="longitude">
                                                <Form.Label style={{ color: "white" }}>Longitude</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="longitude"
                                                    name="longitude"
                                                    value={values.longitude}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={6}>
                <Card border="light" className="bg-black shadow-sm mb-4">
                    <Card.Body>
                        <div>
                            {/* <FontAwesomeIcon
                                style={{ height: '20px', width: "20px", marginBottom: "10px", color: "white" }}
                                icon={faArrowLeft}
                                onClick={navigateBack}
                            /> */}
                        </div>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                            <h5 className="mb-4" style={{ color: "white" }}>Order Details</h5>
                        </div>
                        <Formik
                            initialValues={editData}
                            onSubmit={(values) => {
                                console.log("Form values:", values);
                                // Submit form values
                            }}
                        >
                            {({
                                values,
                                handleChange,
                                handleSubmit,
                            }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group id="commissionPercentage">
                                                <Form.Label style={{ color: "white" }}>Commission Percentage</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="commissionPercentage"
                                                    name="commissionPercentage"
                                                    value={values.commissionPercentage}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="commissionCharge">
                                                <Form.Label style={{ color: "white" }}>Commission Charge</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="commissionCharge"
                                                    name="commissionCharge"
                                                    value={values.commissionCharge}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="productPrice">
                                                <Form.Label style={{ color: "white" }}>Product Price</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="productPrice"
                                                    name="productPrice"
                                                    value={values.productPrice}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="totalAmount">
                                                <Form.Label style={{ color: "white" }}>Total Amount</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="totalAmount"
                                                    name="totalAmount"
                                                    value={values.totalAmount}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group id="productQuantity">
                                                <Form.Label style={{ color: "white" }}>Product Quantity</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="productQuantity"
                                                    name="productQuantity"
                                                    value={values.productQuantity}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};
