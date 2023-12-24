# Fake Stack Overflow
This project is a replica of Stack Overflow, providing users with functionalities to ask questions, answer queries, and view all questions available on the platform.

## Features

- **User Authentication**: Allows users to create accounts, log in, and log out securely.
- **User Profile**: Allow signed in users to view and edit their own questions, answers, and tags.
- **Asking Questions**: Enables users to post new questions on the platform.
- **Answering Questions**: Allows registered users to provide answers to posted questions.
- **Viewing Questions**: Provides an interface to view all questions and all tags available on the platform.
- **Search Functionality**: Allows users to search for specific questions, tags, and text based on keywords or categories.
- **Upvoting**: Allows users with a specific amount of reputation to be able to upvote and downvote questions and answers
- **Commments**: Allow users to add comments to questions and answers for further clarification


## Instructions to setup and run project
In _server_ directory
1. npm install
2. npm install express
3. npm install mongoose
4. npm install nodemon
5. npm install cors
6. npm install bcrypt
7. npm install express-session
8. npm install connect-mongo


In _client_ directory
1. npm install
2. npm install axios

### Run init.js in _server_ directory via:

node init.js <admin_username> <admin_password>  
The email for this admin is: admin@gmail.com.

Two extra users will also be automatically created upon running this:  
Username: edwin <br>
Reputation: 50 <br>
**email: ed@gmail.com <br>
password: cse** <br>

Username: yuhang <br>
Reputation: 0 <br>
**email: yu@gmail.com <br>
password: 316** <br>
