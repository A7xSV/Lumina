# Lumina
Display movies using the OMDB api and add/remove favourites if authenticated

[View lumina.pdf for detailed description and screenshots :page_facing_up:](https://github.com/A7xSV/Lumina/blob/master/lumina.pdf)

## File Structure
|  Name  | Description |
|  ----- | ----------- |
| [lumina-test](https://github.com/A7xSV/Lumina/blob/master/lumina-test) | Frontend of the application using Angular 8 |
| [backend](https://github.com/A7xSV/Lumina/blob/master/backend) | Backend of the application using Node.js |

## Setup Instructions
Clone (or download) this repository and follow the steps below after navigating into folder Lumina (cloned) to setup the local backend and frontend servers:-

### Pre-requisites
Install Node.js - https://nodejs.org/en/ <br>
Install Angular CLI - https://cli.angular.io/ <br>
Set up MySQL server - https://dev.mysql.com/downloads/mysql/ or follow below <br>
Homebrew for macOS - https://brew.sh/ <br>

## Setup MySQL
Install using brew <br>
`brew install mysql` <br><br>
Start mysql <br>
`brew services start mysql` <br><br>
Set username and password as 'root' and 'password' as used in Node.js connection <br>
`mysqladmin -u root password 'password'` <br><br>
Enter mysql and input password 'password' or as set when prompted <br>
`mysql -u root -p` <br><br>
Create database luminaTest (accessed by Node.js backend) <br>
`CREATE DATABASE luminaTest` <br><br>

<b>Make sure the SQL server is running before starting Node.js server</b>

## Setup Node.js Backend
Navigate to backend directory <br>
`cd backend` <br><br>
Install dependencies <br>
`npm install`<br><br>
Start server or optionally, start server using nodemon to watch file for changes
`node index.js` OR `npm run start:server` <br><br>
Create table users by navigating to the below URL on a browser (make a GET request) <br>
`http://localhost:3000/createtable?tableName=users` <br><br>
Insert intial users (GET request) <br>
`http://localhost:3000/insertInitial` <br><br>

<b>Make sure the Node.js server is running before starting Angular server</b>


## Setup Angular frontend
Navigate to lumina-test directory <br>
`cd lumina-test` <br><br>
Install dependencies <br>
`npm install`<br><br>
Start server and open in browser <br>
`ng serve --open`<br><br>

All done! :tada:
