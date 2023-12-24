import React from "react";
import AskQuestionButton from "./AskQuestionButton";
import TagBody from './TagBody';

export default function TagPage(props) {
    return (
        <div id="main_content">
            <TagHeader 
                tags = {props.tags}
                onCurrentPageChange={props.onCurrentPageChange}
                onChangeTabs={props.onChangeTabs}
                labelChange = {props.labelChange}
                user = {props.user}
            />
            <TagBody
                type={'question'}
                dataQuestions = {props.dataQuestions}
                tags = {props.tags}
                onChangeQuestionsDisplayed={props.onChangeQuestionsDisplayed}
                onCurrentPageChange={props.onCurrentPageChange}
                onChangeTabs={props.onChangeTabs}
                onChangeSort={props.onChangeSort}
            />
        </div>
    )
}

function TagHeader(props) {
    let ask_button;
    if(props.user !== 'guest') {
        ask_button = <AskQuestionButton
        onCurrentPageChange={props.onCurrentPageChange}
        onChangeTabs={props.onChangeTabs}
        labelChange = {props.labelChange}
    />
    } else {
        ask_button = <button id="ask_question"> Ask Question</button>
    }

    let num = props.tags.length;
    let tag;
    num > 1 ? tag = <h2>{num} Tags</h2> : <h2>{num} Tag</h2>
    return (
        <div id="tag_page_top">
            {tag}
            <h2>All Tags</h2>
            {ask_button}
        </div>
    )
}