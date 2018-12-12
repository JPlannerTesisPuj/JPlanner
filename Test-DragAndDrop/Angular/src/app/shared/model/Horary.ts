/**
 * Clase que tiene la información de un horario de una materia. Esta clase es usada por la clase Subject
 */
export class Horary {

    public dia: string;
    public horaInicio: string;
    public horaFin: string;

    constructor(
        private nDia: string,
        private nHoraInicio: string,
        private nHoraFin: string
    ) {
        this.dia = nDia;
        this.horaInicio = nHoraInicio;
        this.horaFin = nHoraFin;
    }
}