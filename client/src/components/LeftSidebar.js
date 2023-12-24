import Logout from './Logout';

export default function LeftSidebar({ques_tag, onChangeTabs, onCurrentPageChange, onChangeQuestionsDisplayed, onChangeSort, dataQuestions, labelChange, onChangeWelcome, onChangeAdminTarget, user}){

    const handleQuestionClick = () => {
        onChangeTabs('question');
        onChangeQuestionsDisplayed(dataQuestions);
        onCurrentPageChange('home_questions');
        onChangeSort('newest')
        labelChange("All Questions");
    };

    const handleTagsClick = () => {
        onChangeTabs('tag');
        onCurrentPageChange('tag_page');
    
    };

    const handleProfileClick = () => {
        onChangeTabs('profile');
        onCurrentPageChange('profile_page');
        onChangeAdminTarget(user);
    }

    return(
        <div id = "left_sidebar">
            <div>
                <div id = "question">
                    <button id = "question_button" className = {ques_tag === 'question' ? "left_buttons hovering" : "left_buttons"} onClick={() => handleQuestionClick()}>Question</button>
                </div>
                <div id = "tags">
                    <button id = "tag_button" className = {ques_tag === 'tag' ? "left_buttons hovering": "left_buttons"} onClick={() => handleTagsClick()}>Tags</button>
                </div>
                <div id = "profile">
                    <Profile 
                        ques_tag={ques_tag}
                        onProfileClick={handleProfileClick}
                    />
                </div>
            </div>
            <div>
                <Logout 
                    onChangeWelcome={onChangeWelcome}
                />
            </div>
        </div>
    );
}

function Profile(props) {
    return (
        <button 
            className = {props.ques_tag === 'profile' ? "left_buttons hovering": "left_buttons"} 
            onClick={() => props.onProfileClick()}
        >Profile</button>
    )
}