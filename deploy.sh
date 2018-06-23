#!/usr/bin/env bash
rsync ./ rs:/var/www/habr-slack-notify --delete --progress -r --exclude=node_modules
ssh rs "
. ~/.nvm/nvm.sh
cd /var/www/habr-slack-notify/
npm i 2>&1 && pm2 restart processes.json 2>&1
"
