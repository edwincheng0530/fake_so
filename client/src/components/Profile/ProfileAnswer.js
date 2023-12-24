import {sort_active} from '../MainQuestions'
import MainQuestion from "../MainQuestion";

export default function ProfileAnswer(props) {
    let user = props.user;
    let questions = props.dataQuestions;
    let answers = props.answers;

    let answer_questions = [];
    questions = sort_active(questions, answers);
    questions.forEach((question) => {
        for(let i = 0; i < question.answers.length; i++) {
            if(question.answers[i].ans_by._id === user._id) {
                answer_questions.push(<MainQuestion
                    key={question._id}
                    type={'profile_answer'}
                    question={question}
                    dataQuestions={props.dataQuestions}
                    onQuestion={props.onQuestion}
                    tags={props.tags}
                />);
                break;
            }
        }
    })
    if(answer_questions.length === 0) {
        answer_questions = <p className="no_answers_available">No Answers Available</p>
    }

    return (
        <div>
            {answer_questions}
        </div>
    )
}