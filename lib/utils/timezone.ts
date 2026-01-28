import { find } from "geo-tz";

export function getTimezoneFromCoordinates(lat: number, lng: number): string {
  const timezones = find(lat, lng);
  return timezones[0] || "UTC";
}

export function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
