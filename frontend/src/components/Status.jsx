// Loading and error boxes used while products load.
export function Loading({ text }) {
  return (
    <div className="status-box">
      <div className="spinner" aria-hidden="true"></div>
      <div>{text || "Loading..."}</div>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="status-box error-box" role="alert">
      <div className="status-title">We could not load the products</div>
      <div className="muted">{message}</div>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>Try again</button>
      )}
    </div>
  );
}
