# recommendersystemapp production nodejs angularjs mongodb

## Using Docker
### Build the image:
docker build -t tfg-production/node-web-app .
### Run the image:
docker run -p 49160:3000 -d tfg-production/node-web-app
### Print the output:
docker ps - get container ID
docker logs <container id> - print app output
docker exec -it <container id> /bin/bash - enter the container (if needed)
### Test:
docker ps
curl -i localhost:49160

