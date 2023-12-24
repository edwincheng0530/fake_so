import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import axios from 'axios';
import '../stylesheets/index.css';

export default class fakeStackOverflow extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'home_questions',
      currentQuestion: {},
      currentAnswer: {},
      sorted: 'newest',
      dataQuestions: [],
      dataAnswers: [],
      dataTags: [],
      questions: [],
      searchvalue: '',
      label: "All Questions",
      ques_tag: 'question'
    }
    
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNewQuestion = this.handleNewQuestion.bind(this);
    this.handleChangeQuestionsDisplayed = this.handleChangeQuestionsDisplayed.bind(this);
    this.handleChangeQuestionsDisplayed2 = this.handleChangeQuestionsDisplayed2.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleNewAnswer = this.handleNewAnswer.bind(this);
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleChangeViews = this.handleChangeViews.bind(this);
    this.handleCurrentPageChange = this.handleCurrentPageChange.bind(this);
    this.handleCurrentQuestionChange = this.handleCurrentQuestionChange.bind(this);
    this.handleCurrentAnswerChange = this.handleCurrentAnswerChange.bind(this);
    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.handleChangeTabs = this.handleChangeTabs.bind(this);
    this.handleChangeDataQuestions = this.handleChangeDataQuestions.bind(this);
    this.handleUpdateTags = this.handleUpdateTags.bind(this);
    this.handleUpdateAnswers = this.handleUpdateAnswers.bind(this);
  }
  
  async componentDidMount() {
    await axios.get('http://localhost:8000/questions')
        .then((res) => {
            this.setState({dataQuestions: res.data});
            this.setState({questions: res.data})
        });

    await axios.get('http://localhost:8000/answers')
      .then((res) => {
          this.setState({dataAnswers: res.data});
      });

    await axios.get('http://localhost:8000/tags')
      .then((res) => {
          this.setState({dataTags: res.data});
      });
      
  }

  async updateQuestions(){
    await axios.get('http://localhost:8000/questions')
    .then((res) => {
        this.setState({dataQuestions: res.data});
        this.setState({questions: res.data});
    });
  }

  async updateAnswers(){
    await axios.get('http://localhost:8000/answers')
    .then((res) => {
        const new_answer_arr = res.data;
        this.setState({dataAnswers: new_answer_arr});
    });
  }

  async updateTags(){
    await axios.get('http://localhost:8000/tags')
    .then((res) => {
        this.setState({dataTags: res.data});
    });
  }

  async addComment(comment_data, question_or_answer){
    try{
      if(question_or_answer === 'question'){
        await axios.post('http://localhost:8000/newQuestionComment', {comment: comment_data, question: this.state.currentQuestion})
        .then((res) => {
          this.handleChangeDataQuestions(res.data[0]);
        })
      }
      else{
        await axios.post('http://localhost:8000/newAnswerComment', {comment: comment_data, answer: this.state.currentAnswer})
        .then((res) => {
          this.handleChangeDataQuestions(res.data[0]);
        })
      }
    }
    catch(error){
      console.error("error", error);
    }
  }

  async addQuestion(question_data){
    let tag_ids = [];
    await axios.post('http://localhost:8000/newtag', {tags: question_data.tags, user: question_data.asked_by})
    .then((res) =>{
      tag_ids = res.data;
    });
    this.updateTags();

    const new_question = {title: question_data.title, text: question_data.text, summary:question_data.summary, tags: tag_ids, asked_by: question_data.asked_by, ask_date_time: new Date()};
    await axios.post('http://localhost:8000/newquestion', new_question)
    .then((res) => {
      this.setState({currentQuestion : res.data});
    });
    this.updateQuestions();
  }

  async addAnswer(q) {
    try {
      await axios.post('http://localhost:8000/newanswer', { question: q.question, answer_data: q.answer_data});
      const questions = await axios.get('http://localhost:8000/questions');
      this.setState({ dataQuestions: questions.data });
      let updated_question = questions.data.find((x) => x._id === q.question._id);
      this.setState({ currentQuestion: updated_question });
      this.setState({ currentPage: 'answer_page' });
      this.updateAnswers();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  async updateView(q) {
    try {
      await axios.post('http://localhost:8000/newview', q);
      const questions = await axios.get('http://localhost:8000/questions');
      this.setState({dataQuestions: questions.data });
    } catch (error) {
      console.error('An error occured:', error)
    }
  }

  handleUpdateTags() {
    this.updateTags();
  }

  handleUpdateAnswers() {
    this.updateAnswers();
  }

  handleChangeDataQuestions(ques) {
    this.updateQuestions();
    this.setState({currentQuestion: ques});
  }

  handleLabelChange(label){
    this.setState({label:label});
  }

  handleSearch(search_text){
    this.setState({searchvalue:  search_text});
    this.setState(null, () => {
      this.handleChangeQuestionsDisplayed(get_questions_from_search(this.state.searchvalue, this.state.dataQuestions, tags_from_search(this.state.searchvalue), non_tags_from_search(this.state.searchvalue), this.state.dataTags));
      this.handleLabelChange("Search Results");
    })
  }

  handleChangeSort(sort) {
    this.setState({sorted: sort});
  }

  handleCurrentPageChange(currentPage){
    this.setState({currentPage : currentPage});
  }

  handleCurrentQuestionChange(question, currentPage){
    this.setState({currentQuestion : question});
    this.setState({currentPage: currentPage});
  }

  handleCurrentAnswerChange(answer){
    this.setState({currentAnswer: answer});
  }

  handleChangeViews(question) {
    this.updateView(question);
    question.views++;
  }

  handleNewAnswer(question, name, text){
    this.addAnswer({question: question, answer_data: {text: text, ans_by: name, ans_date_time: new Date()}});
  }
  handleNewQuestion(question_title, question_text, question_summary, tag_array, username_text) {
    this.addQuestion({title: question_title, text: question_text, summary: question_summary, tags: tag_array, asked_by: username_text});
  }
  handleNewComment(comment_text, question_or_answer){
    this.addComment({text: comment_text, comm_by: this.props.user.username, upvote: 0}, question_or_answer);
  }

  handleChangeQuestionsDisplayed(new_question) {
    this.setState({questions: new_question});
  }
  handleChangeQuestionsDisplayed2() {
    let new_question = get_questions_from_search(this.state.searchvalue, this.state.dataQuestions, tags_from_search(this.state.searchvalue), non_tags_from_search(this.state.searchvalue), this.state.dataTags);
    this.setState({questions: new_question});
  }

  handleChangeTabs(tab) {
    this.setState({ques_tag: tab});
  }

  render() {
      return (
          <>
            <Header 
              onSearch = {this.handleSearch} 
              labelChange = {this.handleLabelChange} 
              onChangeQuestionsDisplayed = {this.handleChangeQuestionsDisplayed}
              currentPage={this.state.currentPage}
              onCurrentPageChange={this.handleCurrentPageChange}
              onChangeSort = {this.handleChangeSort}
              onChangeTabs = {this.handleChangeTabs}

              user={this.props.user}
            />
            <Main 
              onNewQuestion={this.handleNewQuestion}
              onNewAnswer={this.handleNewAnswer}
              onChangeQuestionsDisplayed={this.handleChangeQuestionsDisplayed}
              questions={this.state.questions}
              dataQuestions={this.state.dataQuestions}
              answers = {this.state.dataAnswers}
              tags = {this.state.dataTags}
              label = {this.state.label}
              labelChange = {this.handleLabelChange}
              onViewChange={this.handleChangeViews}
              currentPage={this.state.currentPage}
              onCurrentPageChange={this.handleCurrentPageChange}
              question = {this.state.currentQuestion}
              answer = {this.state.currentAnswer}
              onQuestion = {this.handleCurrentQuestionChange}
              onAnswer = {this.handleCurrentAnswerChange}
              onChangeSort = {this.handleChangeSort}
              sorted= {this.state.sorted}
              ques_tag={this.state.ques_tag}
              onChangeTabs = {this.handleChangeTabs}

              user={this.props.user}
              onChangeUser = {this.props.onChangeUser}
              onChangeWelcome={this.props.onChangeWelcome}
              onNewComment={this.handleNewComment}
              onChangeDataQuestions={this.handleChangeDataQuestions}
              onUpdateTags={this.handleUpdateTags}
              onUpdateAnswers={this.handleUpdateAnswers}
              adminTarget={this.props.adminTarget}
              onChangeAdminTarget={this.props.onChangeAdminTarget}
            />
        </>
      )
  }
}


function get_questions_from_search(search, questions, tag, non_tag, allTags){
  search = search.trim();
  if (!search)
    return [];
  let filtered_questions = questions.filter(q=> contain_keyword(q, tag, non_tag, allTags));
  return filtered_questions;
}



function contain_keyword(question, tag, non_tag, allTags){
  if(non_tag){
    for(const s of non_tag){
      if (question.text.toLowerCase().includes(s.toLowerCase()) || question.title.toLowerCase().includes(s.toLowerCase()))
        return true;
    }
  }

  if(tag){
    for(const t of tag){
      
      let found_tag = allTags.find( x => x.name.toLowerCase() === t.toLowerCase());
      let tagID;
      if(found_tag)
        tagID = found_tag._id;
      
      if(tagID){
        for(const id of question.tags){
          if (id.toLowerCase()=== tagID.toLowerCase()){
            return true;
          }
        }
      }
    }
  }
  return false;
}

function tags_from_search(search_str){
  const bracket_regrex = /\[([^\]]+)\]/g;
  let tags = search_str.match(bracket_regrex);
  if(tags){
    for( let i = 0; i < tags.length; i++){
      tags[i] = tags[i].slice(1,-1);
    }
  }
  return tags;
}

function non_tags_from_search(search_str){
  search_str = search_str.replace(/\[([^\]]+)\]/g, ' ');
  let non_tags = search_str.trim().split(/\s+/).filter(Boolean);

  return non_tags;
}