export interface Data {
    latitude: number | null;
    longitude: number | null;
    measurementValues: { [parameterId: string]: number };
    time: string | null;
    date: string | null;
    deviceId: number | null;
  }

export interface FormErrors {
  [key: string]: string;
}
