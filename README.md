# Medical Appointment Management Canister

This repository contains the source code for a Medical Appointment Management Canister on the Azle blockchain. The canister allows users to manage medical appointments, providing functionality such as scheduling, canceling, updating, and querying appointments based on various criteria.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Query Functions](#query-functions)
  - [Update Functions](#update-functions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Medical Appointment Management Canister is designed to be a decentralized solution for managing information about medical appointments. Each appointment is represented by the `MedicalAppointment` record, which includes fields such as `id`, `patientName`, `doctorName`, `appointmentDate`, `isScheduled`, `reminderSent`, `medicalRecord`, `createdAt`, and `updatedAt`. The canister uses a `StableBTreeMap` for efficient storage and retrieval of appointments.

Key Features:

- **Scheduling**: Schedule a new medical appointment with unique ID generation.
- **Cancellation**: Cancel an existing medical appointment.
- **Reminder**: Send a reminder for a scheduled appointment.
- **Querying**: Retrieve information about appointments based on various criteria.
- **Update**: Modify and update existing appointment information.
- **Statistics**: Get upcoming appointments, canceled appointments, and more.

## Prerequisites

Before you begin, ensure that you have the following installed:

- [Azle SDK](https://docs.azle.io/getting-started/installation)
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [uuid](https://www.npmjs.com/package/uuid)

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/ManStevoh/medical-appointment-scheduler.git
cd medical-appointment-scheduler
```

Install dependencies:

```bash
npm install
```

## Usage

To use the Medical Appointment Management Canister, you can explore the provided query and update functions:

### Query Functions

- **searchAppointments(query: string):** Search for appointments based on a query string.
- **getAppointments():** Get a list of all medical appointments.
- **getAppointment(id: string):** Get information about a specific appointment by ID.
- **getUpcomingAppointments(daysAhead: number):** Get upcoming appointments within a specified number of days.
- **getCanceledAppointments():** Get a list of canceled appointments.

### Update Functions

- **scheduleAppointment(appointment: MedicalAppointment):** Schedule a new medical appointment.
- **cancelAppointment(id: string):** Cancel an existing medical appointment.
- **sendReminder(id: string):** Send a reminder for a scheduled appointment.
- **updateAppointment(id: string, updatedAppointment: MedicalAppointment):** Update information about an existing appointment.
- **deleteAppointment(id: string):** Delete an appointment by ID.
- **updateMedicalRecord(id: string, newRecord: string):** Update the medical record of an existing appointment.
- **rescheduleAppointment(id: string, newDate: string):** Reschedule an existing appointment to a new date.
- **completeAppointment(id: string):** Mark an existing appointment as completed.

## Testing

To run tests, use the following command:

```bash
npm test
```

## Deployment

To deploy the canister, follow these steps:

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the canister:

   ```bash
   dfx deploy
   ```

3. Use the generated canister identifier to interact with the deployed canister.

For additional deployment options and configurations, refer to the [Azle documentation](https://docs.azle.io/).

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Follow the standard GitHub flow for contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.