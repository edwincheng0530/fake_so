import MainQuestion from '../MainQuestion'

export default function ProfileQuestion(props) {
    let user = props.user;
    let questions = props.dataQuestions;

    let user_questions = [];
    questions = questions.sort((q1, q2) => new Date(q2.ask_date_time).getTime() - new Date(q1.ask_date_time).getTime());
    questions.forEach((question) => {
        if(question.asked_by.email === user.email) {
            user_questions.push(<MainQuestion
            key={question._id}
            type={"profile_question"}
            question={question}
            tags={props.tags}
            onQuestion = {props.onQuestion}
            onChangeDataQuestions={props.onChangeDataQuestions}
            ></MainQuestion>);
        }
    })
    if(user_questions.length === 0) {
        user_questions = <p className="no_questions_asked">No Questions Asked</p>
    }

    return (
        <div>
            {user_questions}
        </div>
    )
}