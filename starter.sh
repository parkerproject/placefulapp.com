#!/bin/sh

if [ $(ps aux | grep $USER | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
  export PATH=/usr/local/bin:$PATH
  #export NODE_ENV=production
  cd /var/www/Placeful--landing && pm2 start server.js >> forever.log 2>&1

fi
