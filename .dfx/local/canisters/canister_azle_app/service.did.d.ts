import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface MedicalAppointment {
  'id' : string,
  'createdAt' : [] | [bigint],
  'appointmentDate' : string,
  'updatedAt' : [] | [bigint],
  'reminderSent' : boolean,
  'patientName' : string,
  'doctorName' : string,
  'medicalRecord' : string,
  'isScheduled' : boolean,
}
export type _AzleResult = { 'Ok' : MedicalAppointment } |
  { 'Err' : string };
export type _AzleResult_1 = { 'Ok' : [] | [MedicalAppointment] } |
  { 'Err' : string };
export type _AzleResult_2 = { 'Ok' : Array<MedicalAppointment> } |
  { 'Err' : string };
export interface _SERVICE {
  'cancelAppointment' : ActorMethod<[string], _AzleResult>,
  'completeAppointment' : ActorMethod<[string], _AzleResult>,
  'deleteAppointment' : ActorMethod<[string], _AzleResult_1>,
  'getAppointment' : ActorMethod<[string], _AzleResult>,
  'getAppointments' : ActorMethod<[], _AzleResult_2>,
  'getCanceledAppointments' : ActorMethod<[], _AzleResult_2>,
  'getUpcomingAppointments' : ActorMethod<[number], _AzleResult_2>,
  'rescheduleAppointment' : ActorMethod<[string, string], _AzleResult>,
  'scheduleAppointment' : ActorMethod<[MedicalAppointment], _AzleResult>,
  'searchAppointments' : ActorMethod<[string], _AzleResult_2>,
  'sendReminder' : ActorMethod<[string], _AzleResult>,
  'updateAppointment' : ActorMethod<[string, MedicalAppointment], _AzleResult>,
  'updateMedicalRecord' : ActorMethod<[string, string], _AzleResult>,
}
