export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface BaseEntry {
  id: string;
  date: string;
  specialist: string;
  description: string;
  diagnosisCodes?: Array<Diagnosis['code']>; // DiagnosesEntry['code'][];
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
  type: "OccupationalHealthcare";
}

export interface HospitalEntry extends BaseEntry {
  discharge: {
    date: string;
    criteria: string;
  }
  type: "Hospital"
}

export interface HealthCheckEntry extends BaseEntry {
  healthCheckRating?: HealthCheckRating;
  type: "HealthCheck";
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;


export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;