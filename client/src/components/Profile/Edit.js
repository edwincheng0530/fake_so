export default function Edit(props) {
    if(props.type === 'tag') {
        let bool = true;
        const handleEdit = async () => {
            let questions = props.dataQuestions;
            let tag = props.tag;
            let user = props.user;
            questions.forEach((question) => {
                question.tags.forEach((test_tag) => {
                    if(test_tag._id === tag._id && question.asked_by._id !== user._id) {
                        props.onChangeTagId(test_tag._id);
                        props.onEditState('');
                        props.onSetError('used');
                        bool = false;
                    }
                })
            })
    
            if(bool) {
                props.onEditState(props.tag._id);
                props.onChangeTagId('');
            }
        }
    
        return (
            <div>
                <button className="smaller_delete_edit" onClick={() => handleEdit()}>Edit</button>
            </div>
        )
    } else if (props.type === 'answer') {
        const handleEdit = async () => {
            props.onEditState(props.answer._id);
        }
        return (
            <div>
                <button className="smaller_delete_edit" onClick={() => handleEdit()}>Edit</button>
            </div>
        )
    }
}