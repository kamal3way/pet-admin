
import React from 'react';
import { Row, Col, Card, Container } from '@themesberg/react-bootstrap';


export default () => (
  <Container className="px-0">
    <Row>
      <Col xs={12} className="p-3">
        <Card>
          <Card.Body>
          <p className="fs-5 fw-bold">Let's Learn</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);
