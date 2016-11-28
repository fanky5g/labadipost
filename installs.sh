#!/bin/bash
echo "installing nodejs and npm"

  echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
  . ~/.bashrc
  mkdir ~/local
  mkdir ~/node-latest-install
  cd ~/node-latest-install
  curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
  ./configure --prefix=~/local
  make install
  curl https://www.npmjs.org/install.sh | sh

echo "installing glide golang vendoring tool"
curl https://glide.sh/get | sh