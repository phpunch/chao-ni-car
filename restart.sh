docker rm se_backend_1 se_frontend_1
docker image rm se_frontend se_backend
docker-compose build
docker-compose up