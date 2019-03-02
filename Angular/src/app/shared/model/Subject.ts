import { Horary } from './Horary';

/**
 * Clase que tiene la información de una materia de la universidad
 */
export class Subject {
    public numeroClase: string;
    public idCurso: string;
    public nombre: string;
    public profesor: string;
    public creditos: number;
    public cuposTotales: number;
    public cuposDisponibles: number;
    public modoEnsenanza: string;
    public estado: string;
    public grado: string;
    public unidadAcademica: string;
    public cicloLectivo: string;
    public puedeVerMateria: boolean;
    public tieneCorrequisito: boolean;
    public descripcion: string;
    public horarios: Horary[];

    constructor(
        private nNumeroClase: string,
        private nIdCurso: string,
        private nNombre: string,
        private nProfesor: string,
        private nCreditos: number,
        private nCuposTotales: number,
        private nCuposDisponibles: number,
        private nModoEnsenanza: string,
        private nEstado: string,
        private nGrado: string,
        private nUnidadAcademica: string,
        private nCicloLectivo: string,
        private nPuedeVerMateria: boolean,
        private nTieneCorrequisito: boolean,
        private nDescripcion: string,
        private nHorarios: Horary[]
    ) {
        this.numeroClase = nNumeroClase;
        this.idCurso = nIdCurso;
        this.nombre = nNombre;
        this.profesor = nProfesor;
        this.creditos = nCreditos;
        this.cuposTotales = nCuposTotales;
        this.cuposDisponibles = nCuposDisponibles;
        this.modoEnsenanza = nModoEnsenanza;
        this.estado = nEstado;
        this.grado = nGrado;
        this.unidadAcademica = nUnidadAcademica;
        this.cicloLectivo = nCicloLectivo;
        this.puedeVerMateria = nPuedeVerMateria;
        this.tieneCorrequisito = nTieneCorrequisito;
        this.descripcion = nDescripcion;
        this.horarios = nHorarios;
    }

}