
DROP TABLE IF EXISTS materias_alternativas;
DROP TABLE IF EXISTS bloqueos;
DROP TABLE IF EXISTS alternativas;
DROP TABLE IF EXISTS materias;
DROP TABLE IF EXISTS usuarios;

--
-- Name: alternativas; Type: TABLE; Schema: public; Owner: user12
--

CREATE TABLE public.alternativas (
    id_alternativa integer NOT NULL,
    persona_id_persona character varying(255) NOT NULL
);


ALTER TABLE public.alternativas OWNER TO user12;

--
-- Name: bloqueos; Type: TABLE; Schema: public; Owner: user12
--

CREATE TABLE public.bloqueos (
    id_bloqueo character varying(255) NOT NULL,
    hora_fin numeric(19,2),
    hora_inicio numeric(19,2),
    id_padre character varying(255),
    nombre character varying(255),
    alternativa_id_alternativa integer,
    alternativa_persona_id_persona character varying(255) NOT NULL
);


ALTER TABLE public.bloqueos OWNER TO user12;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: user12
--

DROP TABLE IF EXISTS cities;

--
-- Name: materias; Type: TABLE; Schema: public; Owner: user12
--

CREATE TABLE public.materias (
    numero_clase character varying(255) NOT NULL,
    nombre character varying(255)
);


ALTER TABLE public.materias OWNER TO user12;

--
-- Name: materias_alternativas; Type: TABLE; Schema: public; Owner: user12
--

CREATE TABLE public.materias_alternativas (
    materias_numero_clase character varying(255) NOT NULL,
    alternativas_id_alternativa integer NOT NULL,
    alternativas_persona_id_persona character varying(255) NOT NULL
);


ALTER TABLE public.materias_alternativas OWNER TO user12;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: user12
--


CREATE TABLE public.usuarios (
    id_persona character varying(255) NOT NULL,
    credenciales character varying(255)
);


ALTER TABLE public.usuarios OWNER TO user12;

--
-- Name: alternativas alternativas_pkey; Type: CONSTRAINT; Schema: public; Owner: user12
--

ALTER TABLE ONLY public.alternativas
    ADD CONSTRAINT alternativas_pkey PRIMARY KEY (id_alternativa, persona_id_persona);


--
-- Name: bloqueos bloqueos_pkey; Type: CONSTRAINT; Schema: public; Owner: user12
--

ALTER TABLE ONLY public.bloqueos
    ADD CONSTRAINT bloqueos_pkey PRIMARY KEY (alternativa_id_alternativa, alternativa_persona_id_persona, id_bloqueo);


-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: user12
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (numero_clase);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: user12
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_persona);

ALTER TABLE ONLY public.materias_alternativas
    ADD CONSTRAINT materias_alternativas_pkey PRIMARY KEY (materias_numero_clase, alternativas_id_alternativa, alternativas_persona_id_persona);


--
-- Name: materias_alternativas fkarpfu5k4qcsaxtdv0w9ld63by; Type: FK CONSTRAINT; Schema: public; Owner: user12
--

ALTER TABLE ONLY public.materias_alternativas
    ADD CONSTRAINT fkarpfu5k4qcsaxtdv0w9ld63by FOREIGN KEY (materias_numero_clase) REFERENCES public.materias(numero_clase);


--
-- Name: bloqueos fkdvdyx6k79cmk4o5ye4k3y35v5; Type: FK CONSTRAINT; Schema: public; Owner: user12
--

ALTER TABLE ONLY public.bloqueos
    ADD CONSTRAINT fkdvdyx6k79cmk4o5ye4k3y35v5 FOREIGN KEY (alternativa_id_alternativa, alternativa_persona_id_persona) REFERENCES public.alternativas(id_alternativa, persona_id_persona);


--
-- Name: alternativas fknlxoybyg5mkufrsmmqyh7qb0q; Type: FK CONSTRAINT; Schema: public; Owner: user12
--

ALTER TABLE ONLY public.alternativas
    ADD CONSTRAINT fknlxoybyg5mkufrsmmqyh7qb0q FOREIGN KEY (persona_id_persona) REFERENCES public.usuarios(id_persona);


--
-- Name: materias_alternativas fkti4403a91doqj4f92so35onq9; Type: FK CONSTRAINT; Schema: public; Owner: user12
--

ALTER TABLE ONLY public.materias_alternativas
    ADD CONSTRAINT fkti4403a91doqj4f92so35onq9 FOREIGN KEY (alternativas_id_alternativa, alternativas_persona_id_persona) REFERENCES public.alternativas(id_alternativa, persona_id_persona);


--
-- PostgreSQL database dump complete
--
