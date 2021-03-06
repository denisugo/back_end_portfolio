--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

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
-- Name: carts; Type: TABLE; Schema: public; Owner: denis
--

CREATE TABLE public.carts (
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.carts OWNER TO denis;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: denis
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.orders OWNER TO denis;

--
-- Name: orders_users; Type: TABLE; Schema: public; Owner: denis
--

CREATE TABLE public.orders_users (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    shipped boolean DEFAULT false NOT NULL,
    transaction_id character varying(60) NOT NULL
);


ALTER TABLE public.orders_users OWNER TO denis;

--
-- Name: orders_users_order_id_seq; Type: SEQUENCE; Schema: public; Owner: denis
--

CREATE SEQUENCE public.orders_users_order_id_seq
    AS integer
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_users_order_id_seq OWNER TO denis;

--
-- Name: orders_users_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: denis
--

ALTER SEQUENCE public.orders_users_order_id_seq OWNED BY public.orders_users.order_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: denis
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(200) NOT NULL,
    price integer NOT NULL,
    category character varying(60) NOT NULL,
    preview character varying(1000) NOT NULL
);


ALTER TABLE public.products OWNER TO denis;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: denis
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO denis;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: denis
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: denis
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(30) NOT NULL,
    email character varying(50) NOT NULL,
    username character varying(50) NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    password character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO denis;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: denis
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO denis;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: denis
--

ALTER SEQUENCE public.user_id_seq OWNED BY public.users.id;


--
-- Name: orders_users order_id; Type: DEFAULT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.orders_users ALTER COLUMN order_id SET DEFAULT nextval('public.orders_users_order_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: denis
--

COPY public.carts (user_id, product_id, quantity) FROM stdin;
3	3	5
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: denis
--

COPY public.orders (id, product_id, quantity) FROM stdin;
1454	1	1
1	3	5
\.


--
-- Data for Name: orders_users; Type: TABLE DATA; Schema: public; Owner: denis
--

COPY public.orders_users (order_id, user_id, shipped, transaction_id) FROM stdin;
1454	1	f	pi_3KC1rKI6OSqfLBcY0SZNQlTh
1	3	f	10
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: denis
--

COPY public.products (id, name, description, price, category, preview) FROM stdin;
3	Oil	NoDelete	90	health	https://images.unsplash.com/photo-1633171029787-3a1022cfc922?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80
10	HomeOffice	New energy pills for your productive life	250	energy	https://images.unsplash.com/photo-1612475498158-014b71f98625?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2028&q=80
13	Noname tabs	Open it and try to survive	10	other	https://images.unsplash.com/photo-1550572017-26b5655c1e8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80
15	Blue tab	Self explaining name	100	health	https://images.unsplash.com/photo-1519994083223-e72116e38b7e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80
12	Vichy	New liquid	200	health	https://images.unsplash.com/photo-1556227834-09f1de7a7d14?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80
1	Cream	Clear your skin	100	health	https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: denis
--

COPY public.users (id, first_name, last_name, email, username, is_admin, password) FROM stdin;
3	Jonny	TestNoDelete	JonnyTest@gmail.com	jTest	t	anotherSecret
2071	Froggre	Chen	kim@kim.korea	kim	f	NewPass
2	Dave	Sinclair	\tdave.sin@yahoo.com	davy000	f	treasure
1	Joe	Barbora	joe_barbora@gmail.com	jb	t	secret
\.


--
-- Name: orders_users_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: denis
--

SELECT pg_catalog.setval('public.orders_users_order_id_seq', 1454, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: denis
--

SELECT pg_catalog.setval('public.product_id_seq', 1903, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: denis
--

SELECT pg_catalog.setval('public.user_id_seq', 2983, true);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (user_id, product_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id, product_id);


--
-- Name: orders_users orders_users_pkey; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.orders_users
    ADD CONSTRAINT orders_users_pkey PRIMARY KEY (order_id);


--
-- Name: orders_users orders_users_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.orders_users
    ADD CONSTRAINT orders_users_transaction_id_key UNIQUE (transaction_id);


--
-- Name: products product_pkey; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: users user_username_key; Type: CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: order_id_idx; Type: INDEX; Schema: public; Owner: denis
--

CREATE INDEX order_id_idx ON public.orders USING btree (id);


--
-- Name: orders_users_order_id_user_id_idx; Type: INDEX; Schema: public; Owner: denis
--

CREATE UNIQUE INDEX orders_users_order_id_user_id_idx ON public.orders_users USING btree (order_id, user_id);


--
-- Name: products_category_idx; Type: INDEX; Schema: public; Owner: denis
--

CREATE INDEX products_category_idx ON public.products USING btree (category);


--
-- Name: users_username_password_id_is_admin_idx; Type: INDEX; Schema: public; Owner: denis
--

CREATE UNIQUE INDEX users_username_password_id_is_admin_idx ON public.users USING btree (id, username, is_admin, password);


--
-- Name: carts carts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: orders orders_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_id_fkey FOREIGN KEY (id) REFERENCES public.orders_users(order_id) ON DELETE CASCADE;


--
-- Name: orders orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: orders_users orders_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denis
--

ALTER TABLE ONLY public.orders_users
    ADD CONSTRAINT orders_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO public_role;
GRANT USAGE ON SCHEMA public TO registered_role;
GRANT USAGE ON SCHEMA public TO admin_role;


--
-- Name: TABLE carts; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.carts TO admin_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.carts TO registered_role;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.orders TO admin_role;
GRANT SELECT,INSERT ON TABLE public.orders TO registered_role;


--
-- Name: TABLE orders_users; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.orders_users TO admin_role;
GRANT SELECT,INSERT ON TABLE public.orders_users TO registered_role;


--
-- Name: SEQUENCE orders_users_order_id_seq; Type: ACL; Schema: public; Owner: denis
--

GRANT USAGE ON SEQUENCE public.orders_users_order_id_seq TO registered_role;
GRANT USAGE ON SEQUENCE public.orders_users_order_id_seq TO admin_role;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT ON TABLE public.products TO public_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.products TO admin_role;
GRANT SELECT ON TABLE public.products TO registered_role;


--
-- Name: SEQUENCE product_id_seq; Type: ACL; Schema: public; Owner: denis
--

GRANT USAGE ON SEQUENCE public.product_id_seq TO admin_role;
GRANT USAGE ON SEQUENCE public.product_id_seq TO public_role;
GRANT USAGE ON SEQUENCE public.product_id_seq TO registered_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO admin_role;
GRANT SELECT ON TABLE public.users TO public_role;
GRANT SELECT ON TABLE public.users TO registered_role;


--
-- Name: COLUMN users.id; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT(id) ON TABLE public.users TO registered_role;
GRANT SELECT(id) ON TABLE public.users TO public_role;


--
-- Name: COLUMN users.first_name; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT(first_name),UPDATE(first_name) ON TABLE public.users TO registered_role;
GRANT INSERT(first_name) ON TABLE public.users TO public_role;


--
-- Name: COLUMN users.last_name; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT(last_name),UPDATE(last_name) ON TABLE public.users TO registered_role;
GRANT INSERT(last_name) ON TABLE public.users TO public_role;


--
-- Name: COLUMN users.email; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT(email),UPDATE(email) ON TABLE public.users TO registered_role;
GRANT INSERT(email) ON TABLE public.users TO public_role;


--
-- Name: COLUMN users.username; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT(username),UPDATE(username) ON TABLE public.users TO registered_role;
GRANT SELECT(username),INSERT(username) ON TABLE public.users TO public_role;


--
-- Name: COLUMN users.is_admin; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT(is_admin) ON TABLE public.users TO registered_role;
GRANT SELECT(is_admin) ON TABLE public.users TO public_role;


--
-- Name: COLUMN users.password; Type: ACL; Schema: public; Owner: denis
--

GRANT SELECT(password),UPDATE(password) ON TABLE public.users TO registered_role;
GRANT SELECT(password),INSERT(password) ON TABLE public.users TO public_role;


--
-- Name: SEQUENCE user_id_seq; Type: ACL; Schema: public; Owner: denis
--

GRANT USAGE ON SEQUENCE public.user_id_seq TO admin_role;
GRANT USAGE ON SEQUENCE public.user_id_seq TO registered_role;
GRANT USAGE ON SEQUENCE public.user_id_seq TO public_role;


--
-- PostgreSQL database dump complete
--

