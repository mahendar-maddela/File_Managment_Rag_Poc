export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",  // e.g., Sep
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

