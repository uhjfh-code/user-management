--
-- PostgreSQL database dump
--

\restrict 19DxP2i4rJHhmqq1HiPT058MWLMM9M1k97Mf2kT5HUFCRvFCUlu1jy2E826HMq1

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "customerNumber" integer NOT NULL,
    username character varying(30) NOT NULL,
    email character varying(300) NOT NULL,
    "firstName" character varying(150) NOT NULL,
    "lastLogin" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "lastName" character varying(150) NOT NULL,
    password character varying(150) NOT NULL,
    "dateOfBirth" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "customerNumber", username, email, "firstName", "lastLogin", "lastName", password, "dateOfBirth") FROM stdin;
1	90234	admin	annaqiu06@gmail.com	Anna	2025-11-01 14:56:45.683	Qiu	ChinaQ12345	2025-10-30 00:00:00
4	42084	fsjljfs	ww@gmail.com	tom	2025-11-01 15:00:59.91	cat	qan1234	2025-11-14 00:00:00
5	34356	Li8hh	lihao@gmail.com	qw	2025-11-01 16:37:51.23	wer	ChinaQ12345	2025-10-07 00:00:00
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
550d24b3-b5d2-4052-b2a3-0f343bcc0f2d	76179c9e7d8b274f4f2b8096eb335333bb435efb0daf5edd16100ba62c6322f5	2025-10-30 23:13:09.383389+01	20251030221309_init	\N	\N	2025-10-30 23:13:09.366005+01	1
cc52cf8f-6a86-474a-b8b2-aad56c1d39b7	702c1dde3b20c8ac002ec3484d56f1742070492949bad1094a506a3f41bd4cf3	2025-10-31 22:52:14.207822+01	20251031215214_init	\N	\N	2025-10-31 22:52:14.189173+01	1
7e9d7d93-3f4b-46c1-82d0-f4226dd9a3ce	b1fd080f8878677c04ad016aaddd857a07aa01a3bf7817e26e3dce8935832663	2025-11-01 08:18:35.106953+01	20251101071835_fix_date_field	\N	\N	2025-11-01 08:18:35.098897+01	1
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 5, true);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_customerNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_customerNumber_key" ON public."User" USING btree ("customerNumber");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- PostgreSQL database dump complete
--

\unrestrict 19DxP2i4rJHhmqq1HiPT058MWLMM9M1k97Mf2kT5HUFCRvFCUlu1jy2E826HMq1

