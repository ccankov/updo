# updo

/* Development Documentation */

Push to GitHub repo:
https://gist.github.com/jboulhous/6007980

/* Product Documentation */

Run server.js using Node: node server.js

Get array of all users: http://69.181.171.240:8080/listUsers

Get specific user: http://69.181.171.240:8080/:id , http://69.181.171.240:8080/1 , http://69.181.171.240:8080/2 , etc.

Add a user: http://69.181.171.240:8080/addUser/:name/:serviceProvider , http://69.181.171.240:8080/addUser/danny/false , http://69.181.171.240:8080/addUser/andrea/1

Delete a user: http://69.181.171.240:8080/deleteUser/:id , http://69.181.171.240:8080/deleteUser/4

List all appointments: http://69.181.171.240:8080/listAppts

Book an appointment: http://69.181.171.240:8080/bookAppt/:consumerID/:providerID/:dateTime , http://69.181.171.240:8080/bookAppt/1/3/9-16-2016 12:00:00 , etc

Confirm an appointment: http://69.181.171.240:8080/confirmAppt/:id , http://69.181.171.240:8080/confirmAppt/1

Delete an appointment: http://69.181.171.240:8080/deleteAppt/:id , http://69.181.171.240:8080/deleteAppt/1