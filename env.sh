#!/bin/bash
set -ex

# install ssh
apt-get update && apt-get -y install ssh

mkdir -p ~/.ssh
cp -prf /home/workspace/.ssh ~/

# git setup
git config --global user.email "34284486+yamatokataoka@users.noreply.github.com"
git config --global user.name "yamatokataoka"

# Heroku
add-apt-repository "deb https://cli-assets.heroku.com/branches/stable/apt ./"
curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -
apt-get update && apt-get install heroku
