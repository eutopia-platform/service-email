CREATE SCHEMA IF NOT EXISTS sc_mail;

DROP TABLE IF EXISTS sc_mail.news;
CREATE TABLE sc_mail.news(
  email   varchar(70)   UNIQUE NOT NULL
);

DROP USER IF EXISTS service_mail;
CREATE USER service_mail WITH PASSORD <password>;

GRANT USAGE ON SCHEMA sc_mail TO service_mail;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA sc_mail TO service_mail;
