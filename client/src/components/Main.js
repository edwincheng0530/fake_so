import LeftSidebar from "./LeftSidebar";
import QuestionForm from "./QuestionForm";
import React from "react";
import MainLabel from "./MainLabel";
import MainQuestions from "./MainQuestions";
import AnswerForm from "./AnswerForm";
import AnswerPage from "./AnswerPage";
import TagPage from "./TagPage";
import ProfilePage from "./Profile/ProfilePage"

export default class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentPage: 'home_questions',
      sorted: 'newest',
    };
  }

  render(){
    let page;
    switch(this.props.currentPage){
      case "home_questions":
        if(this.props.label === "Search Results"){
          page = <ResultContent
            dataQuestions = {this.props.dataQuestions}
            tags={this.props.tags}
            questions = {this.props.questions} 
            answers={this.props.answers}
            onCurrentPageChange = {this.props.onCurrentPageChange}
            onChangeSort = {this.props.onChangeSort}
            onChangeTabs = {this.props.onChangeTabs}
            onChangeQuestionsDisplayed = {this.props.onChangeQuestionsDisplayed}
            sorted={this.props.sorted}
            question = {this.props.question}
            onQuestion = {this.props.onQuestion}
            label = {this.props.label}
            labelChange = {this.props.labelChange}
            onViewChange={this.props.onViewChange}
            user = {this.props.user}
        />;
        }
        else {
          page = <MainContent 
            dataQuestions = {this.props.dataQuestions}
            tags={this.props.tags}
            answers={this.props.answers}
            questions = {this.props.questions} 
            onCurrentPageChange = {this.props.onCurrentPageChange}
            onChangeSort = {this.props.onChangeSort}
            onChangeTabs = {this.props.onChangeTabs}
            onChangeQuestionsDisplayed = {this.props.onChangeQuestionsDisplayed}
            sorted={this.props.sorted}
            question = {this.props.question}
            onQuestion = {this.props.onQuestion}
            label = {this.props.label}
            labelChange = {this.props.labelChange}
            onViewChange={this.props.onViewChange}
            user = {this.props.user}
          />;
        }
        break;
      case "question_form":
        page = <QuestionForm
          type={'main'}
          onSorted = {this.state.sorted}
          onNewQuestion = {this.props.onNewQuestion}
          onCurrentPageChange = {this.props.onCurrentPageChange}
          onChangeQuestionsDisplayed={this.props.onChangeQuestionsDisplayed}
          onChangeSort = {this.props.onChangeSort}
          dataQuestions={this.props.dataQuestions}
          user={this.props.user}
          question={this.props.question}
          onChangeDataQuestions={this.props.onChangeDataQuestions}
          onQuestion = {this.props.onQuestion}
          tags = {this.props.tags}
        />;
        break;
      case "answer_form":
        page = <AnswerForm 
          onCurrentPageChange = {this.props.onCurrentPageChange}
          newAnswer = {this.props.onNewAnswer}
          question = {this.props.question}
          onChangeTabs = {this.props.onChangeTabs}
          
          user={this.props.user}
        />;
        break;
      case "answer_page":
        page = <AnswerPage 
          type={'question'}
          question = {this.props.question}
          tags = {this.props.tags}
          answer = {this.props.answer}
          questions = {this.props.questions}
          answers = {this.props.answers}
          onChangeTabs = {this.props.onChangeTabs}
          onCurrentPageChange = {this.props.onCurrentPageChange}
          labelChange = {this.props.labelChange}
          user={this.props.user}
          onChangeUser = {this.props.onChangeUser}
          onAnswer = {this.props.onAnswer}
          onChangeDataQuestions={this.props.onChangeDataQuestions}
          onNewComment = {this.props.onNewComment}
          />
        break;
      case "tag_page":
        page = <TagPage
          dataQuestions = {this.props.dataQuestions}
          tags = {this.props.tags}
          onCurrentPageChange = {this.props.onCurrentPageChange}
          onChangeTabs = {this.props.onChangeTabs}
          onChangeSort = {this.props.onChangeSort}
          onChangeQuestionsDisplayed={this.props.onChangeQuestionsDisplayed}
          labelChange = {this.props.labelChange}
          user = {this.props.user}
        />
        break;
      case "profile_page":
        page = <ProfilePage
          user={this.props.adminTarget}
          dataQuestions = {this.props.dataQuestions}
          tags={this.props.tags}
          onQuestion = {this.props.onQuestion}
          onChangeDataQuestions={this.props.onChangeDataQuestions}
          onUpdateTags={this.props.onUpdateTags}
          onUpdateAnswers={this.props.onUpdateAnswers}
          answers={this.props.answers}
          onCurrentPageChange = {this.props.onCurrentPageChange}
          onChangeTabs = {this.props.onChangeTabs}
          onChangeSort = {this.props.onChangeSort}
          onChangeQuestionsDisplayed={this.props.onChangeQuestionsDisplayed}
          onChangeWelcome ={this.props.onChangeWelcome}

          onChangeAdminTarget={this.props.onChangeAdminTarget}
        />
        break;
      case "profile_question_form":
        page = <QuestionForm
          type = {'profile'}
          user={this.props.adminTarget}
          onSorted = {this.state.sorted}
          onNewQuestion = {this.props.onNewQuestion}
          onChangeSort = {this.props.onChangeSort}
          dataQuestions={this.props.dataQuestions}
          tags = {this.props.tags}
          question={this.props.question}
          onCurrentPageChange = {this.props.onCurrentPageChange}
          onChangeDataQuestions={this.props.onChangeDataQuestions}
          onQuestion = {this.props.onQuestion}
          onUpdateTags={this.props.onUpdateTags}
        ></QuestionForm>
        break;
      case "profile_answer_page":
        page = <AnswerPage
          type={'profile'}
          user={this.props.adminTarget}
          question = {this.props.question}
          tags = {this.props.tags}
          answer = {this.props.answer}
          questions = {this.props.questions}
          answers = {this.props.answers}
          onChangeTabs = {this.props.onChangeTabs}
          onCurrentPageChange = {this.props.onCurrentPageChange}
          labelChange = {this.props.labelChange}
          onChangeUser = {this.props.onChangeUser}
          onAnswer = {this.props.onAnswer}
          onChangeDataQuestions={this.props.onChangeDataQuestions}
          onNewComment = {this.props.onNewComment}
          onUpdateAnswers={this.props.onUpdateAnswers}
          onQuestion = {this.props.onQuestion}
        />
        break;
      default:
        page = <MainContent 
          dataQuestions = {this.props.dataQuestions}
          tags={this.props.tags}
          answers={this.props.answers}
          questions = {this.props.questions} 
          onCurrentPageChange = {this.props.onCurrentPageChange}
          onChangeSort = {this.props.onChangeSort}
          onChangeTabs = {this.props.onChangeTabs}
          onChangeQuestionsDisplayed = {this.props.onChangeQuestionsDisplayed}
          sorted={this.props.sorted}
          question = {this.props.question}
          onQuestion = {this.props.onQuestion}
          onViewChange = {this.props.onViewChange}

          label = {this.props.label}
          labelChange = {this.props.labelChange}
          user = {this.props.user}

        />;
    }
    
    return (
      <div id = "main">
        <LeftSidebar 
          ques_tag = {this.props.ques_tag}
          onChangeTabs = {this.props.onChangeTabs}
          onCurrentPageChange = {this.props.onCurrentPageChange}
          onChangeQuestionsDisplayed={this.props.onChangeQuestionsDisplayed}
          onChangeSort = {this.props.onChangeSort}
          dataQuestions={this.props.dataQuestions}
          labelChange = {this.props.labelChange}
          onChangeWelcome ={this.props.onChangeWelcome}
          onChangeAdminTarget={this.props.onChangeAdminTarget}
          user={this.props.user}
        />
        {page}
        
      </div>
    )
  }
}

class MainContent extends React.Component{
  render() {
    return (
      <div id ="main_content">
          <MainLabel 
            onCurrentPageChange={this.props.onCurrentPageChange}
            onChangeQuestionsDisplayed={this.props.onChangeQuestionsDisplayed}
            questions ={this.props.questions}
            sort={this.props.sorted}
            onChangeSort = {this.props.onChangeSort}
            onChangeTabs={this.props.onChangeTabs}
            label = {this.props.label}
            labelChange = {this.props.labelChange}
            user = {this.props.user}
          />
          <MainQuestions 
            dataQuestions={this.props.dataQuestions}
            tags={this.props.tags}
            answers={this.props.answers}
            questions={this.props.questions}
            sort={this.props.sorted}
            onQuestion = {this.props.onQuestion}
            onCurrentPageChange = {this.props.onCurrentPageChange}
            onChangeQuestionsDisplayed={this.props.onChangeQuestionsDisplayed}
            onViewChange={this.props.onViewChange}
          />

      </div>
    )
  }
}

class ResultContent extends React.Component{
  render() {
    return (
      <div id ="main_content">
          <MainLabel 
            onCurrentPageChange={this.props.onCurrentPageChange}
            questions ={this.props.questions}
            sort={this.props.sorted}
            onChangeSort = {this.props.onChangeSort}
            onChangeTabs={this.props.onChangeTabs}
            label = {this.props.label}
            labelChange = {this.props.labelChange}
            user = {this.props.user}
          />
          <MainQuestions 
            dataQuestions={this.props.dataQuestions}
            tags={this.props.tags}
            answers={this.props.answers}
            questions={this.props.questions}
            sort={this.props.sorted}
            onQuestion = {this.props.onQuestion}
            onViewChange={this.props.onViewChange}
          />

      </div>
    )
  }
}

