import { Alternativa } from "./Alternativa";

/**
 * Objeto equivalente al Objeto Usuario del Servidor
 */
export class Usuario {
    public idPersona: string;
    public credenciales: string;
    public alternativas: Alternativa[];

    constructor(
        private nIdPersona: string,
        private nCredenciales: string,
        private nAlternativas: Alternativa[]
    ) {
        this.idPersona = nIdPersona;
        this.credenciales = nCredenciales;
        this.alternativas = nAlternativas;
    }
}