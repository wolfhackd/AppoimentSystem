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

        //Olhar a existência do estabelecimento

        const establishment = await this.establishmentService.getEstablishmentById(data.establishmentId);
        if(!establishment){
            throw new Error('Establishment not found');
        }

        //Olhar a existência do serviço
        const service = await this.serviceService.getServiceById(data.serviceId);
        if(!service){
            throw new Error('Service not found');
        }

        // ---- Disponibilidade do horário ----
        //Verificar se está aberto
        const openIntervals = await this.establishmentService.isOpenInDay(data.dayOfWeek,data.establishmentId);
        if(openIntervals.length === 0){
            throw new Error('Establishment is not open on this day!');
        }

        //verifico se esta entre os horários abertos e verifico se esta livre

        const appointmentStart = timeToMinutes(data.hour);
        const serviceDuration = service.duration;
        const appointmentEnd = appointmentStart + serviceDuration;

        // Usamos o método `.some()` do JavaScript para testar os turnos.
        // Ele retornará 'true' se o agendamento couber inteiramente dentro de QUALQUER um dos turnos.
        const isWithinOperatingHours = openIntervals.some(turno => {
        const turnOpen = timeToMinutes(turno.openingTime);
        const turnClose = timeToMinutes(turno.closingTime);

        // O agendamento precisa começar depois que o turno abre 
        // E terminar antes (ou exatamente quando) o turno fecha
        return appointmentStart >= turnOpen && appointmentEnd <= turnClose;
        });
        if (!isWithinOperatingHours) {
            throw new Error('Appointment time is outside of establishment operating hours for this day!');
        }
        
        console.log('Appointment time is within operating hours!');
        return 
    }



    // async isAvailable(data){
    //     return await this.appointmentRepository.isAvailable(data);
    // }
}