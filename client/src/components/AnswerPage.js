import axios from 'axios'
import {calculate_date} from "./MainQuestion"
import QuestionInfoDiv from "./QuestionInfoDiv"
import CommentInput from './CommentInput';
import Comments from './Comments';
import { useState } from 'react';
import Delete from './Profile/Delete';
import Edit from './Profile/Edit';
export default function AnswerPage(props){
    return (
        <div id = "main_content">
            <QuestionInfoDiv 
                question = {props.question} 
                questions = {props.questions}
                onChangeTabs = {props.onChangeTabs}
                onCurrentPageChange = {props.onCurrentPageChange}
                labelChange = {props.labelChange}
                user = {props.user}
                onChangeUser = {props.onChangeUser}
                tags = {props.tags}
                onNewComment = {props.onNewComment}
                onChangeDataQuestions={props.onChangeDataQuestions}
            />
            <AnswerContainer 
                type={props.type}
                onCurrentPageChange = {props.onCurrentPageChange} 
                onAnswer = {props.onAnswer}
                question = {props.question} 
                answers = {props.answers}
                answer = {props.answer}
                user = {props.user}
                onChangeUser={props.onChangeUser}
                onNewComment = {props.onNewComment}
                onChangeDataQuestions={props.onChangeDataQuestions}
                onUpdateAnswers={props.onUpdateAnswers}
                onQuestion = {props.onQuestion}
            /> 
        </div>
    );


}

function AnswerButton(props){
    const handleCurrentPageChange = () =>{
        props.onCurrentPageChange('answer_form');
    }
    return (
        <button className = "answer_button" onClick={()=> handleCurrentPageChange()} id="ask_question"> Answer Question</button>
    );
}

function AnswerContainer(props){
    const [currentPage, setCurrentPage] = useState(1);
    const [editState, setEditState] = useState('');
    const answersPerPage = 5;

    const handleEditState =  (state) => {
        setEditState(state)
    }

    const handleNextAnswerPage = () => {
        if(currentPage * answersPerPage < props.question.answers.length){
            setCurrentPage(currentPage+1);
        }
        else{
            setCurrentPage(1);
        }
    }

    const handlePrevAnswerPage = () => {
        if(currentPage > 1){
            setCurrentPage(currentPage-1);
        }
    }

    let answer_button;
    if(props.user !== 'guest') {
        answer_button = <AnswerButton onCurrentPageChange = {props.onCurrentPageChange}/>
    } else {
        answer_button = <button className = "answer_button" id="ask_question"> Answer Question</button>
    }


    if(props.type === 'question') {
        let answer_list = [];
        const answer_divs =[];
        props.question.answers.forEach((a) => answer_list.push(a));
        answer_list.sort((a1, a2) => new Date(a2.ans_date_time) - new Date(a1.ans_date_time));
        answer_list = answer_list.slice(currentPage * answersPerPage - answersPerPage, currentPage*answersPerPage);
        answer_list.forEach((ans) => 
            answer_divs.push(<IndividualAnswer 
                type={'question'}
                key ={ans._id} 
                answerText = {ans.text} 
                author = {ans.ans_by.username} 
                date = {new Date(ans.ans_date_time)}
                vote = {ans.upvote}
                answer = {ans}
                question = {props.question} 
                onChangeDataQuestions={props.onChangeDataQuestions}
                onChangeUser={props.onChangeUser}
                user = {props.user}
                onAnswer = {props.onAnswer}
                onNewComment = {props.onNewComment}
            />)
        );
        return (
            <div>
                <div id = "answers_container">
                    {answer_divs}
                </div>
                <div>
                    <button className="prev_next" type = "button" onClick = {handlePrevAnswerPage}>Prev</button>
                    <button className="prev_next" type = "button" onClick = {handleNextAnswerPage}>Next</button>
                    {answer_button}
                </div>
            </div>
        );        
    } else if (props.type === 'profile') {
        let answer_list = [];
        let sorted_answers = props.question.answers.sort((a1, a2) => new Date(a2.ans_date_time) - new Date(a1.ans_date_time));
        sorted_answers.forEach((ans) => {
            if(ans.ans_by._id === props.user._id) {
                answer_list.push(<IndividualAnswer
                    type={'profile'}
                    key ={ans._id} 
                    answerText = {ans.text} 
                    author = {ans.ans_by.username} 
                    date = {new Date(ans.ans_date_time)}
                    vote = {ans.upvote}
                    answer = {ans}
                    question = {props.question} 
                    onChangeDataQuestions={props.onChangeDataQuestions}
                    onChangeUser={props.onChangeUser}
                    user = {props.user}
                    onAnswer = {props.onAnswer}
                    onNewComment = {props.onNewComment}
                    onUpdateAnswers={props.onUpdateAnswers}
                    onQuestion = {props.onQuestion}

                    onEditState={handleEditState}
                    editState={editState}
                />);
            }
        })
        sorted_answers.forEach((ans) => {
            if(ans.ans_by._id !== props.user._id) {
                answer_list.push(<IndividualAnswer
                    type={'question'}
                    key ={ans._id} 
                    answerText = {ans.text} 
                    author = {ans.ans_by.username} 
                    date = {new Date(ans.ans_date_time)}
                    vote = {ans.upvote}
                    answer = {ans}
                    question = {props.question} 
                    onChangeDataQuestions={props.onChangeDataQuestions}
                    onChangeUser={props.onChangeUser}
                    user = {props.user}
                    onAnswer = {props.onAnswer}
                    onNewComment = {props.onNewComment}
                    
                />);
            }
        })

        return (
            <div>
                <div id="answers_container">
                        {answer_list}   
                </div>
                    <div id = "buttons_prev_next_ask">
                        <button className="prev_next" type = "button" onClick = {handlePrevAnswerPage}>Prev</button>
                        <button className="prev_next" type = "button" onClick = {handleNextAnswerPage}>Next</button>
                        {answer_button}
                    </div>
            </div>
            
        )
    }
}

function IndividualAnswer(props){
    const [error, setError] = useState('');

    const handleSetError = (error) => {
        setError(error)
    }

    let text = props.answerText;
    let hyper_link = /\[[^\]]+\]\(https?:\/\/[^)]+\)/g;
    let final = [];
    let arr_hyper = text.match(hyper_link);
    if(hyper_link.test(text)) {
        let split_text = text.split(hyper_link);
        let counter = 0;
        let arr_index = 0;
        for(let i = 0; i < split_text.length; i++) {
            if(counter >= text.indexOf(arr_hyper[arr_index])) {
                let name = arr_hyper[arr_index].substring(arr_hyper[arr_index].indexOf('[')+1, arr_hyper[arr_index].lastIndexOf(']'));
                let link = arr_hyper[arr_index].substring(arr_hyper[arr_index].indexOf('(')+1, arr_hyper[arr_index].lastIndexOf(')'));
                final.push(<a key={'a'+arr_index} target="_blank" rel="noreferrer" href={link}>{name}</a>)
                counter += arr_hyper[arr_index].length;
                arr_index += 1;
            } 
            final.push(<span key={i}>{split_text[i]}</span>);
            counter += split_text[i].length;
        }
    } else {
        final = props.answerText;
    }

    function updateQuestions (ques) {
        props.onChangeDataQuestions(ques);
    }

    const handleUpVote = async () => {
        if(props.user._id === props.answer.ans_by._id && !props.user.admin) {
            return;
        }
        if(props.user.reputation <50 && !props.user.admin){
            window.alert("Your reputation is too low, you cannot vote.");
        }
        else{

            await axios.post('http://localhost:8000/upvote', {type: 'answer', question: props.question, user: props.user, answer: props.answer, ans_by: props.answer.ans_by})
                .then((res) => {
                    updateQuestions(res.data[0]);
                    props.onChangeUser(props.user);
                })
        }
    }

    const handleDownVote = async () => {
        if(props.user._id === props.answer.ans_by._id && !props.user.admin) {
            return;
        }
        if(props.user.reputation < 50 && !props.user.admin){
            window.alert("Your reputation is too low, you cannot vote.");
        }
        else{
            await axios.post('http://localhost:8000/downvote', {type: 'answer', question: props.question, user: props.user, answer: props.answer, ans_by: props.answer.ans_by})
                .then((res) => {
                    updateQuestions(res.data[0]);
                    props.onChangeUser(props.user);
                })

        }
    }

    let vote;
    let commentInput;
    if(props.user !== 'guest') {
        vote =  <div className="answer_vote_vertical">
            <button className="vote_button upvote" onClick={() => handleUpVote()}>&#8593;</button>
            <p className="a_vote">{props.vote}</p>
            <button className="vote_button downvote" onClick={() => handleDownVote()}>&#8595;</button>
        </div>
        commentInput = <CommentInput 
        onNewComment = {props.onNewComment} 
        answer = {props.answer} 
        onAnswer = {props.onAnswer}
        onChangeDataQuestions = {props.onChangeDataQuestions}
        user = {props.user}
    ></CommentInput>;
    } else {
        vote =  <div className="answer_vote_vertical">
            <button className="vote_button upvote">&#8593;</button>
            <p className="a_vote">{props.vote}</p>
            <button className="vote_button downvote">&#8595;</button>
        </div>
        commentInput = <div id = "comment_bar">
        <input type = 'text' placeholder="Login to post comments."></input>
        </div>
    }

    if(props.type === 'question') {
        return(
            <div className="answer_comment_container">
                <div className = "answer_div">
                    <div className="answer_vote">
                        {vote}
                        <p className="answer_text">{final}</p>
                    </div>
                    <div className="answer_author_date">
                        <span className="answer_author">{props.author}</span>
                        <span className="answer_date">{calculate_date(props.date, new Date()).replace("asked ", "answered ")}</span>
                    </div>
                </div>
                <div className="question_comment_container">
                    {commentInput}
                    <Comments user = {props.user} comments = {props.answer.comments} question = {props.question} onChangeDataQuestions = {props.onChangeDataQuestions}></Comments>
                </div>
            </div>
        );
    } else if(props.type === 'profile'){
        let answer_display;
        if(props.editState === props.answer._id) {
            answer_display = <EditAnswer
                question={props.question}
                answer={props.answer}
                onAnswer={props.onAnswer}
                onSetError={handleSetError}
                onEditState={props.onEditState}
                onChangeDataQuestions={props.onChangeDataQuestions}
                onUpdateAnswers={props.onUpdateAnswers}
            />
        } else {
            answer_display = <p className="answer_text">{final}</p>
        }

        let error_msg;
        if(error === 'empty') {
            error_msg = <div className="error">Answer cannot be empty</div>
        } else {
            error_msg = <div></div>
        }
        return(
            <div className="answer_comment_container">
                <div className = "answer_div">
                    <div className="answer_vote">
                        {vote}
                        {answer_display}
                    </div>
                    <div className="answer_author_date">
                        <span className="answer_author">{props.author}</span>
                        <span className="answer_date">{calculate_date(props.date, new Date()).replace("asked ", "answered ")}</span>
                        <div className="edit_and_delete">
                            <Edit
                                type={'answer'}
                                onEditState={props.onEditState}
                                answer={props.answer}
                            />
                            <Delete
                                type={'answer'}
                                question={props.question}
                                answer={props.answer}
                                onChangeDataQuestions={props.onChangeDataQuestions}
                                onUpdateAnswers={props.onUpdateAnswers}
                                onQuestion = {props.onQuestion}
                            />
                        </div>
                        {error_msg}
                    </div>
                </div>
                <div className="answer_comment_container">
                    {commentInput}
                    <Comments user = {props.user} comments = {props.answer.comments} question = {props.question} onChangeDataQuestions = {props.onChangeDataQuestions}></Comments>
                </div>
            </div>
        );
    }
}

function EditAnswer(props) {
    const [newAnswer, setNewAnswer] = useState(props.answer.text)

    const handleChange = (e) => {
        setNewAnswer(e.target.value)
    }

    const handleEnter = async (event) => {
        if(event.key === 'Enter') {
            if(newAnswer.trim().length === 0) {
                props.onSetError('empty')
                return;
            }
            await axios.post('http://localhost:8000/editanswer', {answer: props.answer, new_answer: newAnswer, question: props.question})
                .then((res) => {
                    props.onUpdateAnswers();
                    props.onChangeDataQuestions(res.data[0]);
                });
            props.onEditState('');
            props.onSetError('');
        }
    }
    return (
        <textarea type="text" id="answer_input" onChange={handleChange} onKeyDown={handleEnter} value={newAnswer}></textarea>
    )
}