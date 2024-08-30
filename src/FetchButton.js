import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./FetchButton.css";


function FetchButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authorizationCode, setAuthorizationCode] = useState(null);

  const handleButtonClick = () => {
    const authorizationUrl =
      "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=https://localhost:3000/callback&client_id=bc0b0787-665e-4484-97a2-c9ad07044382&state=1234567&aud=https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4&scope=Patient.Read+Patient.Search+CarePlan.Read+CarePlan.Search+Condition.Read+Observation.Read";

    window.location.href = authorizationUrl;
  };

  const handleSubmit = () => {};
   const setEmail = () => {};

    const setPassword = () => {};

     




  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    if (code) {
      setAuthorizationCode(code);
    }
  }, [location.search]);

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <div>
            <button className="w-100" onClick={handleButtonClick}>
              Authorize with Epic
            </button>
            {authorizationCode && (
              <div>Authorization Code: {authorizationCode}</div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default FetchButton;
