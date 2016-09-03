# updo

/* Development Documentation */

Push to GitHub repo:
https://gist.github.com/jboulhous/6007980

/* Product Documentation */

Run server.js using Node: node server.js

GET - /api/addUser/:name/:sp    [string name, bool sp]
 Add a new User with specified name and use specified bool to set if they are a service provider. 
 User IDs increment by 1 and are never reused.
 
GET - /api/bookAppt/:userID/:providerID/:dateTime    [int consumerID, int providerID, DateTime dateTime]
 Create a new Appointment between user with specified ID and provider with specified ID at the specified dateTime. 
 Appointment IDs increment by 1 and are never reused. Newly created appointments have a status of false (unconfirmed). 

 GET - /api/*<br /><br />\
  &nbsp&nbsp&nbsp&nbspPrints the Web API documentation.<br /><br />\
 GET - /api/addUser/:name/:serviceProvider&nbsp&nbsp&nbsp&nbsp[string name, bool serviceProvider]<br /><br />\
  &nbsp&nbsp&nbsp&nbsp Add a new User with specified name and use specified bool to set if they are a service provider.<br />\
  &nbsp&nbsp&nbsp&nbspUser IDs increment by 1 and are never reused.<br /><br />\
 GET - /api/bookAppt/:userID/:providerID/:dateTime&nbsp&nbsp&nbsp&nbsp[int userID, int providerID, DateTime dateTime]<br /><br />\
  &nbsp&nbsp&nbsp&nbspCreate a new Appointment between user with specified ID and provider with specified ID at the specified dateTime.<br />\
  &nbsp&nbsp&nbsp&nbspAppointment IDs increment by 1 and are never reused. Newly created appointments have a status of false (unconfirmed).<br /><br />\
 GET - /api/confirmAppt/:apptID&nbsp&nbsp&nbsp&nbsp[int apptID]<br /><br />\
  &nbsp&nbsp&nbsp&nbspConfirm the Appointment with the specified appointment ID by changing its status from false to true.<br /><br />\
 GET - /api/deleteAppt/:apptID&nbsp&nbsp&nbsp&nbsp[int apptID]<br /><br />\
  &nbsp&nbsp&nbsp&nbspDelete the Appointment with the specified appointment ID.<br /><br />\
 GET - /api/deleteUser/:userID&nbsp&nbsp&nbsp&nbsp[int userID]<br /><br />\
  &nbsp&nbsp&nbsp&nbspDelete the User with the specified user ID.<br /><br />\
 GET - /api/getAppt/:apptID&nbsp&nbsp&nbsp&nbsp[int apptID]<br /><br />\
  &nbsp&nbsp&nbsp&nbspReturns the Appointment with the specified appointment ID.<br /><br />\
 GET - /api/getUser/:userID&nbsp&nbsp&nbsp&nbsp[int userID]<br /><br />\
  &nbsp&nbsp&nbsp&nbspReturns the User with the specified user ID.<br /><br />\
 GET - /api/listAppts<br /><br />\
  &nbsp&nbsp&nbsp&nbspReturns the array of all Appointment objects.<br /><br />\
 GET - /api/listUsers<br /><br />\
  &nbsp&nbsp&nbsp&nbspReturns the array of all User objects.<br /><br />\