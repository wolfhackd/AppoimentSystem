import type { AppointmentRepository } from "./appointment.repository";
import type { EstablishmentService } from "../establishment/establishment.service";
import type { ServiceService } from "../service/service.service";
import type { createAppointmentInput } from "./appointment.types";
import { timeToMinutes } from "../../utils/time";



export class AppointmentService{
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly establishmentService: EstablishmentService,
        private readonly serviceService: ServiceService,
    ){}

    async create(data: createAppointmentInput){
        const establishment = await this.establishmentService.getEstablishmentById(data.establishmentId);
        if(!establishment){
            throw new Error('Establishment not found');
        }

        const service = await this.serviceService.getServiceById(data.serviceId);
        if(!service){
            throw new Error('Service not found');
        }

        if(service.establishmentId !== data.establishmentId){
            throw new Error('Service does not belong to this establishment!');
        }

        const openIntervals = await this.establishmentService.isOpenInDay(data.dayOfWeek,data.establishmentId);
        if(openIntervals.length === 0){
            throw new Error('Establishment is not open on this day!');
        }

        const appointmentStart = timeToMinutes(data.hour);
        const serviceDuration = service.duration;
        const appointmentEnd = appointmentStart + serviceDuration;

        const isWithinOperatingHours = openIntervals.some((interval) => {
            const turnOpen = timeToMinutes(interval.openingTime);
            const turnClose = timeToMinutes(interval.closingTime);
            return appointmentStart >= turnOpen && appointmentEnd <= turnClose;
        });

        if (!isWithinOperatingHours) {
            throw new Error('Appointment time is outside of establishment operating hours for this day!');
        }

        const appointmentDate = this.getNextOccurrence(data.dayOfWeek, data.hour);
        return this.appointmentRepository.create(data, appointmentDate, serviceDuration);
    }

    private getNextOccurrence(dayOfWeek: number, hour: string): Date {
        const now = new Date();
        const currentDayOfWeek = now.getUTCDay() || 7;
        const daysUntilAppointment = (dayOfWeek - currentDayOfWeek + 7) % 7;
        const [hours, minutes] = hour.split(':').map(Number);
        const appointmentDate = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + daysUntilAppointment,
            hours,
            minutes,
        ));

        if (appointmentDate <= now) {
            appointmentDate.setUTCDate(appointmentDate.getUTCDate() + 7);
        }

        return appointmentDate;
    }
}