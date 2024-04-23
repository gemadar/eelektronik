# Use the official PostgreSQL base image
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_DB=eelektronik
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=ro777ot.!@@%

# Copy the SQL script for initialization
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432