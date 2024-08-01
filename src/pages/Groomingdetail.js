import React from "react";
import { Form, Col, Row, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";

export const Groomingdetail = () => {

  const location = useLocation();
  const serviceLocation = location.state?.serviceLocation;
  const history = useHistory();

  const navigateBack = () => {
    history.goBack();
  };
  return (
    <Card className="bg-dark text-white">
      <Card.Body>
      <div>
          <FontAwesomeIcon
            style={{ height: '20px', width: "20px", marginBottom: "10px", color: "white" }}
            icon={faArrowLeft}
            onClick={navigateBack}
          />
        </div>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group id="buildingName">
                <Form.Label>Building Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Building Name"
                  name="buildingName"
                  value={serviceLocation?.buildingName}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group id="landmark">
                <Form.Label>Landmark</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Landmark"
                  name="landmark"
                  value={serviceLocation.landmark}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group id="pinCode">
                <Form.Label>Pin Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Pin Code"
                  name="pinCode"
                  value={serviceLocation.pinCode}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group id="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  name="city"
                  value={serviceLocation.city}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group id="state">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="State"
                  name="state"
                  value={serviceLocation.state}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group id="addressType">
                <Form.Label>Address Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address Type"
                  name="addressType"
                  value={serviceLocation.addressType}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group id="latitude">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Latitude"
                  name="latitude"
                  value={serviceLocation.latitude}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group id="longitude">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Longitude"
                  name="longitude"
                  value={serviceLocation.longitude}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Groomingdetail