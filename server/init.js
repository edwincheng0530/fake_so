// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
const express = require('express')
const app = express()

let userArgs = process.argv.slice(2);
let arg_username = userArgs[0];
let arg_password = userArgs[1];

const bcrypt = require('bcrypt');
const saltRounds = 10;

let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let User = require('./models/users');
let Comment = require('./models/comments')

let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const createAdmin = async () => {
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(arg_password, salt);
    
    let admin_details = {
        username: arg_username,
        email: 'admin@gmail.com',
        password: passwordHash,
        admin: true
    }
    let admin = new User(admin_details);
    admin.save();
    return admin;
}

const createUsers = async () => {
    const salt = await bcrypt.genSalt(saltRounds);
    const pwHash1 = await bcrypt.hash('cse', salt);
    const pwHash2 = await bcrypt.hash('316', salt);

    let user1 = {
        username: 'edwin',
        email: 'ed@gmail.com',
        password: pwHash1,
        reputation: 50
    }

    let user2 = {
        username: 'yuhang',
        email: 'yu@gmail.com',
        password: pwHash2
    }
    let new_user1 = new User(user1);
    new_user1.save();
    let new_user2 = new User(user2);
    new_user2.save();
}

function tagCreate(name, user) {
    let tag = new Tag({name: name, create_by: user});
    return tag.save();
  }

function answerCreate(text, ans_by, ans_date_time, comments) {
    let answer_details = {
        text: text,
        ans_by: ans_by,
        comments: comments
    }
    if(ans_date_time != false) answer_details.ans_date_time = ans_date_time;

    let answer = new Answer(answer_details);
    return answer.save();
}

function commentCreate(text, comm_by) {
    let comment = new Comment({text: text, comm_by: comm_by});
    return comment.save()
}

function questionCreate(title, text, summary, tags, answers, asked_by, comments) {
    question_details = {
        title: title,
        text: text,
        summary: summary,
        tags: tags,
        answers: answers,
        asked_by: asked_by,
        comments: comments
    }

    let question = new Question(question_details);
    return question.save();
}

const populate = async () => {
    let admin = await createAdmin();
    let users = await createUsers();
    let t1 = await tagCreate('admin', admin);
    let t2 = await tagCreate('cool', admin);
    let ac1 = await commentCreate('I have so much power over all you plebeians', admin);
    let a1 = await answerCreate('This is simply just some filler text to show how cool I am as an admin', admin, false, [ac1] );
    let qc1 = await commentCreate('Thats right, I am indeed an admin', admin);
    await questionCreate('Admin Powers', 'I am an admin. Thus, this is the first question that all shall first see.', 'Admin gets cool powers', [t1,t2], [a1], admin, [qc1]);
    if(db) db.close();
}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err)
        if(db) db.close();
    })