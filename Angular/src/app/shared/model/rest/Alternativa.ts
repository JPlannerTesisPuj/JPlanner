import { AlternativaKey } from "./keys/AlternativaKey";
import { Usuario } from "./Usuario";
import { Bloqueo } from "./Bloqueo";
import { Materia } from "./Materia";

/**
 * Objeto equivalente al Objeto Alternativa del Servidor
 */
export class Alternativa {
    public alternativaKey: AlternativaKey;
    public bloqueos: Bloqueo[];
    public materias: Materia[];

    constructor(
        private nAlternativaKey: AlternativaKey,
        private nBloqueos: Bloqueo[],
        private nMaterias: Materia[]
        ) {
        this.alternativaKey = nAlternativaKey;
        this.bloqueos = nBloqueos;
        this.materias = nMaterias;
    }
}