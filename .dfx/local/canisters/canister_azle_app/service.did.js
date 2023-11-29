export const idlFactory = ({ IDL }) => {
  const MedicalAppointment = IDL.Record({
    'id' : IDL.Text,
    'createdAt' : IDL.Opt(IDL.Nat64),
    'appointmentDate' : IDL.Text,
    'updatedAt' : IDL.Opt(IDL.Nat64),
    'reminderSent' : IDL.Bool,
    'patientName' : IDL.Text,
    'doctorName' : IDL.Text,
    'medicalRecord' : IDL.Text,
    'isScheduled' : IDL.Bool,
  });
  const _AzleResult = IDL.Variant({
    'Ok' : MedicalAppointment,
    'Err' : IDL.Text,
  });
  const _AzleResult_1 = IDL.Variant({
    'Ok' : IDL.Opt(MedicalAppointment),
    'Err' : IDL.Text,
  });
  const _AzleResult_2 = IDL.Variant({
    'Ok' : IDL.Vec(MedicalAppointment),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'cancelAppointment' : IDL.Func([IDL.Text], [_AzleResult], []),
    'completeAppointment' : IDL.Func([IDL.Text], [_AzleResult], []),
    'deleteAppointment' : IDL.Func([IDL.Text], [_AzleResult_1], []),
    'getAppointment' : IDL.Func([IDL.Text], [_AzleResult], ['query']),
    'getAppointments' : IDL.Func([], [_AzleResult_2], ['query']),
    'getCanceledAppointments' : IDL.Func([], [_AzleResult_2], ['query']),
    'getUpcomingAppointments' : IDL.Func(
        [IDL.Float64],
        [_AzleResult_2],
        ['query'],
      ),
    'rescheduleAppointment' : IDL.Func([IDL.Text, IDL.Text], [_AzleResult], []),
    'scheduleAppointment' : IDL.Func([MedicalAppointment], [_AzleResult], []),
    'searchAppointments' : IDL.Func([IDL.Text], [_AzleResult_2], ['query']),
    'sendReminder' : IDL.Func([IDL.Text], [_AzleResult], []),
    'updateAppointment' : IDL.Func(
        [IDL.Text, MedicalAppointment],
        [_AzleResult],
        [],
      ),
    'updateMedicalRecord' : IDL.Func([IDL.Text, IDL.Text], [_AzleResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
