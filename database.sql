create table users (
  id bigint primary key generated always as identity,
  name text not null,
  password text not null,
  email text not null unique
);

create table cars (
  plate text primary key,
  consumption numeric not null,
  brand text not null,
  model text not null,
  user_id bigint not null,
  foreign key (user_id) references users (id)
);

create table gas_stations (
  id bigint primary key generated always as identity,
  brand text not null,
  municipality text not null,
  direction text not null
);

create table favorite_gas_stations (
  user_id bigint not null,
  gas_station_id bigint not null,
  primary key (user_id, gas_station_id),
  foreign key (user_id) references users (id),
  foreign key (gas_station_id) references gas_stations (id)
);