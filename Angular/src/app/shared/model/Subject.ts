import { Horary } from "./Horary";

/**
 * Clase que tiene la información de una materia de la universidad
 */
export class Subject {

    public _id: string;
    public numeroClase: string;
    public codigo: string;
    public nombre: string;
    public profesor: string;
    public creditos: number;
    public cuposTotales: number;
    public cuposDisponibles: number;
    public modoEnsenanza: string;
    public estado: string;
    public grado: string;
    public salon: string;
    public departamento: string;
    public descripcion: string;
    public horarios: Horary[];
    public ciclo_lectivo: string;

    constructor(
        private nId: string,
        private nNumeroClase: string,
        private nCodigo: string,
        private nNombre: string,
        private nProfesor: string,
        private nCreditos: number,
        private nCuposTotales: number,
        private nCuposDisponibles: number,
        private nModoEnsenanza: string,
        private nEstado: string,
        private nGrado: string,
        private nSalon: string,
        private nDepartamento: string,
        private nDescripcion: string,
        private nHorarios: Horary[],
        private nCiclo_lectivo: string
    ) {
        this._id = nId;
        this.numeroClase = nNumeroClase;
        this.codigo = nCodigo;
        this.nombre = nNombre;
        this.profesor = nProfesor;
        this.creditos = nCreditos;
        this.cuposTotales = nCuposTotales;
        this.cuposDisponibles = nCuposDisponibles;
        this.modoEnsenanza = nModoEnsenanza;
        this.estado = nEstado;
        this.grado = nGrado;
        this.salon = nSalon;
        this.departamento = nDepartamento;
        this.descripcion = nDescripcion;
        this.horarios = nHorarios;
        this.ciclo_lectivo = nCiclo_lectivo;
    }

}