/**
 * Clase que tiene la información de un horario de una materia. Esta clase es usada por la clase Subject
 */
export class Horary {
    public salon: string;
    public horaInicio: number;
    public horaFin: number;

    constructor(
        private nSalon: string,
        private nHoraInicio: number,
        private nHoraFin: number
    ) {
        this.salon = nSalon;
        this.horaInicio = nHoraInicio;
        this.horaFin = nHoraFin;
    }
}