import {useState} from 'react';

export default function CommentInput(props){
    const [comment, setComment] = useState('');
    // const [valid, setValid] = useState(true);
    const [error, setError] = useState('');

    const handleSetComment = (e) => {setComment(e.target.value)};

    const handleEnter = async (event) => {
        if(event.key === 'Enter'){
            if(props.question){
                if(validateComment(comment, props.user.reputation,props.user.admin) === 'long'){
                    setError("Comments cannot be longer than 140 characters.");
                }
                else if(validateComment(comment, props.user.reputation,props.user.admin) === 'low_reputation'){
                    setError("Reputation too low, cannot post comments.");
                }
                else{
                    await props.onNewComment(comment, 'question');
                    setError('');
                }
            }
            else if(props.answer){
                if(validateComment(comment, props.user.reputation, props.user.admin) === 'long'){
                    setError("Comments cannot be longer than 140 characters.");
                }
                else if(validateComment(comment, props.user.reputation, props.user.admin) === 'low_reputation'){
                    setError("Reputation too low, cannot post comments.");
                }
                else{
                    await props.onAnswer(props.answer);
                    await props.onNewComment(comment, 'answer');
                    setError('');

                }
            }
            setComment('');
            event.target.value = '';
        }
    };

    return(
        <div id = "comment_bar">
            <input type = 'text' placeholder="Write your comments here "onChange={handleSetComment} onKeyDown={handleEnter}></input>
            <label className='error'>{error}</label>
        </div>
    );
        
    
}

function validateComment(comment, reputation, isAdmin){
    if(reputation < 50 && !isAdmin){
        return "low_reputation";
    }
    if(comment.length > 140){
        return "long";
    }

}