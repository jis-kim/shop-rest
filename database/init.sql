--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brand; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    name character varying(128) NOT NULL,
    name_en character varying(128) NOT NULL,
    description character varying(255) NOT NULL
);


--
-- Name: member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    name character varying(128) NOT NULL,
    username character varying(64) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    member_type_id uuid NOT NULL
);


--
-- Name: member_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_type (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    name character varying(128) NOT NULL
);


--
-- Name: member_type_price; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_type_price (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    price integer NOT NULL,
    product_id uuid NOT NULL,
    member_type_id uuid NOT NULL
);


--
-- Name: product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    name character varying NOT NULL,
    description text,
    base_price integer NOT NULL,
    discount_rate numeric(4,1) DEFAULT '0'::numeric NOT NULL,
    brand_id uuid NOT NULL
);


--
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brand (id, created_at, updated_at, deleted_at, name, name_en, description) FROM stdin;
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member (id, created_at, updated_at, deleted_at, name, username, email, password, member_type_id) FROM stdin;
\.


--
-- Data for Name: member_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member_type (id, created_at, updated_at, deleted_at, name) FROM stdin;
\.


--
-- Data for Name: member_type_price; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member_type_price (id, created_at, updated_at, deleted_at, price, product_id, member_type_id) FROM stdin;
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product (id, created_at, updated_at, deleted_at, name, description, base_price, discount_rate, brand_id) FROM stdin;
\.


--
-- Name: member_type_price PK_75148405a15a75929ffb97f2a6a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_type_price
    ADD CONSTRAINT "PK_75148405a15a75929ffb97f2a6a" PRIMARY KEY (id);


--
-- Name: member PK_97cbbe986ce9d14ca5894fdc072; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY (id);


--
-- Name: brand PK_a5d20765ddd942eb5de4eee2d7f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY (id);


--
-- Name: product PK_bebc9158e480b949565b4dc7a82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);


--
-- Name: member_type PK_d4d8cf213976dfd439aef17907f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_type
    ADD CONSTRAINT "PK_d4d8cf213976dfd439aef17907f" PRIMARY KEY (id);


--
-- Name: member UQ_1945f9202fcfbce1b439b47b77a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT "UQ_1945f9202fcfbce1b439b47b77a" UNIQUE (username);


--
-- Name: member UQ_4678079964ab375b2b31849456c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT "UQ_4678079964ab375b2b31849456c" UNIQUE (email);


--
-- Name: member_type UQ_aa1625c7c891b04fa7c6f5a1145; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_type
    ADD CONSTRAINT "UQ_aa1625c7c891b04fa7c6f5a1145" UNIQUE (name);


--
-- Name: member_type_price UQ_f67fe8cd5e7a0e9c40e1ac08248; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_type_price
    ADD CONSTRAINT "UQ_f67fe8cd5e7a0e9c40e1ac08248" UNIQUE (product_id, member_type_id);


--
-- Name: product FK_2eb5ce4324613b4b457c364f4a2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_2eb5ce4324613b4b457c364f4a2" FOREIGN KEY (brand_id) REFERENCES public.brand(id);


--
-- Name: member_type_price FK_a528c2bace1f914b5408b62d498; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_type_price
    ADD CONSTRAINT "FK_a528c2bace1f914b5408b62d498" FOREIGN KEY (member_type_id) REFERENCES public.member_type(id);


--
-- Name: member FK_dfe7c8528514d83e17b6aa47bd4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT "FK_dfe7c8528514d83e17b6aa47bd4" FOREIGN KEY (member_type_id) REFERENCES public.member_type(id);


--
-- Name: member_type_price FK_e0eb0a0be95ba944eddd46f8479; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_type_price
    ADD CONSTRAINT "FK_e0eb0a0be95ba944eddd46f8479" FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- PostgreSQL database dump complete
--

