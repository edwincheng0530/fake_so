import { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function LoginPage(props) {
    const [type, setType] = useState('main');

    const handleChangeType = (type) => {
        setType(type);
    }

    let login_register;
    switch(type) {
        case 'main':
            login_register = <MainLogin 
                onChangeType={handleChangeType}
                onChangeWelcome={props.onChangeWelcome}
                onChangeUser={props.onChangeUser}
                />
            break;
        case 'login':
            login_register = <Login 
                onChangeType={handleChangeType}
                onChangeWelcome={props.onChangeWelcome}
                onChangeUser={props.onChangeUser}
                onChangeAdminTarget={props.onChangeAdminTarget}
                />
            break;
        case 'register':
            login_register = <Register onChangeType={handleChangeType}/>
            break;
        default:
            break;
    }

    return (
        <div id="container">
            <div className="title_and_login">
                <div className="title_container">
                    <h1 className="title">Fake Stack Overflow</h1>
                </div>
                {login_register}
            </div>
        </div>
    )
}

function MainLogin(props) {
    const changeType = (type) => {
        props.onChangeType(type);
    }

    const changeUser = (user) => {
        props.onChangeUser(user);
        props.onChangeWelcome('questions');
    }
    return (
        <div className="login-buttons">
                <div className="login-register">
                    <button onClick={() => changeType('login')}>Login</button>
                    <button onClick={() => changeType('register')}>Register</button>
                </div>
                <div id="line-break"></div>
                <button id="guest" onClick={() => changeUser('guest')}>Guest</button>
            </div>
    )
}