/**
 * Clase que tiene la información de un horario de una materia. Esta clase es usada por la clase Subject
 */
export class Horary {

    public dia: string;
    public horaInicio: number;
    public horaFin: number;

    constructor(
        private nDia: string,
        private nHoraInicio: number,
        private nHoraFin: number
    ) {
        this.dia = nDia;
        this.horaInicio = nHoraInicio;
        this.horaFin = nHoraFin;
    }
}