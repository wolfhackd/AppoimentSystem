export function timeToMinutes(timeString: string): number {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(timeString)) {
    throw new Error("Invalid time format (expected HH:MM)");
  }

  const hours = Number(timeString.slice(0, 2));
  const minutes = Number(timeString.slice(3, 5));
  return (hours * 60) + minutes;
}