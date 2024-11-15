DC = docker compose
EXEC = docker exec
EXEC_IT = docker exec -it
LOGS = docker logs

DEV_FILE = docker_compose/app.dev.yaml
PROD_FILE = docker_compose/app.yaml
APP_CONTAINER = frontend_main-app

.PHONY: dev, dev-down, prod, prod-down
.PHONY: app-logs
.PHONY: proxy-reload

dev:
		${DC} -f ${DEV_FILE} up --build -d

dev-down:
		${DC} -f ${DEV_FILE} down

prod:
		${DC} -f ${PROD_FILE} up --force-recreate --build -d

prod-down:
		${DC} -f ${PROD_FILE} down

app-logs:
		${LOGS} ${APP_CONTAINER} -f

proxy-reload:
		${EXEC_IT} ${APP_CONTAINER} nginx -s reload