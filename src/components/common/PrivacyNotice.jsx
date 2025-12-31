import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PrivacyNotice({
  text = "We use this information to improve matching.",
  to = "/privacy",
}) {
  return (
    <Form.Text className="text-muted">
      {text}{" "}
      <Link to={to} className="text-decoration-none">
        Privacy
      </Link>
    </Form.Text>
  );
}
