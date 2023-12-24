import axios from 'axios'
import { useState, useEffect } from 'react'
import Delete from './Delete';
export default function ProfileAdmin(props) {
    const [users, setUsers] = useState([]);

    const handleSetUsers = async () => {
        await axios.get('http://localhost:8000/users')
            .then((res) => {
                setUsers(res.data);
            });
    }

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get('http://localhost:8000/users')
                    .then((res) => {
                        setUsers(res.data);
                    });
            } catch (err) {
                console.log('Error getting users:', err);
            }
        }
        getData();
    }, [])
    
    let user_display = [];
    users.forEach((user_delete) => {
        user_display.push(<UserDisplay
            key={user_delete._id}
            user_delete={user_delete}
            user={props.user}
            onChangeWelcome ={props.onChangeWelcome}
            onChangeDataQuestions={props.onChangeDataQuestions}
            onUpdateTags={props.onUpdateTags}
            onUpdateAnswers={props.onUpdateAnswers}
            onSetUsers={handleSetUsers}
            onCurrentPageChange = {props.onCurrentPageChange}
            onChangeAdminTarget={props.onChangeAdminTarget}
        />)
    });

    if(user_display.length === 0) {
        user_display.push(<div key={1}>This system has no other users</div>)
    }

    return(
        <div>
            {user_display}
        </div>
    )
}

function UserDisplay(props) {
    const handleUserProfile = async (target_user) => {
        await props.onChangeAdminTarget(target_user)
    }

    return (
        <div className="admin_users">
            <div className="user_title_container">
                <p className="user_title" onClick={() => handleUserProfile(props.user_delete)}>{props.user_delete.username}</p>
                <p>{props.user_delete.email}</p>
            </div>
            <Delete
                type={'admin'}
                user_delete={props.user_delete}
                user={props.user}
                onChangeWelcome ={props.onChangeWelcome}
                onChangeDataQuestions={props.onChangeDataQuestions}
                onUpdateTags={props.onUpdateTags}
                onUpdateAnswers={props.onUpdateAnswers}
                onSetUsers={props.onSetUsers}
            />
        </div>
    )
}