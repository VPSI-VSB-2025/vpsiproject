export function formatDateToCzech(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
