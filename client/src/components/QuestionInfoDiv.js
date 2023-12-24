import axios from 'axios';
import AskQuestionButton from "./AskQuestionButton";
import {calculate_date} from "./MainQuestion"
import CommentInput from './CommentInput';
import Comments from './Comments';

export default function QuestionInfoDiv(props){
    let commentInput;
    let ask_button;
    let vote;
    if(props.user !== 'guest') {
        ask_button = <AskQuestionButton
            onChangeTabs = {props.onChangeTabs}
            onCurrentPageChange = {props.onCurrentPageChange}
            labelChange = {props.labelChange}
        />
        vote = <div id="question_info_bot_vote_button_container">
            <button className="vote_button upvote" onClick={() => handleUpVote()}>&#8593;</button>
            <button className="vote_button downvote" onClick={() => handleDownVote()}>&#8595;</button>
        </div>
        commentInput = <CommentInput 
            onNewComment = {props.onNewComment} 
            question = {props.question} 
            onChangeDataQuestions = {props.onChangeDataQuestions}
            user = {props.user}
        ></CommentInput>;
    } else {
        ask_button = <button id="ask_question"> Ask Question</button>
        vote = <div id="question_info_bot_vote_button_container">
            <button className="vote_button upvote">&#8593;</button>
            <button className="vote_button downvote">&#8595;</button>
    </div>
        commentInput = <div id = "comment_bar">
                <input type = 'text' placeholder="Login to post comments."></input>
            </div>
    }

    const date = calculate_date(props.question.ask_date_time, new Date());
    let text = props.question.text;
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
        final = props.question.text;
    }

    let tags = [];
    for(let i = 0; i < props.question.tags.length; i++) {
      tags.push(<div key={props.question.tags[i]._id} className="question_tag">{props.question.tags[i].name}</div>)
    }

    function updateQuestions (ques) {
        props.onChangeDataQuestions(ques);
    }

    function updateUser(user){
        props.onChangeUser(user);
    }

    const handleUpVote = async () => {
        if(props.user._id === props.question.asked_by._id && !props.user.admin) {
            return;
        }
        if(props.user.reputation <50 && !props.user.admin){
            window.alert("Your reputation is too low, you cannot vote.");
        }else{

            await axios.post('http://localhost:8000/upvote', {type: 'question', user: props.user, question: props.question, asked_by: props.question.asked_by})
                .then((res) => {
                    updateQuestions(res.data[0]);
                    updateUser(props.user);
                })
        }
    }

    const handleDownVote = async () => {
        if(props.user._id === props.question.asked_by._id && !props.user.admin) {
            return;
        }
        if(props.user.reputation <50 && !props.user.admin){
            window.alert("Your reputation is too low, you cannot vote.");
        }else{

            await axios.post('http://localhost:8000/downvote', {type: 'question', user: props.user, question: props.question, asked_by: props.question.asked_by})
                .then((res) => {
                    updateQuestions(res.data[0]);
                    updateUser(props.user);
                })
        }
    }

    return(
        <div id = "question_info_div">
            <div id = "question_info_top">
                <h3 id = "AP_num_answer"> {props.question.answers.length} answers</h3>
                <h3 id = "AP_question_title">{props.question.title}</h3>
                {ask_button}
            </div>
            <div id = "question_info_bot">
                <div id="question_info_bot_left">
                        <h3>{props.question.upvote} {props.question.upvote === 1 ? "upvote":"upvotes"}</h3>
                    <h3 id = "AP_num_view">{props.question.views} {props.question.views === 1?  " view":" views"}</h3>
                </div>
                <div className="question_info_bot_mid">
                    {vote}
                    <div>
                        <p id = "AP_question_text">{final}</p>
                        <div className="question_tags_div">
                            {tags}
                        </div>
                    </div>
                </div>
                <div id = "AP_author_time">
                    <span className="author">{props.question.asked_by.username}</span>
                    <span className = "date">{date}</span>
                </div>
                
            </div>
            <div className="question_comment_container">
                {/* <CommentInput 
                    onNewComment = {props.onNewComment} 
                    question = {props.question} 
                    onChangeDataQuestions = {props.onChangeDataQuestions}
                    user = {props.user}
                ></CommentInput> */}
                {commentInput}
                <Comments 
                    comments = {props.question.comments}
                    user = {props.user}
                    question = {props.question} 
                    onChangeDataQuestions={props.onChangeDataQuestions}
                ></Comments>
            </div>
        </div>
    )
}