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
3. Run project:
   ```
   docker compose up
   ```
4. Open new terminal and run commands below:
   ```
   docker compose exec app sh -c "npm install"
   ```
   ```
   docker compose exec app sh -c "npx sequelize-cli db:create"
   ```
### If you get an error
   ###### Try this command
   ```
   docker compose exec app sh -c "npm install"
   ```