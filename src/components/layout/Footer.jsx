import { Container } from "react-bootstrap";

/* 
 Footer component rendered across application layouts.
 Provides legal information and secondary navigation links.
*/
export default function Footer() {
  return (
    <footer className="border-top bg-white">
      <Container
        fluid
        className="py-3 d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center"
      >
        {/* 
         Dynamic copyright year to avoid manual updates.
        */}
        <div className="text-muted small">
          © {new Date().getFullYear()} TAKAATUF. All rights reserved.
        </div>

        {/* 
         Legal and policy links.
         Currently placeholders and expected to be replaced with actual routes or external URLs.
        */}
        <div className="d-flex gap-3 small">
          <a href="#" className="footer-link text-decoration-none">
            Terms of Service
          </a>
          <a href="#" className="footer-link text-decoration-none">
            Privacy Policy
          </a>
        </div>
      </Container>
    </footer>
  );
}
