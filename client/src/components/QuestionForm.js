import React from "react";
import axios from 'axios';

export default class QuestionForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            question_title: '',
            question_text: '',
            question_summary: '',
            question_tag: '',
            title_valid: true,
            text_valid: 'valid',
            summary_valid: 'valid',
            tag_valid: 'valid',
        };
        if(this.props.type === 'profile') {
            this.state.question_title = this.props.question.title;
            this.state.question_text = this.props.question.text;
            this.state.question_summary = this.props.question.summary;
            let tags = [];
            this.props.question.tags.forEach((tag) => {
                tags.push(tag.name);
            })
            let complete_tag = tags.join(' ');
            this.state.question_tag = complete_tag;
        }


        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSummaryChange = this.handleSummaryChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);

        this.handleTitleValid = this.handleTitleValid.bind(this);
        this.handleTextValid = this.handleTextValid.bind(this);
        this.handleSummaryValid = this.handleSummaryValid.bind(this);
        this.handleTagValid = this.handleTagValid.bind(this);

        this.handleValidation = this.handleValidation.bind(this);
        this.handleCurrentPageChange = this.handleCurrentPageChange.bind(this);
        this.handleNewQuestion = this.handleNewQuestion.bind(this);
        this.handleChangeQuestionsDisplayed = this.handleChangeQuestionsDisplayed.bind(this);
        this.handleChangeSort = this.handleChangeSort.bind(this);
    }

    handleTitleChange(title) {
        this.setState({question_title : title});
    }
    handleTextChange(text) {
        this.setState({question_text : text});
    }
    handleSummaryChange(summary){
        this.setState({question_summary: summary});
    }
    handleTagChange(tag) {
        this.setState({question_tag : tag});
    }

    handleTitleValid(bool) {
        this.setState({title_valid : bool});
    }
    handleTextValid(text) {
        this.setState({text_valid : text});
    }
    handleSummaryValid(summ){
        this.setState({summary_valid: summ})
    }
    handleTagValid(text) {
        this.setState({tag_valid : text});
    }

    handleCurrentPageChange(place) {
        this.props.onCurrentPageChange(place);
    }
    handleNewQuestion(question_title, question_text, question_summary, tag_array, username_text) {
        this.props.onNewQuestion(question_title, question_text, question_summary, tag_array, username_text);
    }
    handleChangeQuestionsDisplayed(new_questions) {
        this.props.onChangeQuestionsDisplayed(new_questions);
    }
    handleChangeSort(sort) {
        this.props.onChangeSort(sort);
    }

    handleValidation(e) {
        e.preventDefault();
        // Question Title Error
        if(this.state.question_title.length === 0 || this.state.question_title.length > 50) {
            this.handleTitleValid(false);
          } else {
            this.handleTitleValid(true);
          } 
          
          // Question Text Error
          if (this.state.question_text.length === 0) {
            this.handleTextValid('empty_text');
          } else {
            let empty_link = /\[(.*?)\]\(\)/g;
            let empty_word = /\[\]\((.*?)\)/g;
            let no_link = /\[(.*?)\]\(https?:\/\/\/?\)/g;
            let invalid_link = /\[(.*?)\]\(https?:\/\/\)/g;
            let link_spaced = /\[(.*?)\]\(https?:\/\/\s*\)/g;
            let failed_link = /\[[^\]]+\]\((https?:\/\/\/).*\)/g;
            let no_http = /\[[^\]]+\]\((?!https?:\/\/).*\)/g;
            if(empty_link.test(this.state.question_text) || failed_link.test(this.state.question_text) || empty_word.test(this.state.question_text)
                || no_link.test(this.state.question_text) || invalid_link.test(this.state.question_text) || link_spaced.test(this.state.question_text) || no_http.test(this.state.question_text)) {
                this.handleTextValid('bad_link');
            } else {
                this.handleTextValid('valid');
            }
          }
          //Question Summary Error
          if(this.state.question_summary.length === 0){
            this.handleSummaryValid('empty_summary');
          }
          else if(this.state.question_summary.length > 140){
            this.handleSummaryValid('longer_than_150');
          }
          else
            this.handleSummaryValid('valid');
      
          // Tag Error
          let tag_array = this.state.question_tag.trim().split(" ");
          let longer_than_ten = false;
          let low_reputation = false;
          for(let i = 0; i < tag_array.length; i++) {
            if(tag_array[i].length > 10) {
              longer_than_ten = true;
              break;
            }
          }
          if(this.props.user.reputation<50 && !this.props.user.admin){
              for(let i = 0; i <tag_array.length; i++){
                if(!this.props.tags.map((tag) => tag.name).includes(tag_array[i])){

                    low_reputation = true;
                    break;
                }
              }
          }
      
          if (tag_array.length > 5 || longer_than_ten || this.state.question_tag.length === 0 || low_reputation) {
              this.state.question_tag.length === 0 ? 
              this.handleTagValid('empty') :
                longer_than_ten ? 
                  this.handleTagValid('longer_than_10') :
                    tag_array.length > 5 ?
                        this.handleTagValid('more_than_5'):
                        this.handleTagValid('low_reputation')
          } 
          else {
              this.handleTagValid('valid');
          }

        this.setState(null, async () => {
            if(this.state.title_valid && this.state.text_valid && this.state.tag_valid === 'valid') {
                if(this.props.type === 'main') {
                    this.handleNewQuestion(this.state.question_title, this.state.question_text, this.state.question_summary, tag_array, this.props.user);
                    this.handleCurrentPageChange("home_questions");
                    this.handleChangeQuestionsDisplayed(this.props.dataQuestions);
                    this.handleChangeSort('newest');
                } else {
                    await axios.post('http://localhost:8000/editquestion', {question: this.props.question, title: this.state.question_title, text: this.state.question_text, summary: this.state.question_summary, tags: tag_array, user: this.props.user})
                        .then((res) => {
                            this.handleCurrentPageChange("profile_page");
                            this.props.onChangeDataQuestions(res.data[0]);
                            this.props.onUpdateTags();
                        })
                }
            }
        });
    }

    render() {
        return (
            <div id = "main_content">
                <form onSubmit={this.handleValidation} id = "question_container">
                    <QuestionTitleContainer 
                        onTitleChange={this.handleTitleChange}
                        titleValid={this.state.title_valid}
                        title={this.state.question_title}
                        type={this.props.type}
                    />
                    <QuestionTextContainer 
                        onTextChange={this.handleTextChange}
                        textValid={this.state.text_valid}
                        text={this.state.question_text}
                        type={this.props.type}
                    />
                    <QuestionSummaryContainer
                        onSummaryChange = {this.handleSummaryChange}
                        summaryValid = {this.state.summary_valid}
                        summary={this.state.question_summary}
                        type={this.props.type}
                    />
                    <TagContainer 
                        onTagChange={this.handleTagChange}
                        tagValid={this.state.tag_valid}
                        tag={this.state.question_tag}
                        type={this.props.type}
                    />
                    <Submitcontainer 
                        onCurrentPageChange={this.props.onCurrentPageChange}
                    />
                </form>
            </div>
        );            
    }
    
}

class QuestionTitleContainer extends React.Component{
    constructor(props) {
        super(props);
        this.handleTitleChange = this.handleTitleChange.bind(this);
    }

    handleTitleChange(e) {
        this.props.onTitleChange(e.target.value)
    }

    render() {
        let question_title;
        if(this.props.titleValid) {
            question_title =  <label id = "question_title_blur">Limit title to 50 characters or less</label>
        } else {
            question_title = <label className="error" id = "question_title_blur">The question title cannot not be empty</label>
        }


        let input;
        if(this.props.type === 'main') {
            input = <input onChange={this.handleTitleChange} type= "text" name = "question_title" minLength = "1"></input>
        } else {
            input = <input onChange={this.handleTitleChange} type= "text" name = "question_title" minLength = "1" value={this.props.title}></input>
        }
        return (
            <div id = "question_title_container">
                <h3>Question Title*</h3>
                {question_title}
                {input}
            </div>
        )
    }
}

class QuestionTextContainer extends React.Component{
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleTextChange(e){
        this.props.onTextChange(e.target.value);
    }

    render() {
        let question_text;
        switch(this.props.textValid) {
            case "valid":
                question_text =  <label id = "question_text_blurb">Add details</label>
                break;
            case "empty_text":
                question_text = <label className="error" id = "question_text_blurb">The text cannot be empty</label>
                break;
            case "bad_link":
                question_text = <label className="error" id = "question_text_blurb">The hyperlink cannot be empty and must start with https:// or http://</label>
                break;
            default:
                question_text =  <label id = "question_text_blurb">Add details</label>
        }
        let input;
        if(this.props.type === 'main') {
            input =  <textarea onChange={this.handleTextChange} name = "question_text" className="question_text"></textarea>
        } else {
            input =  <textarea onChange={this.handleTextChange} name = "question_text" className="question_text" value={this.props.text}></textarea>
        }
        return (
            <div id = "question_text_container">
                <h3>Question Text*</h3>
                {question_text}
                {input}
            </div>
        );
    }
}

class QuestionSummaryContainer extends React.Component{
    constructor(props){
        super(props);
        this.handleSummaryChange = this.handleSummaryChange.bind(this);
    }

    handleSummaryChange(summary){
        this.props.onSummaryChange(summary.target.value);
    }

    render(){
        let question_summary;
        switch(this.props.summaryValid){
            case 'valid': 
                question_summary = <label id = "question_summary_blur">Add details</label>;
                break;
            case 'empty_summary':
                question_summary = <label className = 'error' id = 'question_summary_blur'>The summary cannot be empty.</label>;
                break;
            case 'longer_than_150':
                question_summary = <label className = 'error' id = 'question_summary_blur'>The summary cannot be over 140 characters.</label>;
                break;
            default:
                question_summary = <label id = "question_summary_blur">Add details</label>;
                break;
        }
        let input;
        if(this.props.type === 'main') {
            input =  <textarea onChange={this.handleSummaryChange} name = "question_summary" className = "question_summary"></textarea>
        } else {
            input = <textarea onChange={this.handleSummaryChange} name = "question_summary" className = "question_summary" value={this.props.summary}></textarea>
        }
        return(
            <div id = "question_summary_container">
                <h3>Question Summary*</h3>
                {question_summary}
                {input}
            </div>
        )
    }
}

class TagContainer extends React.Component{
    constructor(props) {
        super(props);
        this.handleTagChange = this.handleTagChange.bind(this);
    }

    handleTagChange(e) {
        this.props.onTagChange(e.target.value);
    }

    render() {
        let question_tag;
        switch(this.props.tagValid) {
            case "valid":
                question_tag =  <label id = "tag_blurb">Add keywords separated by whitespace</label>
                break;
            case "empty":
                question_tag = <label className="error" id = "tag_blurb">Your tag section cannot be empty</label>
                break;
            case "longer_than_10":
                question_tag = <label className="error" id = "tag_blurb">Your tags cannot be longer than 10 characters!</label>
                break;
            case "more_than_5":
                question_tag = <label className="error" id = "tag_blurb">There cannot be more than 5 tags!</label>
                break;
            case "low_reputation":
                question_tag = <label className="error" id = "tag_blurb">Your reputation is too low to create new tags.</label>
                break;
            default:
                question_tag =  <label id = "tag_blurb">Add keywords separated by whitespace</label>
        }
        let input;
        if(this.props.type === 'main') {
            input = <input onChange={this.handleTagChange} type = "text" name = "tag_text"></input>
        } else {
            input = <input onChange={this.handleTagChange} type = "text" name = "tag_text" value={this.props.tag}></input>
        }
        return (
            <div id = "tag_container">
                <h3>Tags*</h3>
                {question_tag}
                {input}
            </div>
        );
    }
}

class Submitcontainer extends React.Component {
    render() {
        return (
            <div id = "submit_container">
                <input type = "submit" id = "post_question"></input>
                <p className = "mandatory_note">indicates mandatory fields</p>
            </div>
        )       
    }
}
