import React from "react";
export default function AskQuestionButton(props) {
    const handleChange = () => {
        props.onChangeTabs('question');
        props.onCurrentPageChange('question_form');
        props.labelChange("All Questions");
    }

    return (
        <button onClick={() => handleChange()} id="ask_question"> Ask Question</button>
    )
}
