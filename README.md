# Installation

## The project can be run locally. It is self contained. You must have a Mysql database running.

1. Set up the database settings in the .env file.
2. Run `npm run sync` to sync the database structure to the project.
3. Run `npm run start` to start the project in a production environment or `npm run start:dev` to run it with a watcher to restart it on file change.


## The project can also be run in a docker environment. The database is saved in the `./db-data` folder.

1. Run `docker-compose build`
2. Run `docker-compose up db api-sync`
3. Run `docker-compose up db api`

# Caveats
Keep in mind that the `sync` command drops all of the tables in the database and therefore it cannot run if the `NODE_ENV` environment variable is set to 'production'.