# e-learning

e-learning is an online learning platform built with Node.js, designed to provide a seamless and interactive learning experience similar to Udemy.

## Features

- **Course Catalog:** Explore a diverse range of courses covering various topics.
- **User Authentication:** Register, log in, and manage your profile.
- **Enrollment:** Enroll in courses to access content and track progress.
- **Instructor Dashboard:** Manage courses, view student progress, and interact with enrolled users.
- **Interactive Learning:** Engage with quizzes, assignments, and discussion forums.

## Getting Started

### Prerequisites

- Docker installed and running
- Make command installed
### Project structure
   ```bash
   E-learning-nodejs-app/
   │
   ├── swagger-api.yaml
   ├── makefile (All command here)
   ├── .env
   ├── Dockerfile
   ├── docker-compose.yml
   ├── src/
   │   └── ... (Mã nguồn của ứng dụng Node.js)
   ├── nginx/
   │   └── nginx.conf
   └── postgres-data/ (Thư mục chứa dữ liệu của PostgreSQL)
   ```
### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/phucchp/e-learning.git
2. Build docker image:
   >With Window or MacOS
   ```bash
   docker compose build
   ```
   >With Linux
   ```
   sudo docker compose build
   ```
   >Or using make command
   ```
   make build
   ```
3. Set up environment:
   >Copy environment example to .env and fill values in .env file
   ```
   cp .env.example .env
   ```
4. Run project:
   ```
   docker compose up
   ```
   >Or using make command (For Linux, Window and MacOs)
   ```
   make up
   ```
5. Open new terminal and run commands below:
   ```
   docker compose exec app sh -c "npm install"
   ```
   ```
   docker compose exec app sh -c "npx sequelize-cli db:create"
   ```
6. Check project is running:
   >Once all containers are up and running, you can access the applications through the following URLs:
   ```
   http://localhost:80/api
   ```
### If you get an error
   ###### Try this command
   ```
   docker compose exec app sh -c "npm install"
   ```
   ###### Or use Makefile command
   ```
   make fix
   ```
This README provides a clear and concise guide to setting up, configuring, and running the E-learning NodeJS project using Docker Compose. If any issues arise, double-check the configuration steps and ensure that Docker services are running correctly.
## Project Makefile Guide
This Makefile provides a set of convenient commands to manage a Dockerized application. It simplifies the execution of various tasks related to building, starting, stopping, and managing the database of your application. Below are the available commands and their descriptions:
## Prerequisites
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [sequelize-cli](https://sequelize.org/)
### Usage

#### 1. Build Docker Containers
Build the Docker containers for the application.
```
make build
```
#### 2. Execute Bash Shell in App Container
Access a bash shell inside the application container.
```
make exec
```
#### 3. Start Docker Containers
Start the Docker containers for the application.
```
make up
```
#### 4. Stop Docker Containers
```
make down
```
#### 5. Run Database Seeders
Run database seeders to populate the database with initial data.
```
make seeder
```
#### 6. Refresh Environment
Bring down and then up the Docker containers to refresh the environment.
```
make refresh
```
#### 7. Restart App Container
```
make restart
```
#### 8. Start & Stop App Container
```
make start
```
```
make stop
```
#### 9. Create Database
Create the database using sequelize-cli.
```
make create-database
```
#### 10. Run Migrations
```
make migration
```
#### 11. Undo Migration
>Undo Last Migration (Undo the most recent database migration.)
```
make migration
```
>Undo All Migrations (Undo all database migrations.)
```
make migration-undo-all
```
#### 12. Generate Seed File
```
make generate-seed NAME=name-seed
```
#### 12. Generate Migration File
```
make generate-migration NAME=name-migration
```
#### 12. Fix Dependencies
Reinstall npm dependencies and restart the application container.
```
make fix
```
## Set up Elasticsearch
Set up Elasticsearch with docker:
## Prerequisites
- [Docker](https://www.docker.com/)
- [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
### Usage

#### 1. Setup "vm.max_map_count" on your system
##### Permanent Change.
1.1 Open the /etc/sysctl.conf file in a text editor with root privileges. For example:
```
sudo nano /etc/sysctl.conf
```
1.2 Add the following line to the file:
```
vm.max_map_count=262144
```
1.3 Save the file and exit the editor.
1.4 Apply the changes:
```
sudo sysctl -p
```
##### Docker Environment.
If you are running Elasticsearch inside a Docker container, you need to ensure the host system has the correct vm.max_map_count setting. You can achieve this by running the following command on the host machine:
```
sudo sysctl -w vm.max_map_count=262144
```