
/**
 * Clase que tiene la información de un usuario.
 */
export class User {
    public carrera: string;
    public GID: string;
    public credenciales: string;
    public nombre_estudiante: string;
    public semestre: number;
    public numeroCreditosAprobados: number;

    constructor(
        private nCarrera: string,
        private nGID: string,
        private nCredenciales: string,
        private nNombre_estudiante: string,
        private nSemestre: number,
        private nNumeroCreditosAprobados: number
    ) {
        this.carrera = nCarrera;
        this.GID = nGID;
        this.credenciales = nCredenciales;
        this.nombre_estudiante = nNombre_estudiante;
        this.semestre = nSemestre;
        this.numeroCreditosAprobados = nNumeroCreditosAprobados;
    }
}