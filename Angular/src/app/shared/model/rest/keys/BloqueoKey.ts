import { AlternativaKey } from "./AlternativaKey";

/**
 * Objeto usuado para crear la llave primaria de Bloqueo
 */
export class BloqueoKey {
    public idBloqueo: string;
    public alternativa: AlternativaKey;

    constructor(
        private nIdBloqueo: string,
        private nAlternativa: AlternativaKey
    ) {
        this.idBloqueo = nIdBloqueo;
        this.alternativa = nAlternativa;
    }
}