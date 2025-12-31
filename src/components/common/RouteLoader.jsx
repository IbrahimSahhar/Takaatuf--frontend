import { Container, Spinner } from "react-bootstrap";

export default function RouteLoader() {
  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Spinner
        animation="border"
        role="status"
        variant="primary"
        className="mb-3"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>

      <div className="text-muted fw-semibold">Loading page, please wait...</div>
    </Container>
  );
}
