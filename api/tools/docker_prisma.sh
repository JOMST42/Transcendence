#!/usr/bin/env sh
set -euo pipefail
cd /api

echo "CHECKING PRISMA CONFIGURATION..."

while [$ERROR != 0]
do
	npx prisma migrate dev
	$ERROR = $?
	npx prisma db seed
done 

echo "PRISMA CONFIGURATION IS DONE!"

exec "$@"
