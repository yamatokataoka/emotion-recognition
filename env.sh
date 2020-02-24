#!/bin/bash
set -ex

# install ssh
apt-get update && apt-get -y install ssh

mkdir -p ~/.ssh
cp -prf /home/workspace/.ssh ~/

# git setup
git config --global user.email "34284486+yamatokataoka@users.noreply.github.com"
git config --global user.name "yamatokataoka"