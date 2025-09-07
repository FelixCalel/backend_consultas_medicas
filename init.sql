DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'consultasDB') THEN
      CREATE DATABASE "consultasDB";
   END IF;

   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'AdminDB') THEN
      CREATE USER "AdminDB" WITH PASSWORD 'fasdf15876asf54d';
   END IF;

   GRANT ALL PRIVILEGES ON DATABASE "consultasDB" TO "AdminDB";
END $$;