import React from "react"
import AskQuestionButton from "./AskQuestionButton"

export default function MainLabel(props){
    return (
        <div id = "main_label">
            <MainLabel1 
                onCurrentPageChange={props.onCurrentPageChange} 
                questions = {props.questions}
                onChangeTabs={props.onChangeTabs}
                label = {props.label}
                labelChange = {props.labelChange}
                user = {props.user}
            />
            <MainLabel2 
                onChangeSort= {props.onChangeSort}
                sort={props.sort}
                questions = {props.questions}
            />
        </div>
    )
}


function MainLabel1(props){
    let ask_button;
    if(props.user !== 'guest') {
        ask_button = <AskQuestionButton
        onChangeTabs = {props.onChangeTabs}
        onCurrentPageChange = {props.onCurrentPageChange}
        labelChange = {props.labelChange}
    />
    } else {
        ask_button = <button id="ask_question"> Ask Question</button>
    }
    
    return (
        <div id= "main_label_1">
            <h1 id = "question_or_search_header">{props.label}</h1>
            {ask_button}
        </div>
    )
}

function MainLabel2(props){
    let question_len = props.questions.length;
    if(props.sort === "unanswered"){
        question_len = countUnanswered(props.questions);
    }
    return (
        <div id = "main_label_2">
            <p>{question_len} {question_len === 1? "Question": "Questions"}</p>
            <SortingButtons 
                onChangeSort = {props.onChangeSort}
                sort={props.sort}
            />
        </div>
    )
}

const SortingButtons = (props) => {
    const handleOnSort = (sort) => {
      props.onChangeSort(sort);
    };
  
    return (
      <div id="sorting_buttons">
        <div onClick={() => handleOnSort('newest')} className={props.sort === 'newest' ? 'hovering' : ''} id="newest_button"> Newest</div>
        <div onClick={() => handleOnSort('active')} className={props.sort === 'active' ? 'hovering' : ''} id="active_button">Active</div>
        <div onClick={() => handleOnSort('unanswered')} className={props.sort === 'unanswered' ? 'hovering' : ''} id="unanswered_button">Unanswered</div>
      </div>
    );
  };

  function countUnanswered(questions){
    let counter = 0;
    questions.forEach((q) => {
        if(q.answers.length === 0){
            counter++;
        }
    });
    return counter;
  }