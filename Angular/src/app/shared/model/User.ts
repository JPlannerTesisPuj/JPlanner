
/**
 * Clase que tiene la información de un usuario.
 */
export class User {
    public asignaturas_aprobadas: [];
    public carrera: string;
    public credenciales: string;
    public nombre_estudiante: string;
    public semestre: number;

    constructor(
        private nAsignaturasAprobadas: [],
        private NCarrera: string,
        private nCredenciales: string,
        private nNombre_estudiante: string,
        private nSemestre: number
    ) {
        this.asignaturas_aprobadas = nAsignaturasAprobadas;
        this.carrera = NCarrera;
        this.credenciales = nCredenciales;
        this.nombre_estudiante = nNombre_estudiante;
        this.semestre = nSemestre;
    }
}