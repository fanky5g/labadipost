FROM node:4.3.2

RUN useradd --user-group --create-home --shell /bin/false labadiadmin &&\
  npm install --global npm@3.7.5

ENV HOME=/home/labadiadmin

USER labadiadmin
WORKDIR $HOME