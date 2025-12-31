import { Spinner } from "react-bootstrap";

export default function Loading({ text = "Loading..." }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" />
      <span className="ms-2 text-muted">{text}</span>
    </div>
  );
}
