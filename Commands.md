/* Install Express */

$ npm install express --save

/* Install Mongoose */

npm install mongoose@4.5.8 --save

/* Install MongoDB */

sudo apt-get install -y mongodb-org

/* Set up MongoDB */

$ mkdir data
$ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
$ chmod a+x mongod

/* Run MongoDB */

$ ./mongod