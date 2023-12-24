import axios from 'axios'
export default function Delete(props) {
    if(props.type === 'question') {
        const handleDelete = async () => {
            await axios.post('http://localhost:8000/deletequestion', {question: props.question})
                .then((res) => {
                    props.onChangeDataQuestions(res.data);
                })
        }
    
        return (
            <button className="delete_button" onClick={() => handleDelete()}>Delete</button>
        )
    } else if (props.type === 'tag') {
        const handleDelete = async () => {
            let questions = props.dataQuestions;
            let tag = props.tag;
            let user = props.user;

            let bool = true;
            questions.forEach((question) => {
                question.tags.forEach((test_tag) => {
                    if(test_tag._id === tag._id && question.asked_by._id !== user._id) {
                        props.onChangeTagId(test_tag._id);
                        props.onSetError('used');
                        bool = false;
                    }
                })
            })

            if(bool) {
                await axios.post('http://localhost:8000/deletetag', {tag: props.tag})
                    .then((res) => {
                        props.onChangeDataQuestions(res.data);
                        props.onUpdateTags();
                        props.onChangeTagId('');
                    })
            }
        }

        return (
            <button className="smaller_delete_edit" onClick={() => handleDelete()}>Delete</button>
        )
    } else if(props.type === 'answer') {
        const handleDelete = async () => {
            await axios.post('http://localhost:8000/deleteanswer', {answer: props.answer, question: props.question})
                .then((res) => {
                    props.onChangeDataQuestions('');
                    props.onQuestion(res.data[0], 'profile_answer_page');
                })
        }
        return (
            <button className="smaller_delete_edit" onClick={() => handleDelete()}>Delete</button>
        )
    } else if (props.type === 'admin') {

        const confirm_delete = async () =>{
            let confirm = await window.confirm ("Are you sure you want to delete this user?");
            if(confirm){
                await handleDelete();
            }
        }

        const handleDelete = async () => {
            if(props.user_delete._id === props.user._id) {
                await axios.post('http://localhost:8000/logout');
                props.onChangeWelcome('login');
            }
            await axios.post('http://localhost:8000/deleteuser', {user_delete: props.user_delete})
                .then((res) => {
                    props.onChangeDataQuestions('');
                    props.onUpdateTags();
                    props.onUpdateAnswers();
                    props.onSetUsers();
                })
        }

        return (
            <button className="delete_button" onClick={() => confirm_delete()}>Delete</button>
        )
    }
}