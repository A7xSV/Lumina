# Lumina
Display movies using the OMDB api and add/remove favourites if authenticated

<b>View lumina.pdf for detailed description and screenshots</b> :page_facing_up:

## File Structure
|  Name  | Description |
|  ----- | ----------- |
| [lumina-test](https://github.com/A7xSV/Lumina/blob/master/lumina-test) | Frontend of the application in Angular 8 |
| [backend](https://github.com/A7xSV/Lumina/blob/master/backend) | Backend of the application in Node.js |

## Setup Instructions
Clone (or download) this repository and follow the steps below after navigating into folder Lumina (cloned) to setup the local backend and frontend servers:-

### Pre-requisites
Install Node.js - https://nodejs.org/en/ <br>
Install Angular CLI - https://cli.angular.io/ <br>
Set up MySQL server - https://dev.mysql.com/downloads/mysql/ or follow below <br>
Homebrew for macOS - https://brew.sh/ <br>

### Setup MySQL
Install using brew <br>
`brew install mysql` <br><br>
Start mysql <br>
`brew services start mysql` <br><br>
Set username and password <br>
`mysqladmin -u root password 'password'` <br><br>
Enter mysql and input password 'password' or as set when prompted <br>
`mysql -u root -p` <br><br>
Create database luminaTest (accessed by Node.js backend) <br>
`CREATE DATABASE luminaTest` <br><br>

### Setup Node.js Backend
Navigate to backend directory <br>
`cd backend` <br><br>
Install dependencies <br>
`npm install`<br><br>
Start server <br>
`node index.js` <br><br>
Optional (Start server using nodemon to watch file for changes) <br>
`npm run start:server` <br><br>
Create table users by navigating to the below URL on a browser <br>
`http://localhost:3000/createtable?tableName=users` <br><br>
Insert intial users <br>
`http://localhost:3000/insertInitial` <br><br>


### Setup Angular frontend
Navigate to lumina-test directory <br>
`cd lumina-test` <br><br>
Install dependencies <br>
`npm install`<br><br>
Start server and open in browser <br>
`ng serve --open`<br><br>

All done! :tada:
