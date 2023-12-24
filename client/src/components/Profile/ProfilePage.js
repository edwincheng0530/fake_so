import {calculate_date} from '../MainQuestion'
import {useState, useEffect} from 'react'
import ProfileQuestion from './ProfileQuestion'
import ProfileTag from './ProfileTag'
import ProfileAnswer from './ProfileAnswer'
import ProfileAdmin from './ProfileAdmin'
export default function ProfilePage(props) {
    const [display, setDisplay] = useState('');

    useEffect(() => {
        const updateDisplay = async () => {
            try {
                let initial_state;
                if(props.user.admin) {
                    initial_state = 'admin';
                } else {
                    initial_state = 'question';
                }
                setDisplay(initial_state);
            } catch (err) {
                console.log('Error updating display', err);
            }
        }
        updateDisplay();
    }, [props.user])

    if(props.user === 'guest') {
        return (
            <div className="guest_profile">
                <p>Sign in to view profile</p>
            </div>
        )
    }
    let page;
    switch(display) {
        case 'question':
            page = <ProfileQuestion
                user={props.user}
                dataQuestions={props.dataQuestions}
                onQuestion = {props.onQuestion}
                tags={props.tags}
                onChangeDataQuestions={props.onChangeDataQuestions}
            />
            break;
        case 'tag':
            page = <ProfileTag
                user={props.user}
                tags={props.tags}
                dataQuestions={props.dataQuestions}
                onChangeDataQuestions={props.onChangeDataQuestions}
                onUpdateTags={props.onUpdateTags}
                onCurrentPageChange = {props.onCurrentPageChange}
                onChangeTabs = {props.onChangeTabs}
                onChangeSort = {props.onChangeSort}
                onChangeQuestionsDisplayed={props.onChangeQuestionsDisplayed}
                
            />
            break;
        case 'answer':
            page = <ProfileAnswer
                user={props.user}
                tags={props.tags}
                dataQuestions={props.dataQuestions}
                onQuestion={props.onQuestion}
                onChangeDataQuestions={props.onChangeDataQuestions}
                answers={props.answers}
            />
            break;
        case 'admin':
            page = <ProfileAdmin
                user={props.user}
                onChangeWelcome ={props.onChangeWelcome}
                onChangeDataQuestions={props.onChangeDataQuestions}
                onUpdateTags={props.onUpdateTags}
                onUpdateAnswers={props.onUpdateAnswers}
                onCurrentPageChange = {props.onCurrentPageChange}
                onChangeAdminTarget={props.onChangeAdminTarget}
            />
            break;
        default:
            page = <ProfileQuestion
                user={props.user}
                dataQuestions={props.dataQuestions}
                onQuestion = {props.onQuestion}
                tags={props.tags}
                onChangeDataQuestions={props.onChangeDataQuestions}
            />
            break;
    }

    const handleClick = (page) => {
        setDisplay(page);
    }

    return (
        <div id="main_content">
            <div className="user_info_container">
                <div className="user_info">
                    <div className="username_email">
                        <p><strong>Username:</strong> {props.user.username}</p>
                        <p><strong>Email:</strong> {props.user.email}</p>
                    </div>
                    <p><strong>Reputation:</strong> {props.user.reputation}</p>
                    <p><strong>Member Since:</strong> {calculate_date(props.user.join_time).replace("asked ", "")} </p>
                </div>
                <div>
                    <button onClick={() => handleClick("question")}>Your Questions</button>
                    <button onClick={() => handleClick("tag")}>Your Tags</button>
                    <button onClick={() => handleClick("answer")}>Your Answers</button>
                </div>
            </div>
            {page}
        </div>
    )
}