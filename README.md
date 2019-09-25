[Install golang:](https://golang.org/doc/install) by following your architecture instructions.
**Make sure to setup GOPATH. You'll find notes on the same page**

[Install docker](https://docs.docker.com/engine/installation/), a container management tool for building microservices based containerized applications.
[Install docker-compose](https://docs.docker.com/compose/install/)

#Change directory to labadipost:
Run: cd $GOPATH/bitbucket.org/fanky5g/labadipost
Run: make

Run: **docker-compose up**
 This downloads multiple docker containers on first run so might take a while.
Subsequent runs:
  - To run web client: **docker-compose up nginx labadiweb**
  - To run image server: **docker-compose up nginx labadipics**
  - To run feed daemon: **docker-compose up labadifeeds**
