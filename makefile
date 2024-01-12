# Detect the operating system
OS := $(shell uname)

# Set Docker Compose command based on the operating system
ifeq ($(OS),Linux)
	DOCKER_COMPOSE = sudo docker-compose
else
	DOCKER_COMPOSE = docker compose
endif

# Targets
.PHONY: build exec up down seeder refresh log restart

# Build the Docker containers
build:
	$(DOCKER_COMPOSE) build

# Execute a bash shell inside the app container (non-sudo)
exec:
	$(DOCKER_COMPOSE) exec app bash

# Bring up the Docker containers (non-sudo)
up:
	$(DOCKER_COMPOSE) up

# Bring down the Docker containers (non-sudo)
down:
	$(DOCKER_COMPOSE) down

# Run database seeders (non-sudo)
seeder:
	$(DOCKER_COMPOSE) exec app sh -c "cd src && npx sequelize-cli db:seed:all"

# Refresh the environment by bringing down and then up the Docker containers (non-sudo)
refresh: down up

#Restart app
restart: 
	$(DOCKER_COMPOSE) restart app