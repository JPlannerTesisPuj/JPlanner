import { AlternativaKey } from "./AlternativaKey";

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