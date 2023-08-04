build:
	docker compose -f docker-compose-prod.yml build 

up:
	docker compose -f docker-compose-prod.yml up -d

logs:
	docker compose -f docker-compose-prod.yml logs -f -t

deploy:
	docker compose -f docker-compose-prod.yml exec app yarn db:deploy

seed:
	docker compose -f docker-compose-prod.yml exec app npx tsx prisma/seed.ts

down:
	docker compose -f docker-compose-prod.yml down
