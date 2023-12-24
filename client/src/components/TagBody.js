import Delete from './Profile/Delete';
import Edit from './Profile/Edit';
import {useState} from 'react';
import axios from 'axios';
export default function TagBody(props) {
    const [tagId, setTagId] = useState('');
    const [editState, setEditState] = useState('');
    const [error, setError] = useState('');

    const handleSetId = (id) => {
        setTagId(id);
    }

    const handleEditState = (state) => {
        setEditState(state);
    }
    
    const handleSetError = (error) => {
        setError(error);
    }

    const displayTagQuestions = (tid) => {
        let new_questions = [];
        props.dataQuestions.forEach((question) => {
            question.tags.forEach((tag) => {
                if(tag._id === tid) {
                    new_questions.push(question);
                }
            })
        })
        props.onChangeQuestionsDisplayed(new_questions);
        props.onCurrentPageChange('home_questions');
        props.onChangeTabs('question');
        props.onChangeSort('newest');
    }


    const num_tags = (id) => {
        let num_question = 0;
        for(let j = 0; j < props.dataQuestions.length; j++) {
            for(let i = 0; i < props.dataQuestions[j].tags.length; i++) {
                if(props.dataQuestions[j].tags[i]._id === id) {
                    num_question++;
                }
            }
        }
        return num_question;
    }
    if(props.type === 'question') {
        let data = props.tags;
        let tag_array = [];
        for(let i = 0; i < data.length; i++) {
            tag_array.push(
                <div key={data[i]._id} id="new_single_tag">
                    <p onClick={() => displayTagQuestions(data[i]._id)} className="tag_title">{data[i].name}</p>
                    {num_tags(data[i]._id) > 1 ? <p>{num_tags(data[i]._id)} questions</p> : <p>{num_tags(data[i]._id)} question</p>} 
                </div>
            )
        }
    
        return (
            <div id="tag_page_all_tags">
                {tag_array}
            </div>
        )
    } else if (props.type === 'profile') {
        let user = props.user;
        let tags = props.tags;
        let user_tags = [];
        
        tags.forEach((tag) => {
            if(tag.create_by === user._id) {
                user_tags.push(<TagDisplay
                    key={tag._id}
                    user={props.user}
                    tag={tag}
                    tags={props.tags}
                    dataQuestions={props.dataQuestions}
                    onChangeDataQuestions={props.onChangeDataQuestions}
                    onCurrentPageChange={props.onCurrentPageChange}
                    onChangeTabs={props.onChangeTabs}
                    onChangeSort={props.onChangeSort}
                    onChangeQuestionsDisplayed={props.onChangeQuestionsDisplayed}
                    onChangeTagId={handleSetId}
                    onUpdateTags={props.onUpdateTags}
                    tagId={tagId}
                    editState={editState}
                    onEditState={handleEditState}
                    error={error}
                    onSetError={handleSetError}

                    displayTagQuestions={displayTagQuestions}
                    num_tags={num_tags}
                />)
            }
        })
        if(user_tags.length === 0) {
            return (
                <p className="no_tags_created">No Tags Created</p>
            )
        }

        return (
            <div id="tag_page_all_tags">
                {user_tags}
            </div>
        )
    }
}

function TagDisplay(props) {
    let error;
    if(props.tagId === props.tag._id) {
        if(props.error === 'empty') {
            error = <div className="error centered">New tag cannot be empty</div>
        } else if(props.error === 'ten') {
            error = <div className="error centered">New tag cannot be more than ten characters</div>
        } else if(props.error === 'used'){
            error = <div className="error centered">Tag is is being used</div>
        } else if(props.error === 'low_rep'){
            error = <div className="error centered">Reputation too low to create new tag.</div>
        }
    } else {
        let num = 0;
        props.dataQuestions.forEach((question) => {
            question.tags.forEach((tag) => {
                if(tag._id === props.tag._id) {
                    num++;
                }
            })
        })
        if(num !== 1) {
            error = <div className="centered">{num} questions</div>
        } else {
            error = <div className="centered">{num} question</div>
        }
    }
    
    let display;
    if(props.editState === props.tag._id) {
        display = <EditTag
            user={props.user}
            tag={props.tag}
            tags = {props.tags}
            onChangeDataQuestions={props.onChangeDataQuestions}
            onUpdateTags={props.onUpdateTags}
            onEditState={props.onEditState}
            onChangeTagId={props.onChangeTagId}
            onSetError={props.onSetError}
        />
    } else {
        display = <div onClick={() => props.displayTagQuestions(props.tag._id)} className="tag_title centered">{props.tag.name}</div>
    }

    return (
        <div id="new_single_tag">
            <div className="profile_tag_display_container">
                {display}
            </div>
            {error}
            {/* {props.num_tags(props.tag._id) > 1 ? <p>{props.num_tags(props.tag._id)} questions</p> : <p>{props.num_tags(props.tag._id)} question</p>}  */}
            <div className="edit_and_delete">
                <Edit
                    type={'tag'}
                    user={props.user}
                    tag={props.tag}
                    dataQuestions={props.dataQuestions}
                    onChangeTagId={props.onChangeTagId}
                    onChangeDataQuestions={props.onChangeDataQuestions}
                    onUpdateTags={props.onUpdateTags}
                    onEditState={props.onEditState}
                    onSetError={props.onSetError}
                />
                <Delete
                    type={'tag'}
                    user={props.user}
                    tag={props.tag}
                    dataQuestions={props.dataQuestions}
                    onChangeTagId={props.onChangeTagId}
                    onChangeDataQuestions={props.onChangeDataQuestions}
                    onUpdateTags={props.onUpdateTags}
                    onSetError={props.onSetError}
                />
            </div>
        </div>
    )
}

function EditTag(props) {
    const [newTag, setNewTag] = useState(props.tag.name);

    const handleChange = (e) => {
        setNewTag(e.target.value)
    }

    const handleEnter = async (event) => {
        if(event.key === 'Enter'){
            if(newTag.trim().length === 0) {
                props.onChangeTagId(props.tag._id);
                props.onSetError('empty')
                return;
            } else if (newTag.length > 10) {
                props.onChangeTagId(props.tag._id);
                props.onSetError('ten');
                return;
            }
            else if(props.user.reputation < 50 && !props.user.admin && !props.tags.map((t) => t.name).includes(newTag)){
                props.onChangeTagId(props.tag._id);
                props.onSetError('low_rep');
                return;
            }
            await axios.post('http://localhost:8000/edittag', {tag: props.tag, new_tag: newTag})
                .then((res) => {
                    props.onUpdateTags();
                    props.onChangeDataQuestions(res.data[0]);
                });
            props.onSetError('');
            props.onEditState('');
            props.onChangeTagId('');
        }
    }

    return (
        <input className="edit_tag_input" type="text" onChange={handleChange} onKeyDown={handleEnter} value={newTag}></input>
    )
}