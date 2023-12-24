import React, { useState } from 'react';
export default function Header(props){
    return (
    <div id = "header" className = "header">
        <div id = "website_name">
            <h1>Fake Stack Overflow</h1>
        </div>
        <Searchbar 
            onSearch = {props.onSearch} 
            onChangeTabs = {props.onChangeTabs}
            labelChange = {props.labelChange} 
            onChangeQuestionsDisplayed={props.onChangeQuestionsDisplayed}
            onCurrentPageChange={props.onCurrentPageChange}
            onChangeSort = {props.onChangeSort}
        />
    </div>);
}

function Searchbar(props){
    const [inputText, setInputText] = useState('');
    const handleInputChange = (e) => {setInputText(e.target.value)};
    
    const handleEnter = (event) => {
        if(event.key === 'Enter'){
            props.onSearch(inputText);
            props.onCurrentPageChange('home_questions');
            props.onChangeSort('newest');
            props.onChangeTabs('question')
            event.target.value = " ";

        }
    };
    return(
        <div id = "searchbar">
            <input type = "text" onChange = {handleInputChange} onKeyDown = {handleEnter} placeholder="Search..." className = "search"/>
        </div>
    );
}