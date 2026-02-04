export default function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div
        className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-main-blue"
        role="status"
        aria-live="polite">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
