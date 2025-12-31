import { Button } from "react-bootstrap";

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to display.",
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <div className="text-center py-5 text-muted">
      {icon && <div className="mb-3 fs-1">{icon}</div>}
      <h5>{title}</h5>
      <p className="mb-3">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
