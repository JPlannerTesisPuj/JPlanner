export class AlternativaKey {
    public idAlternativa: number;
    public persona: string;

    constructor(
        private nIdAlternativa: number,
        private nPersona: string
    ) {
        this.idAlternativa = nIdAlternativa;
        this.persona = nPersona;
    }
}