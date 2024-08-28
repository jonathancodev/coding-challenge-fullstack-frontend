#!/bin/bash
docker image inspect coding-challenge-fullstack-frontend:latest >/dev/null 2>&1 && echo Image already created || docker build -t coding-challenge-fullstack-frontend:latest .
docker-compose up -d