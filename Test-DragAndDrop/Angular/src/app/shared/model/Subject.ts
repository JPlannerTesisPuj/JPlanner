import { Horary } from "./Horary";

/**
 * Clase que tiene la información de una materia de la universidad
 */
export class Subject {

    public id: string;
    public numeroClase: string;
    public nombre: string;
    public profesor: string;
    public creditos: number;
    public salon: string;
    public departamento: string;
    public horario: Horary[];

    constructor(
        private nId: string,
        private nNumeroClase: string,
        private nNombre: string,
        private nProfesor: string,
        private nCreditos: number,
        private nSalon: string,
        private nDepartamento: string,
        private nHorario: Horary[],
    ) {
        this.id = nId;
        this.numeroClase = nNumeroClase;
        this.nombre = nNombre;
        this.profesor = nProfesor;
        this.creditos = nCreditos;
        this.salon = nSalon;
        this.departamento = nDepartamento;
        this.horario = nHorario;
    }

}