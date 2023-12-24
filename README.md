[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/9NDadFFr)
Add design docs in *images/*

## Instructions to setup and run project
In _server_
1. npm install
2. npm install express
3. npm install mongoose
4. npm install nodemon
5. npm install cors
6. npm install bcrypt
7. npm install express-session
8. npm install connect-mongo


In _client_
1. npm install
2. npm install axios

### Run init.js in _server_ via:

node init.js <admin_username> <admin_password> <br>
The email for this admin is: admin@gmail.com. <br><br>
Two extra users will also be automatically created upon running this: <br>
Username: edwin <br>
Reputation: 50 <br>
**email: ed@gmail.com <br>
password: cse** <br>

Username: yuhang <br>
Reputation: 0 <br>
**email: yu@gmail.com <br>
password: 316** <br>


## Yuhang Jiang Contribution
- Implement home page for registered and guest users
- Implement comments for questions and answers
- Implemented sessions for users to stay logged in after reload
- Implemened the page feature for questions, answers and comments
- Added reputation validation for posting comments and vote

## Edwin Cheng Contribution
- Implement logging in and register
- Implement voting for questions and answers
- Create User Profile and User Questions, Tags, Answers
- Create Admin Profile and Admin permissions
- Create UML Diagrams
