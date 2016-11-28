[Install golang](https://golang.org/doc/install) by following your architecture instructions. Make sure to setup gopath too. You'll find notes on the same page
[Install docker](https://docs.docker.com/engine/installation/), A container management tool for building microservices based containerized applications.
[Install docker-compose](https://docs.docker.com/compose/install/)

**This is a private repo..you need invite from admin before you can work in this repo**
[Setup ssh keys for bitbucket.org..you'll need it](https://confluence.atlassian.com/bitbucket/set-up-ssh-for-git-728138079.html)
Run go get -u bitbucket.org/fanky5g/labadipost

Run shell command: docker-compose up -d
  - This downloads multiple docker containers on first run so might take a while.
Subsequent runs:
  - To run web client: docker-compose up nginx labadiweb
  - To run picture server: docker-compose up labadipics
  - To run feed daemon: docker-compose up labadifeeds