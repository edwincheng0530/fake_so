import {useState} from 'react';
import axios from "axios";

export default function Comments(props){
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 3;
    let currentComments = []
    props.comments.slice(currentPage * commentsPerPage - commentsPerPage, currentPage*commentsPerPage).forEach((comment) => {
        currentComments.push(<Comment 
            key = {comment._id}
            comment = {comment}
            user = {props.user}
            question = {props.question} 
            onChangeDataQuestions={props.onChangeDataQuestions}
        ></Comment>)
    }); 


    const handleNextPage = () => {
        if(currentPage * commentsPerPage < props.comments.length){
            setCurrentPage(currentPage + 1);
        }
        else{
            setCurrentPage(1);
        }
        
    }

    const handlePrevPage = () => {
        if (currentPage > 1){
            setCurrentPage(currentPage-1);
        }
        
    }
    const buttons = props.comments.length > 3 ? 
        <div className="prev_next_container">
                <button className="prev_next" type = "button" onClick = {handlePrevPage}>Prev</button>
                <button className="prev_next" type = "button" onClick = {handleNextPage}>Next</button>
        </div> :
        <div>
        </div>

    return(
        <div className="comments_container">
            {currentComments}
            {buttons}
        </div>
    )
}

function Comment(props){
    function updateQuestions (ques) {
        props.onChangeDataQuestions(ques);
    }

    const handleUpVote = async () => {
        await axios.post('http://localhost:8000/upvote', {type: 'comment', user: props.user, question: props.question, comment: props.comment})
            .then((res) => {
                updateQuestions(res.data[0]);
            })
    }

    let vote;
    if(props.user !== 'guest') {
        vote = <button className="comment_vote_button upvote" onClick={() => handleUpVote()}>&#8593;</button>
    } else {
        vote = <button className="comment_vote_button upvote">&#8593;</button>
    }
    return(
        <div className = "comment">
            <div className="comment_vote_and_text">
                <div className = "comment_vote_container">
                    {vote}
                    <div className = "comment_upvote">{props.comment.upvote}</div>
                </div>
                <div className = "comment_text">{props.comment.text}</div>
            </div>
            <div className = "commenter">{props.comment.comm_by.username}</div>
        </div>
    )
}