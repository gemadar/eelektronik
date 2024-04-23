CREATE TABLE IF NOT EXISTS public.active_users
(
    id serial,
    username character varying(50),
    password character varying(1000),
    role character varying(50),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    name character varying(50),
    sub character varying(15),
    issued_at timestamp with time zone,
    is_login character varying(2),
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_username_key UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS public.cash_flows
(
    id bigserial,
    payment_id character varying(50),
    amount numeric,
    trx_id character varying(50),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    CONSTRAINT cash_flow_pkey PRIMARY KEY (id),
    CONSTRAINT cash_flow_payment_id_key UNIQUE (payment_id)
);

CREATE TABLE IF NOT EXISTS public.cashes
(
    id bigserial,
    amount numeric NOT NULL,
    amount_date date NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    CONSTRAINT cash_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.customers
(
    id bigserial,
    name character varying(50) NOT NULL,
    address character varying(50) NOT NULL,
    gender character varying(50),
    dob date,
    phone_number character varying(50),
    email character varying(50),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    CONSTRAINT customer_pkey PRIMARY KEY (id),
    CONSTRAINT customer_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.suppliers
(
    id bigserial,
    name character varying(50),
    address character varying(50),
    phone_number character varying(50),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    pic character varying(50),
    CONSTRAINT supplier_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.goods
(
    id bigserial,
    name character varying(50) ,
    product_code character varying(50),
    buy_price numeric,
    sell_price numeric,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    brand character varying(50),
    product_category character varying(50),
    quantity integer,
    supplier_id integer,
    supplier_name character varying ,
    CONSTRAINT goods_pkey PRIMARY KEY (id),
    CONSTRAINT goods_product_code_key UNIQUE (product_code),
    CONSTRAINT goods_fkey FOREIGN KEY (supplier_id)
        REFERENCES public.suppliers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.transactions
(
    id bigserial,
    cst_id bigint,
    total numeric,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    trx_id character varying NOT NULL,
    status character varying,
    payment_type character varying,
    cst_name character varying,
    CONSTRAINT transactions_pkey PRIMARY KEY (id)
        INCLUDE(id),
    CONSTRAINT trx_id UNIQUE (trx_id),
    CONSTRAINT transactions_fkey FOREIGN KEY (cst_id)
        REFERENCES public.customers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE IF NOT EXISTS public.transactions_details
(
    id bigserial,
    item character varying(50) NOT NULL,
    quantity numeric(50,0),
    price numeric,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    trx_id character varying NOT NULL,
    CONSTRAINT transaction_pkey PRIMARY KEY (id),
    CONSTRAINT transaction_detail_fkey FOREIGN KEY (trx_id)
        REFERENCES public.transactions (trx_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

INSERT INTO public.active_users (username, password, role, name, created_at) VALUES ('M4G1CBULLET', '$2a$14$0Sgdt8R.By6zrBrmdHCj2e9NTsBO.Mb4wchzVkkZIkS7aSlpXBRqq', 'admin', 'gems', current_timestamp);