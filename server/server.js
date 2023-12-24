// Application server
const express = require('express');
const app = express();
const port = 8000;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const bcrypt = require('bcrypt');
const saltRounds = 10;

let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let User = require('./models/users');
let Comment = require('./models/comments')

let mongoose = require('mongoose');
const { restart } = require('nodemon');
const comments = require('./models/comments');
const questions = require('./models/questions');
let mongoDB = 'mongodb://127.0.0.1/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb://localhost:27017/your_database_name', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  }));

app.listen(port, () => {
    console.log(`Opening on port ${port}`);
})

// const sessionSecret = process.argv[2] || 'I am not telling you';
// console.log(sessionSecret);
// console.log('IAMTESTING');
// console.log(process.argv[2]);

app.use(session({
    name: "session_name",
    secret: 'I am not telling you',
    cookie: {httpOnly: true, maxAge: 24 * 60 * 60 * 1000},
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1/fake_so" }),

}));

async function isSession(req,res,next){
    if(req.session.user){
        const updated_user = await User.findOne({username: req.session.user.username});
        req.session.user = updated_user;
        next();
    }
    else{
        res.send({success: false});
    }
}

app.get('/checkSession', isSession, (req, res) => {
    const user = req.session.user;
    const email = req.session.email;
    res.send({ success: true, user, email });
  });
// New code to register and login
app.post('/newuser', async (req, res) =>{
    try {
        let email = await User.find({email: req.body.email});
        if(email.length !== 0) {
            res.send(false);
        } else {
            const salt = await bcrypt.genSalt(saltRounds);
            const pwHash = await bcrypt.hash(req.body.password, salt);
            let newUser = new User({username: req.body.username, email: req.body.email, password: pwHash, join_time: new Date()});
            newUser.save();
            res.send(true);
        }
    } catch {
        console.error('Error creating new user');
        res.status(500).send('Error creating new user');
    }
});

app.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    const user = await authenticateUser(email, password);

    if(!user){
        res.send("email");
        
    }
    else if(user=== "wrong password"){
        res.send("password")
    }
    else{
        req.session.user = user;
        res.json(user);
    }
});

app.post('/logout', async(req, res)=>{
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.clearCookie("session_name");
                res.send({ success: true });
            }
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send('Internal Server Error');
    }
});


async function authenticateUser(email, pass){
    try{

    
        const user = await User.findOne({email: email});
        if(!user){
            return null;
        }
        
        const verdict = await bcrypt.compare(pass, user.password)
        if(verdict){
            return user;
        }
        else{
            return "wrong password";
        }
    }
    catch(err){
        console.error('Error during authentiation: ', error)
        return null;
    }
}

app.post('/updateUser', async (req, res) =>{
    try{

        const user = await User.find({username: req.body.username});
        // await user.save();
        res.send(user);
    }
    catch(err){

    }
})

//New Code to add comments
app.post('/newQuestionComment', async (req, res)=>{
    try{
        const question = req.body.question;
        const newComment = await insertComment(req.body.comment);
        const q = await Question.findOneAndUpdate({_id: question._id}, {$push: {comments:{$each:[newComment._id], $position: 0}}});
        await q.save();
        res.send(await Question.find({_id: question._id}).populate('tags').populate({path: 'answers',
        populate: [
        {
            path: 'ans_by',
            model: 'User'
        },
        {
            path: 'comments',
            model: 'Comment',
            populate:{
                path: 'comm_by',
                model: 'User'
            }
        }
        ]})
    .populate('asked_by')
    .populate({path: 'comments',
        populate:{
            path: 'comm_by', 
            model: 'User'}}));
    }
    catch(err){
        console.log('Error writing new commment', err);
        res.status(500).send('Error writing comment');
    }
})

app.post('/newAnswerComment', async (req, res) => {
    try{
        const answer = req.body.answer;
        const newComment = await insertComment(req.body.comment);
        const a = await Answer.findOneAndUpdate({_id: answer._id}, {$push: {comments: {$each: [newComment._id], $position: 0}}});
        await a.save();
        res.send(await Question.find({answers: {$in: [answer._id]}}).populate('tags').populate({path: 'answers',
        populate: [
        {
            path: 'ans_by',
            model: 'User'
        },
        {
            path: 'comments',
            model: 'Comment',
            populate:{
                path: 'comm_by',
                model: 'User'
            }
        }
        ]})
    .populate('asked_by')
    .populate({path: 'comments',
        populate:{
            path: 'comm_by', 
            model: 'User'}}));
    }
    catch(err){
        console.log('Error writing new commment', err);
        res.status(500).send('Error writing comment');
    }
})



//New Code to Insert comments
async function insertComment(comment){
    // const name = User.findOne({_id: comment.comm_by._id})
    const commentUserID = await User.findOne({username: comment.comm_by});
    const id = commentUserID._id;
    const c = {text: comment.text, comm_by: id, upvote: 0};

    let newComment = await new Comment(c);
    return newComment.save();
}

// Old Code to Insert Questions and Answers
let new_tags = []; 

app.post('/newquestion', async (req, res) => {
    try{
        // let newQ = insertQuestion(req.data.title, req.data.text, req.data.tags, req.data.asked_by, req.data.ask_date_time, req.data.views);
        let newQ = await insertQuestion(req.body);
        res.send(newQ);
    } catch (err){
        console.log('Error writing new question: ', err);
        res.status(500).send('Error writing question');
    }
});

app.post('/newview', async (req,res) => {
    try {
        let question = req.body;
        let q = await Question.findOneAndUpdate({_id: question._id}, {$set: {views: question.views + 1}}, {new: true });
        q.save();
        res.send(await q);
    } catch (err) {
        console.log('Error updating the view '. err);
        res.status(500).send('Error updating the view');
    }
});

app.post('/newtag', async (req, res) => {
    try{
        await insertTag(req.body.tags, req.body.user);

        res.send(new_tags);
        new_tags = [];
        
    }    catch (err){
        console.log('Error writing new tag', err);
        res.status(500).send('Error writing tag');
    }
});

app.post('/newanswer', async (req, res) => {
    try{
        let question = req.body.question;
        let newA = await insertAnswer(req.body.answer_data);
        let q = await Question.findOneAndUpdate({_id: question._id}, {$push: {answers: newA.id}});
        q.save();
        
        res.send(await Answer.find({}));
        
    }    catch (err){
        console.log('Error writing new answer', err);
        res.status(500).send('Error writing answer');
    }
});


app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find({}).populate('tags').populate({path: 'answers',
    }).populate({path: 'answers',
        populate: [
            {
                path: 'ans_by',
                model: 'User'
            },
            {
                path: 'comments',
                model: 'Comment',
                populate:{
                    path: 'comm_by',
                    model: 'User'
                }
            }
        ]
    
        }).populate('asked_by').populate({path: 'comments',
         populate:{
            path: 'comm_by', 
            model: 'User'}});
        res.send(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).send('Error fetching questions');
    }
});

app.get('/answers', async (req, res) => {
    try {
        const answers = await Answer.find({}).populate('ans_by').populate({path: 'comments', populate:{path: 'comm_by', model: User}});
        res.send(answers);
    } catch (err) {
        console.error('Error fetching answers:', err);
        res.status(500).send('Error fetching answers');
    }
})

app.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find({});
        res.send(tags);
    } catch (err) {
        console.error('Error fetching answers:', err);
        res.status(500).send('Error fetching answers');
    }
})

app.get('/users', async(req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        console.error('Error fetching answers:', err);
        res.status(500).send('Error fetching answers');
    }
})

function insertQuestion(question){
    q = {title: question.title, text:question.text, summary: question.summary, tags: question.tags, ask_date_time: new Date()};
    if(question.asked_by != false)
        q.asked_by = question.asked_by;
    if(question.ask_date_time != false)
        q.ask_date_time = question.ask_date_time;
    if(question.views != false){
        q.views = question.views;
    }

    let newQuestion = new Question(q);
    return newQuestion.save();
}

async function insertTag(tag, user){
    let current_tags = await Tag.find({});

    for(let i = 0; i < tag.length; i++) {
      let tag_exists = current_tags.some(x => x.name.toLowerCase() === tag[i].toLowerCase());
      if(tag_exists) {
        new_tags.push(current_tags.find(x => x.name.toLowerCase() === tag[i].toLowerCase()));
      } else {
        let new_name = tag[i];
        let newTag = new Tag({name: new_name, create_by: user});
        newTag.save();
        new_tags.push(newTag);
      }
    }
}

function insertAnswer(answer){
    a = {text:answer.text, ans_by: answer.ans_by};

    if(answer.ans_date_time != false)
        a.ans_date_time = answer.ans_date_time;


    let newAnswer = new Answer(a);
    return newAnswer.save();
}


app.post('/upvote', async (req, res) => {
    try {
        let type = req.body.type;
        let a;
        let b;
        if(type === 'question') {
            let user = req.body.user;
            let question = req.body.question;
            let ask_by = req.body.asked_by;
            if(question.upvotes.includes(user.email)) {
                // Remove vote from question and email from array
                a = await Question.findOneAndUpdate({_id: question._id}, {$set: {upvote: question.upvote-1}, $pull: {upvotes: user.email}});
                // Remove reputation from person who asked question
                b = await User.findOneAndUpdate({email: question.asked_by.email}, {$set: {reputation: ask_by.reputation-5}});
            } else if(question.downvotes.includes(user.email)) {
                // Remove downvote and add upvote 
                a = await Question.findOneAndUpdate({_id: question._id}, {$set: {upvote: question.upvote+2}, $push: {upvotes: user.email}, $pull: {downvotes: user.email}});
                b = await User.findOneAndUpdate({email: question.asked_by.email}, {$set: {reputation: ask_by.reputation+15}});
            } else {
                // Add vote to question and email to array
                a = await Question.findOneAndUpdate({_id: question._id}, {$set: {upvote: question.upvote+1}, $push: {upvotes: user.email}});
                // Increase reputation of person who asked question
                b = await User.findOneAndUpdate({email: question.asked_by.email}, {$set: {reputation: ask_by.reputation+5}});
            }
            await a.save();
            await b.save();
            res.send(await Question.find({_id: question._id}).populate('tags')
            .populate({path: 'answers',
                populate: [
                {
                    path: 'ans_by',
                    model: 'User'
                },
                {
                    path: 'comments',
                    model: 'Comment',
                    populate:{
                        path: 'comm_by',
                        model: 'User'
                    }
                }
                ]})
            .populate('asked_by')
            .populate({path: 'comments',
                populate:{
                    path: 'comm_by', 
                    model: 'User'}}));
        } else if(type === 'answer') {
            let user = req.body.user;
            let question = req.body.question;
            let answer = req.body.answer;
            let ans_by = req.body.ans_by;

            if(answer.upvotes.includes(user.email)) {
                // Remove vote from question and email from array
                a = await Answer.findOneAndUpdate({_id: answer._id}, {$set: {upvote: answer.upvote-1}, $pull: {upvotes: user.email}});
                // Remove reputation from person who asked question
                b = await User.findOneAndUpdate({email: answer.ans_by.email}, {$set: {reputation: ans_by.reputation-5}});
            } else if(answer.downvotes.includes(user.email)) {
                // Remove downvote and add upvote 
                a = await Answer.findOneAndUpdate({_id: answer._id}, {$set: {upvote: answer.upvote+2}, $push: {upvotes: user.email}, $pull: {downvotes: user.email}});
                b = await User.findOneAndUpdate({email: answer.ans_by.email}, {$set: {reputation: ans_by.reputation+15}});
            } else {
                // Add vote to question and email to array
                a = await Answer.findOneAndUpdate({_id: answer._id}, {$set: {upvote: answer.upvote+1}, $push: {upvotes: user.email}});
                // Increase reputation of person who asked question
                b = await User.findOneAndUpdate({email: answer.ans_by.email}, {$set: {reputation: ans_by.reputation+5}});
            }
            await a.save();
            await b.save();
            res.send(await Question.find({_id: question._id}).populate('tags')
            .populate({path: 'answers',
                populate: [
                {
                    path: 'ans_by',
                    model: 'User'
                },
                {
                    path: 'comments',
                    model: 'Comment',
                    populate:{
                        path: 'comm_by',
                        model: 'User'
                    }
                }
                ]})
            .populate('asked_by')
            .populate({path: 'comments',
                populate:{
                    path: 'comm_by', 
                    model: 'User'}}));
        } else if(type === 'comment'){
            let user = req.body.user;
            let question = req.body.question;
            let comment = req.body.comment;

            let a;
            if(comment.upvotes.includes(user.email)) {
                a = await Comment.findOneAndUpdate({_id: comment._id}, {$set: {upvote: comment.upvote-1}, $pull: {upvotes: user.email}});
            } else {
                a = await Comment.findOneAndUpdate({_id: comment._id}, {$set: {upvote: comment.upvote+1}, $push: {upvotes: user.email}});
            }
            await a.save();
            res.send(await Question.find({_id: question._id}).populate('tags')
            .populate({path: 'answers',
                populate: [
                {
                    path: 'ans_by',
                    model: 'User'
                },
                {
                    path: 'comments',
                    model: 'Comment',
                    populate:{
                        path: 'comm_by',
                        model: 'User'
                    }
                }
                ]})
            .populate('asked_by')
            .populate({path: 'comments',
                populate:{
                    path: 'comm_by', 
                    model: 'User'}}));
        }
    } catch (err) {
        console.error('Error updating vote via upvote:', err);
        res.status(500).send('Error updating upvote');
    }
})


app.post('/downvote', async (req, res) => {
    try {
        let type = req.body.type;
        let a;
        let b;

        if(type === 'question') {
            let user = req.body.user;
            let question = req.body.question;
            let ask_by = req.body.asked_by;
            if(question.downvotes.includes(user.email)) {
                a = await Question.findOneAndUpdate({_id: question._id}, {$set: {upvote: question.upvote+1}, $pull: {downvotes: user.email}});
                b = await User.findOneAndUpdate({email: question.asked_by.email}, {$set: {reputation: ask_by.reputation+10}});
            } else if(question.upvotes.includes(user.email)) {
                a = await Question.findOneAndUpdate({_id: question._id}, {$set: {upvote: question.upvote-2}, $push: {downvotes: user.email}, $pull: {upvotes: user.email}});
                b = await User.findOneAndUpdate({email: question.asked_by.email}, {$set: {reputation: ask_by.reputation-15}});
            } else {
                a = await Question.findOneAndUpdate({_id: question._id}, {$set: {upvote: question.upvote-1}, $push: {downvotes: user.email}});
                b = await User.findOneAndUpdate({email: question.asked_by.email}, {$set: {reputation: ask_by.reputation-10}});
            }
            await a.save();
            await b.save();
            res.send(await Question.find({_id: question._id}).populate('tags')
            .populate({path: 'answers',
                populate: [
                {
                    path: 'ans_by',
                    model: 'User'
                },
                {
                    path: 'comments',
                    model: 'Comment',
                    populate:{
                        path: 'comm_by',
                        model: 'User'
                    }
                }
                ]})
            .populate('asked_by')
            .populate({path: 'comments',
                populate:{
                    path: 'comm_by', 
                    model: 'User'}}));    
        } else if(type === 'answer') {
            let user = req.body.user;
            let question = req.body.question;
            let answer = req.body.answer;
            let ans_by = req.body.ans_by;

            if(answer.downvotes.includes(user.email)) {
                a = await Answer.findOneAndUpdate({_id: answer._id}, {$set: {upvote: answer.upvote+1}, $pull: {downvotes: user.email}});
                b = await User.findOneAndUpdate({email: answer.ans_by.email}, {$set: {reputation: ans_by.reputation+10}});
            } else if(answer.upvotes.includes(user.email)) {
                a = await Answer.findOneAndUpdate({_id: answer._id}, {$set: {upvote: answer.upvote-2}, $push: {downvotes: user.email}, $pull: {upvotes: user.email}});
                b = await User.findOneAndUpdate({email: answer.ans_by.email}, {$set: {reputation: ans_by.reputation-15}});
            } else {
                a = await Answer.findOneAndUpdate({_id: answer._id}, {$set: {upvote: answer.upvote-1}, $push: {downvotes: user.email}});
                b = await User.findOneAndUpdate({email: answer.ans_by.email}, {$set: {reputation: ans_by.reputation-10}});
            }
            await a.save();
            await b.save();
            res.send(await Question.find({_id: question._id}).populate('tags')
            .populate({path: 'answers',
                populate: [
                {
                    path: 'ans_by',
                    model: 'User'
                },
                {
                    path: 'comments',
                    model: 'Comment',
                    populate:{
                        path: 'comm_by',
                        model: 'User'
                    }
                }
                ]})
            .populate('asked_by')
            .populate({path: 'comments',
                populate:{
                    path: 'comm_by', 
                    model: 'User'}})); 
        }
    } catch (err) {
        console.error('Error updating vote via downvote:', err);
        res.status(500).send('Error updating downvote');
    }
})

// Delete a question
app.post('/deletequestion', async (req, res) => {
    try {
        let question = req.body.question;
        await deleteQuestion(question);
        // for(let i = 0; i < question.answers.length; i++) {
        //     await deleteAnswer(question.answers[i]);
        // }
        // for(let i = 0; i < question.comments.length; i++) {
        //     await Comment.findOneAndDelete({_id: question.comments[i]._id})
        // }
        // await Question.findOneAndDelete({_id: question._id});
        res.send('');
    } catch(err) {
        console.error('Error deleting question:', err);
        res.status(500).send('Error deleting question');
    }
});

// Edit a question
app.post('/editquestion', async (req, res) => {
    try {
        let question = req.body.question;
        await insertTag(req.body.tags, req.body.user);
        await Question.updateOne({_id: question._id}, {$set: {title: req.body.title, text: req.body.text, summary: req.body.summary, tags: new_tags}});
        new_tags = [];
        res.send(await Question.find({_id: question._id}));
    } catch(err) {
        console.error('Error deleting questions:', err);
        res.status(500).send('Error deleting question');
    }
})

// Delete a tag
app.post('/deletetag', async (req, res) => {
    try {
        let tag = req.body.tag;
        await Tag.findOneAndDelete({_id: tag._id});
        res.send('');
    } catch(err) {
        console.error('Error deleting tag:', err);
        res.status(500).send('Error deleting tag');
    }

})

// Edit a tag
app.post('/edittag', async (req, res) => {
    try {
        let tag = req.body.tag;
        let new_tag = req.body.new_tag;
        await Tag.updateOne({_id: tag._id}, {$set: {name: new_tag}});
        res.send('')
    } catch(err) {
        console.error('Error deleting tag:', err);
        res.status(500).send('Error deleting tag');
    }
})

// Delete an answer
app.post('/deleteanswer', async (req, res) => {
    try {
        let answer = req.body.answer;
        let question = req.body.question;

        await deleteAnswer(answer);
        // await Answer.findOneAndDelete({_id: answer._id});
        res.send(await Question.find({_id: question._id}).populate('tags')
        .populate({path: 'answers',
            populate: [
            {
                path: 'ans_by',
                model: 'User'
            },
            {
                path: 'comments',
                model: 'Comment',
                populate:{
                    path: 'comm_by',
                    model: 'User'
                }
            }
            ]})
        .populate('asked_by')
        .populate({path: 'comments',
            populate:{
                path: 'comm_by', 
                model: 'User'}}));
    } catch(err) {
        console.error('Error deleting tag:', err);
        res.status(500).send('Error deleting tag');
    }
})

// Edit an answer
app.post('/editanswer', async (req, res) => {
    try {
        let question = req.body.question
        let answer = req.body.answer;
        let new_answer = req.body.new_answer;
        await Answer.updateOne({_id: answer._id}, {$set: {text: new_answer}});
        // res.send(await Answer.find({_id: answer._id}))
        res.send(await Question.find({_id: question._id}).populate('tags')
        .populate({path: 'answers',
            populate: [
            {
                path: 'ans_by',
                model: 'User'
            },
            {
                path: 'comments',
                model: 'Comment',
                populate:{
                    path: 'comm_by',
                    model: 'User'
                }
            }
            ]})
        .populate('asked_by')
        .populate({path: 'comments',
            populate:{
                path: 'comm_by', 
                model: 'User'}}))
    } catch(err) {
        console.error('Error deleting tag:', err);
        res.status(500).send('Error deleting tag');
    }
})

// Delete a user
app.post('/deleteuser', async (req, res) => {
    try {
        let user_delete = req.body.user_delete;
        //Delete User
        await User.findOneAndDelete({_id: user_delete._id});
        //Delete Questions
        let questions = await Question.find({asked_by: user_delete._id}).populate('tags')
        .populate({path: 'answers',
            populate: [
            {
                path: 'ans_by',
                model: 'User'
            },
            {
                path: 'comments',
                model: 'Comment',
                populate:{
                    path: 'comm_by',
                    model: 'User'
                }
            }
            ]}).populate('asked_by')
        .populate({path: 'comments',
            populate:{
                path: 'comm_by', 
                model: 'User'}});

        for(let i = 0; i < questions.length; i++) {
            await deleteQuestion(questions[i]);
        }
        //Delete Tags
        let tags = await Tag.find({create_by: user_delete._id});
        for(let i = 0; i < tags.length; i++) {
            await Tag.findOneAndDelete({_id: tags[i]._id});
        }
        //Delete Answers
        let answers = await Answer.find({ans_by: user_delete._id}).populate({path: 'comments',
            populate: {
                path: 'comm_by',
                model: 'User'}});
        for(let i = 0; i < answers.length; i++) {
            await deleteAnswer(answers[i]);
        }
        //Delete Comments
        let comments = await Comment.find({comm_by: user_delete._id});
        for(let i = 0; i < comments.length; i++) {
            await Comment.findOneAndDelete({_id: comments[i]._id});
        }
        res.send('');
    } catch(err){
        console.error('Error deleting tag:', err);
        res.status(500).send('Error deleting tag');
    }
})


async function deleteAnswer(answer) {
    for(let i = 0; i < answer.comments.length; i++) {
        await Comment.findOneAndDelete({_id: answer.comments[i]._id});
    }
    await Answer.findOneAndDelete({_id: answer._id});
}

async function deleteQuestion(question) {
    for(let i = 0; i < question.answers.length; i++) {
        await deleteAnswer(question.answers[i]);
    }
    for(let i = 0; i < question.comments.length; i++) {
        await Comment.findOneAndDelete({_id: question.comments[i]._id})
    }
    await Question.findOneAndDelete({_id: question._id});
}