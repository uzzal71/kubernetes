# Simple application - Voting Application
- voting-app
- in-memory DB
- postgres DB
- worker
- result-app

# Voting application images
- redis (in-memory)
- voting-app image
- result-app image
- postgres image

# run image
```bash
docker run -d --name=redis redis
docker run -d --name=db postgres:9.4
docker run -d --name=vote -p 5000:80 voting-app
docker run -d --name=result -p 5001:80 result-app
docker run -d --name=worker worker
```
# Use link command for connection between two or multiple container
```bash
docker run -d --name=redis redis
docker run -d --name=db postgres:9.4
docker run -d --name=vote -p 5000:80 --link redis:redis voting-app
docker run -d --name=result -p 5001:80 --link db:db result-app
docker run -d --name=worker --link db:db --link redis:redis worker
```

# Example; Voting app (Kubernetes)
### Goals
- Deploy Containers
- Enable Connectivity
- External Access

Steps:
- Deploy Pods
    - vote-app(container port: 80)
    - result-app(container port: 80)
    - redis(container port: 6379)
    - postgres(container port: 5432)
    - worker
- Create Services(ClusterIP)
    - redis
    - db
- Create Service(NodePort/Load Balancer)
    - voting-app(Access Port: 5000)
    - result-app(Access Port: 5001)