#!/bin/sh

echo "Generating SQL with drizzle kit..."

pnpm drizzle-kit generate
echo "Running database migrations..."

pnpm drizzle-kit migrate
echo "Pushing schema changes to the DB..."

pnpm drizzle-kit push
echo "All Done 🌵"