FROM ubuntu:latest

RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN apt-get update && apt-get install --no-install-recommends -y \
    ca-certificates \
    curl \
    mercurial \
    git-core \
    build-essential

RUN npm install gulp -g

RUN curl -s https://storage.googleapis.com/golang/go1.7.3.linux-amd64.tar.gz | tar -v -C /usr/local -xz
ENV PATH "$PATH:/usr/local/go/bin"
ENV GOPATH /go
ENV PATH "PATH=$PATH:$GOPATH/bin"

#ADD . /go/src/labadiweb
WORKDIR /go/src/labadiweb

EXPOSE 5000 5001
