export class Materia {
    public numeroClase: string;
    public nombre: string;

    constructor(
        private nNumeroClase: string,
        private nNombre: string
    ) {
        this.numeroClase = nNumeroClase;
        this.nombre = nNombre;
    }
}