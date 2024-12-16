# CHMNU Schedule app Frontend
### Stack: React, Vice, TypeScript, Docker, Makefile

---

This is the frontend part of the schedule app for CHMNU students and teachers.

---

## Requirements:

- [Docker](https://www.docker.com/get-started/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker compose](https://docs.docker.com/compose/install/)
- [GNU Make](https://www.gnu.org/software/make/)(on linux), [WSL Ubuntu](https://ubuntu.com/desktop/wsl)(on windows)


---
## How to use(Windows):
1. #### Clone the repo:
    ```bash
   git clone https://github.com/uzineck/chmnu_schedule_app_frontend.git
   cd chmnu_schedule_app_frontend
   ```
2. #### Open Docker Desktop
3. #### Open WSL Ubuntu in your terminal and go to cloned application folder
4. #### Create `.env` file from `.env.example`, make changes if needed
5. #### With Make command run:
     ```bash
     make dev # to build development mode
     make prod # to build production mode
     ```
6. #### In your browser go to:

     - `localhost:3000` - if development mode
     - `localhost:81` - if production mode

7. #### Implemented Commands

   - `make app-logs` - follow the logs in app container
   - `make dev-down` - down development container
   - `make prod-down` - down production container
   - `make proxy-reload` - if any changes were made to nginx config, while server is on, write this command
