export class Usuario {
    public idPersona: string;
    public credenciales: string;

    constructor(
        private nIdPersona: string,
        private nCredenciales: string
    ) {
        this.idPersona = nIdPersona;
        this.credenciales = nCredenciales;
    }
}