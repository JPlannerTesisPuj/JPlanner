import { Alternativa } from "./Alternativa";

/**
 * Objeto equivalente al Objeto Materia del Servidor
 */
export class Materia {
    public numeroClase: string;
    public nombre: string;
    public alternativas: Alternativa[];

    constructor(
        private nNumeroClase: string,
        private nNombre: string,
        private nAlternativas: Alternativa[]
    ) {
        this.numeroClase = nNumeroClase;
        this.nombre = nNombre;
        this.alternativas = nAlternativas;
    }
}