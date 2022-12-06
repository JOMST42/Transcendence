#!/usr/bin/env sh
set -euo pipefail
cd /api

echo "CHECKING PRISMA CONFIGURATION..."
ERROR=1

while [$ERROR == 1]
do
	npx prisma migrate dev
	npx prisma db seed
done 

echo "PRISMA CONFIGURATION IS DONE!"

exec "$@"
