-- Migrations will appear here as you chat with AI

create table users (
  email text primary key,
  name text not null,
  password text not null
);

create table cars (
  plate text primary key,
  consumption numeric not null,
  brand text not null,
  model text not null,
  user_email text not null,
  foreign key (user_email) references users (email)
);

create table gas_stations (
  id bigint primary key generated always as identity,
  brand text not null,
  municipality text not null,
  direction text not null,
  hours text,
  latitude double precision,
  longitude double precision,
  selling_type text
);

create table favorite_gas_stations (
  user_email text not null,
  gas_station_id bigint not null,
  primary key (user_email, gas_station_id),
  foreign key (user_email) references users (email),
  foreign key (gas_station_id) references gas_stations (id)
);

create table gas_station_prices (
  id bigint primary key generated always as identity,
  gas_station_id bigint not null,
  "timestamp" timestamptz not null default now(),
  diesel_price numeric not null,
  diesel_premium_price numeric not null,
  gasoline_95_price numeric not null,
  gasoline_98_price numeric not null,
  foreign key (gas_station_id) references gas_stations (id)
);

create index on gas_station_prices using btree (gas_station_id, "timestamp" desc);