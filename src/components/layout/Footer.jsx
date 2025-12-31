import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="border-top bg-white">
      <Container
        fluid
        className="py-3 d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center"
      >
        <div className="text-muted small">
          © {new Date().getFullYear()} TAKAATUF. All rights reserved.
        </div>

        <div className="d-flex gap-3 small">
          <a href="#" className="text-decoration-none">
            Terms of Service
          </a>
          <a href="#" className="text-decoration-none">
            Privacy Policy
          </a>
        </div>
      </Container>
    </footer>
  );
}
