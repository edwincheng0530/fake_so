import React from "react";

export default class AnswerForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            answer_text: '',
            answer_user_valid: true,
            answer_text_valid: 'valid'
        };

        this.handleAnswerTextChange = this.handleAnswerTextChange.bind(this);
        this.handleAnswerTextValid = this.handleAnswerTextValid.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleNewAnswer= this.handleNewAnswer.bind(this);
        this.handleCurrentPageChange = this.handleCurrentPageChange.bind(this);
    }

    handleAnswerTextChange(text){
        this.setState({answer_text: text});
    }

    handleAnswerTextValid(bool){
        this.setState({answer_text_valid:bool});
    }

    handleNewAnswer(question, user, text){
        this.props.newAnswer(question, user,text);
    }
    handleCurrentPageChange(){
        this.props.onCurrentPageChange("answer_page");
    }
    handleValidation(e){
        e.preventDefault();

        if(this.state.answer_text.length === 0){
            this.handleAnswerTextValid('empty_text');    
        }
        else {
            let empty_link = /\[(.*?)\]\(\)/g;
            let empty_word = /\[\]\((.*?)\)/g;
            let no_link = /\[(.*?)\]\(https?:\/\/\/?\)/g;
            let invalid_link = /\[(.*?)\]\(https?:\/\/\)/g;
            let link_spaced = /\[(.*?)\]\(https?:\/\/\s*\)/g;
            let failed_link = /\[[^\]]+\]\((https?:\/\/\/).*\)/g;
            let no_http = /\[[^\]]+\]\((?!https?:\/\/).*\)/g;
            if(empty_link.test(this.state.answer_text) || failed_link.test(this.state.answer_text) || empty_word.test(this.state.answer_text)
                || no_link.test(this.state.answer_text) || invalid_link.test(this.state.answer_text) || link_spaced.test(this.state.answer_text) || no_http.test(this.state.answer_text)) {
                this.handleAnswerTextValid('bad_link');
            } else {
                this.handleAnswerTextValid('valid');
            }
        }
        this.setState(null, ()=> {
            if(this.state.answer_text_valid === 'valid'){
                this.handleNewAnswer(this.props.question, this.props.user, this.state.answer_text);
                this.handleCurrentPageChange("answer_page");
                this.props.onChangeTabs('question')
            }
        });
    }

    render(){
        return(
            <div id = "main_content">
                <form onSubmit={this.handleValidation} id = "answer_page_container">
                    <AnswerTextContainer 
                        answerTextChange = {this.handleAnswerTextChange} 
                        valid_answer_text = {this.state.answer_text_valid}/>
                    <PostAnswerContainer 
                        onCurrentPageChange={this.props.onCurrentPageChange}
                    />
                </form>
            </div>
        )
    }
}


class AnswerTextContainer extends React.Component{
    constructor(props){
        super(props);
        this.handleAnswerTChange = this.handleAnswerTChange.bind(this);
    }

    handleAnswerTChange(e){
        this.props.answerTextChange(e.target.value);
    }

    render(){
        let answer_text_error;
        switch(this.props.valid_answer_text) {
            case "valid":
                answer_text_error = <label  id = "answer_error"></label>
                break;
            case "empty_text":
                answer_text_error = <label className="error" id = "answer_error">Answer cannot be empty</label>
                break;
            case "bad_link":
                answer_text_error = <label className="error" id = "answer_error">The hyperlink cannot be empty and must start with https:// or http://</label>
                break;
            default:
                answer_text_error = <label  id = "answer_error"></label>
        }
        return(<div id = "answer_text_container">
            <h3 id ="answer_title">Answer Text*</h3>
            {answer_text_error}
            <textarea onChange = {this.handleAnswerTChange} name = "answer" id = "answer_input"></textarea>
        </div>
        );
    }

}


class PostAnswerContainer extends React.Component{
    render(){
        return(
            <div id = "post_answer_container">
                <input type = "submit" id = "post_answer_button" name = "Post Answer"></input>
                <p className="mandatory_note"> *indicates mandatory fields</p>
            </div>
        )
    }
}

