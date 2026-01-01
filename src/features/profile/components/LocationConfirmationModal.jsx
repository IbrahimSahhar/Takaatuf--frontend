import { useMemo, useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

/*
  Props:
 - show: boolean
 - reason: "MISMATCH" | "UNKNOWN"
 - onConfirm: (choice: "IN_GAZA" | "OUTSIDE_GAZA") => Promise<void> | void
 - onClose: () => void  (optional: if you want to allow closing)
 - allowClose: boolean  (default false)  <-- acceptance criteria requires an explicit choice
 */
export default function LocationConfirmationModal({
  show,
  reason = "UNKNOWN",
  onConfirm,
  onClose,
  allowClose = false,
}) {
  const [choice, setChoice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const copy = useMemo(() => {
    if (reason === "MISMATCH") {
      return {
        title: "Confirm your location",
        message:
          "We detected you may be in/near Gaza based on your network. Please confirm your location.",
      };
    }
    return {
      title: "Confirm your location",
      message:
        "We couldn’t determine your location from your network. Please confirm your location to continue.",
    };
  }, [reason]);

  const handleConfirm = async () => {
    setError("");
    if (!choice) return;

    try {
      setSubmitting(true);
      await onConfirm(choice);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Boolean(choice) && !submitting;

  return (
    <Modal
      show={show}
      onHide={allowClose ? onClose : undefined}
      backdrop="static"
      keyboard={allowClose}
      centered
    >
      <Modal.Header closeButton={allowClose}>
        <Modal.Title>{copy.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">{copy.message}</p>

        {error && (
          <Alert variant="danger" className="py-2">
            {error}
          </Alert>
        )}

        <Form>
          <Form.Check
            type="radio"
            name="gaza_choice"
            id="in_gaza"
            label="I am in Gaza."
            value="IN_GAZA"
            checked={choice === "IN_GAZA"}
            onChange={(e) => setChoice(e.target.value)}
            disabled={submitting}
            className="mb-2"
          />

          <Form.Check
            type="radio"
            name="gaza_choice"
            id="outside_gaza"
            label="I am outside Gaza."
            value="OUTSIDE_GAZA"
            checked={choice === "OUTSIDE_GAZA"}
            onChange={(e) => setChoice(e.target.value)}
            disabled={submitting}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {allowClose && (
          <Button
            variant="outline-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}

        <Button variant="primary" onClick={handleConfirm} disabled={!canSubmit}>
          {submitting ? (
            <>
              <Spinner size="sm" className="me-2" />
              Confirming...
            </>
          ) : (
            "Confirm"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
