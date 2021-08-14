# Node.js-Sequelize-Express-Boilerplate
## _with CICD and Jest test framework_

[![Node.js CI](https://github.com/FranklinThaker/NodeJs-Sequelize-Express-Jest-CICD-BoilerPlate/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/FranklinThaker/NodeJs-Sequelize-Express-Jest-CICD-BoilerPlate/actions/workflows/ci.yml)

## Installation

This boilerplate requires [Node.js](https://nodejs.org/) v12+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd NodeJs-Sequelize-Express-Jest-CICD-BoilerPlate
nano .env [add required variables -> I have added .env.local for example]
npm i
npm start
npm test [to run tests -> this is precisely written for Postgres DB, so you might wanna change package.json test scripts for that.]
If you want to remove CICD, just delete .github/workflows folder.
```
#
# How to manage in production mode ? [Create, delete, view logs, etc.]
```sh
npm i pm2 -g
pm2 start production.config.json
pm2 startup systemd
pm2 save
pm2 delete all [to delete processed attached with pm2]
pm2 logs [to view logs]
```

# Thank you :)
#
## Feel free to connect with me on:
```sh
https://www.instagram.com/axel_blaze_csgo/
https://www.youtube.com/c/FranklinThaker
```