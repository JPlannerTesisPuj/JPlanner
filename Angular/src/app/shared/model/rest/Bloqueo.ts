import { BloqueoKey } from "./keys/BloqueoKey";

/**
 * Objeto equivalente al Objeto Bloqueo del Servidor
 */
export class Bloqueo {
    public bloqueoKey: BloqueoKey;
    public horaInicio: number;
    public horaFin: number;
    public nombre: string;
    public idPadre: string;

    constructor(
        private nBloqueoKey: BloqueoKey, 
        private nHoraInicio: number,
        private nHoraFin: number,
        private nNombre: string,
        private nIdPadre: string
    ) {
        this.bloqueoKey = nBloqueoKey;
        this.horaInicio = nHoraInicio;
        this.horaFin = nHoraFin;
        this.nombre = nNombre;
        this.idPadre = nIdPadre;
    }
}