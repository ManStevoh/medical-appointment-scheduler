// Import necessary modules and libraries
import {
    $query,
    $update,
    Record,
    StableBTreeMap,
    Vec,
    match,
    Result,
    nat64,
    ic,
    Opt,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Define the structure of a Medical Appointment
type MedicalAppointment = Record<{
    id: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    isScheduled: boolean;
    reminderSent: boolean;
    medicalRecord: string;
    createdAt: Opt<nat64>;
    updatedAt: Opt<nat64>;
}>;

// Initialize a storage mechanism for Medical Appointments
const appointmentStorage = new StableBTreeMap<string, MedicalAppointment>(0, 44, 1024);

// Query to search for appointments based on a query string
$query
export function searchAppointments(query: string): Result<Vec<MedicalAppointment>, string> {
    try {
        const lowerCaseQuery = query.toLowerCase();
        // Filter appointments based on patient or doctor names
        const filteredAppointments = appointmentStorage.values().filter(
            (appointment) =>
                appointment.patientName.toLowerCase().includes(lowerCaseQuery) ||
                appointment.doctorName.toLowerCase().includes(lowerCaseQuery)
        );
        return Result.Ok(filteredAppointments);
    } catch (error) {
        return Result.Err(`Error searching for appointments: ${error}`);
    }
}

// Update to schedule a new Medical Appointment
$update
export function scheduleAppointment(appointment: MedicalAppointment): Result<MedicalAppointment, string> {
    try {
        // Generate a unique ID for the appointment using uuidv4
        appointment.id = uuidv4();
        // Set initial values for scheduling
        appointment.isScheduled = true;
        appointment.reminderSent = false;
        // Set creation and update timestamps
        appointment.createdAt = Opt.Some(ic.time());
        appointment.updatedAt = Opt.Some(ic.time());

        // Validate the appointment object for required fields
        if (!appointment.patientName || !appointment.doctorName || !appointment.appointmentDate) {
            return Result.Err('Missing required fields in the appointment object');
        }

        // Add the appointment to appointmentStorage
        appointmentStorage.insert(appointment.id, appointment);

        return Result.Ok(appointment);
    } catch (error) {
        return Result.Err(`Error scheduling appointment: ${error}`);
    }
}

// Update to cancel an existing Medical Appointment
$update
export function cancelAppointment(id: string): Result<MedicalAppointment, string> {
    return match(appointmentStorage.get(id), {
        Some: (appointment) => {
            if (!appointment.isScheduled) {
                return Result.Err<MedicalAppointment, string>(`Appointment with id=${id} is already canceled`);
            }

            // Create a new appointment with isScheduled set to false
            const canceledAppointment: MedicalAppointment = { ...appointment, isScheduled: false };
            appointmentStorage.insert(id, canceledAppointment);

            return Result.Ok(canceledAppointment);
        },
        None: () => Result.Err<MedicalAppointment, string>(`Appointment with id=${id} not found`),
    }) as Result<MedicalAppointment, string>;
}

// Update to send a reminder for a scheduled Medical Appointment
$update
export function sendReminder(id: string): Result<MedicalAppointment, string> {
    return match(appointmentStorage.get(id), {
        Some: (appointment) => {
            if (!appointment.isScheduled || appointment.reminderSent) {
                return Result.Err<MedicalAppointment, string>(`Reminder for appointment with id=${id} is not applicable`);
            }

            // Create a new appointment with reminderSent set to true
            const remindedAppointment: MedicalAppointment = { ...appointment, reminderSent: true };
            appointmentStorage.insert(id, remindedAppointment);

            // Simulate sending a reminder (in a real system, this would involve sending notifications)
            console.log(`Reminder sent for appointment with id=${id}`);

            return Result.Ok(remindedAppointment);
        },
        None: () => Result.Err<MedicalAppointment, string>(`Appointment with id=${id} not found`),
    }) as Result<MedicalAppointment, string>;
}

// Query to get all Medical Appointments
$query
export function getAppointments(): Result<Vec<MedicalAppointment>, string> {
    try {
        const appointments = appointmentStorage.values();
        return Result.Ok(appointments);
    } catch (error) {
        return Result.Err(`Error getting appointments: ${error}`);
    }
}

// Query to get a specific Medical Appointment by ID
$query
export function getAppointment(id: string): Result<MedicalAppointment, string> {
    return match(appointmentStorage.get(id), {
        Some: (appointment) => Result.Ok<MedicalAppointment, string>(appointment),
        None: () => Result.Err<MedicalAppointment, string>(`Appointment with id=${id} not found`),
    }) as Result<MedicalAppointment, string>;
}

// Update to modify an existing Medical Appointment
$update
export function updateAppointment(id: string, updatedAppointment: MedicalAppointment): Result<MedicalAppointment, string> {
    return match(appointmentStorage.get(id), {
        Some: (existingAppointment) => {
            // Validate the updated appointment object for required fields
            if (!updatedAppointment.patientName || !updatedAppointment.doctorName || !updatedAppointment.appointmentDate) {
                return Result.Err('Missing required fields in the updated appointment object');
            }

            // Create a new appointment object with the updated fields
            const updated: MedicalAppointment = {
                ...existingAppointment,
                ...updatedAppointment,
                updatedAt: Opt.Some(ic.time()),
            };

            // Update the appointment in appointmentStorage
            appointmentStorage.insert(id, updated);

            return Result.Ok(updated);
        },
        None: () => Result.Err<MedicalAppointment, string>(`Appointment with id=${id} does not exist`),
    }) as Result<MedicalAppointment, string>;
}

// Update to delete an existing Medical Appointment by ID
$update
export function deleteAppointment(id: string): Result<Opt<MedicalAppointment>, string> {
    try {
        // Validate the id parameter using the isValidUUID function
        if (!isValidUUID(id)) {
            return Result.Err('Invalid appointment ID');
        }

        // Delete the appointment from appointmentStorage
        const deletedAppointment = appointmentStorage.remove(id);
        if (!deletedAppointment) {
            return Result.Err(`Appointment with ID ${id} does not exist`);
        }

        return Result.Ok(deletedAppointment);
    } catch (error) {
        return Result.Err(`Error deleting appointment: ${error}`);
    }
}

// Update to modify the medical record of an existing Medical Appointment
$update
export function updateMedicalRecord(id: string, newRecord: string): Result<MedicalAppointment, string> {
    return match(appointmentStorage.get(id), {
        Some: (existingAppointment) => {
            // Create a new appointment object with the updated medical record
            const updated: MedicalAppointment = {
                ...existingAppointment,
                medicalRecord: newRecord,
                updatedAt: Opt.Some(ic.time()),
            };

            // Update the appointment in appointmentStorage
            appointmentStorage.insert(id, updated);

            return Result.Ok(updated);
        },
        None: () => Result.Err<MedicalAppointment, string>(`Appointment with id=${id} does not exist`),
    }) as Result<MedicalAppointment, string>;
}

// Query to get upcoming appointments within a specified number of days
$query
export function getUpcomingAppointments(daysAhead: number): Result<Vec<MedicalAppointment>, string> {
    try {
        const currentDate = new Date().getTime();
        // Filter appointments based on being scheduled and within the specified time frame
        const upcomingAppointments = appointmentStorage
            .values()
            .filter((appointment) => {
                const appointmentDate = new Date(appointment.appointmentDate).getTime();
                return appointment.isScheduled && appointmentDate > currentDate && appointmentDate < currentDate + daysAhead * 24 * 60 * 60 * 1000;
            });

        return Result.Ok(upcomingAppointments);
    } catch (error) {
        return Result.Err(`Error getting upcoming appointments: ${error}`);
    }
}

// Query to get canceled appointments
$query
export function getCanceledAppointments(): Result<Vec<MedicalAppointment>, string> {
    try {
        // Filter appointments based on not being scheduled
        const canceledAppointments = appointmentStorage
            .values()
            .filter((appointment) => !appointment.isScheduled);

        return Result.Ok(canceledAppointments);
    } catch (error) {
        return Result.Err(`Error getting canceled appointments: ${error}`);
    }
}

// Update to reschedule an existing Medical Appointment to a new date
$update
export function rescheduleAppointment(id: string, newDate: string): Result<MedicalAppointment, string> {
    return match(appointmentStorage.get(id), {
        Some: (existingAppointment) => {
            // Create a new appointment object with the updated appointment date
            const rescheduled: MedicalAppointment = {
                ...existingAppointment,
                appointmentDate: newDate,
                updatedAt: Opt.Some(ic.time()),
            };

            // Update the appointment in appointmentStorage
            appointmentStorage.insert(id, rescheduled);

            return Result.Ok(rescheduled);
        },
        None: () => Result.Err<MedicalAppointment, string>(`Appointment with id=${id} does not exist`),
    }) as Result<MedicalAppointment, string>;
}

// Update to mark an existing Medical Appointment as completed
$update
export function completeAppointment(id: string): Result<MedicalAppointment, string> {
    return match(appointmentStorage.get(id), {
        Some: (appointment) => {
            if (!appointment.isScheduled) {
                return Result.Err<MedicalAppointment, string>(`Appointment with id=${id} is not scheduled`);
            }

            // Create a new appointment object with isScheduled set to false
            const completedAppointment: MedicalAppointment = { ...appointment, isScheduled: false };
            appointmentStorage.insert(id, completedAppointment);

            return Result.Ok(completedAppointment);
        },
        None: () => Result.Err<MedicalAppointment, string>(`Appointment with id=${id} not found`),
    }) as Result<MedicalAppointment, string>;
}

// Function to validate the format of a UUID
export function isValidUUID(id: string): boolean {
    return /^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i.test(id);
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
};
