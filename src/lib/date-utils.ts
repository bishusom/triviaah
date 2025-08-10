export function formatPostDate(dateInput: string | Date) {
  // Handle both string dates and Date objects
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  return {
    display: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    iso: date.toISOString(),
    raw: date
  } as {
    display: string;
    iso: string;
    raw: Date;
  };
}