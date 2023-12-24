import React from 'react';
import MainQuestion from "./MainQuestion";
import {useState} from 'react';
function MainQuestions(props){
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const handleNextQuestionPage = () => {
    if(props.sort === "unanswered"){
      if(currentPage * questionsPerPage < sort_unanswered(props.questions).length){
        setCurrentPage(currentPage+1);
      }
      else{
        setCurrentPage(1);
      }
    }
    else if(currentPage * questionsPerPage < props.questions.length){
      setCurrentPage(currentPage+1);
    }
    else{
      setCurrentPage(1);
    }
  }

  const handlePrevQuestionPage = () => {
    if(currentPage > 1){
      setCurrentPage(currentPage-1);
    }
  }

    let sorted_questions = [];
    switch(props.sort) {
        case "newest":
          sorted_questions = sort_new(props.questions);
          break;
        case "active":
          sorted_questions = sort_active(props.questions, props.answers);
          break;
        case "unanswered":
          sorted_questions = sort_unanswered(props.questions);
          break;
        default:
          sorted_questions = sort_new(props.questions);
    }
  
    sorted_questions = sorted_questions.slice(currentPage * questionsPerPage - questionsPerPage, currentPage*questionsPerPage);

    const question_list = [];
    sorted_questions.forEach((question) => {
        question_list.push(<MainQuestion 
          type={"main"}
          key={question._id} 
          question={question}
          tags={props.tags}  
          onQuestion = {props.onQuestion} 
          onViewChange={props.onViewChange}
        />)

    });
    const no_question = question_list.length === 0? <h4 id = "no_question_found">No Questions Found</h4> : question_list
    return (
      <div>
        <div id="home_question_container">{no_question}</div>
        <button className="prev_next" type = "button" onClick = {handlePrevQuestionPage}>Prev</button>
        <button className="prev_next" type = "button" onClick = {handleNextQuestionPage}>Next</button>
      </div>
    )
}

function sort_new(questions) {
  return questions.sort((q1, q2) => new Date(q2.ask_date_time).getTime() - new Date(q1.ask_date_time).getTime());
}

export function sort_active(questions, answers) {
  let sorted_questions = questions.filter((x) => x.answers.length > 0).sort((q1, q2) => {
    let a1 = q1.answers[0]._id;
    for(let i = 0; i < q1.answers.length-1; i++) {
      const currentA1 = a1;
      if(new Date(answers.find((x) => x._id === currentA1).ans_date_time).getTime() < new Date(answers.find((x) => x._id === q1.answers[i+1]._id).ans_date_time).getTime()) {
        a1 = q1.answers[i+1]._id;
      }
    }
    let a2 = q2.answers[0]._id;
    for(let i = 0; i < q2.answers.length-1; i++) {
      const currentA2 = a2;
      if(new Date(answers.find((x) => x._id === currentA2).ans_date_time).getTime() < new Date(answers.find((x) => x._id === q2.answers[i+1]._id).ans_date_time).getTime()) {
        a2 = q2.answers[i+1]._id;
      }
    }
    return new Date(answers.find((x) => x._id === a2).ans_date_time).getTime() - new Date(answers.find((x) => x._id === a1).ans_date_time).getTime();
  });
  let no_answers = questions.filter((x) => x.answers.length === 0).sort((q1, q2) => new Date(q2.ans_date_time).getTime() - new Date(q1.ans_date_time).getTime());
  sorted_questions = sorted_questions.concat(no_answers);
  return sorted_questions;
}

function sort_unanswered(questions) {
  let sorted_questions = questions.filter((quest) => quest.answers.length === 0);
  sorted_questions = sorted_questions.sort((q1,q2) => new Date(q2.ask_date_time) - new Date(q1.ask_date_time));
  return sorted_questions;
}

  
export default MainQuestions;