/* Install Express */

$ npm install express --save
npm install body-parser --save
npm install --save multer

/* Install Mongoose */

npm install mongoose@4.5.8 --save

/* Install Angular + Routes */

npm install angular
npm install angular-route

/* Install JSON Web Token */

npm install jsonwebtoken --save
npm install express-jwt --save

/* Install Passport + Local */

npm install passport --save
npm install passport-local --save

/* Install MongoDB */

sudo apt-get install -y mongodb-org

/* Set up MongoDB */

$ mkdir data
$ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
$ chmod a+x mongod

/* Run MongoDB */

$ ./mongod