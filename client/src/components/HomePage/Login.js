import Back from './Back'
import {useState} from 'react';
import axios from 'axios';

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateInfo = () => {
        let email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!email_regex.test(email)) {
            setError('Email msut be a valid address, e.g. me@mydomain.com');
            return false;
        }
        setError('');
        return true;
    }

    const changeWelcome = () => {
        props.onChangeWelcome('questions');
    }

    const changeUser = (user) => {
        props.onChangeUser(user);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(validateInfo()) {
            axios.post('http://localhost:8000/login', {email, password})
                .then((res) => {
                    if(res.data === 'password') {
                        setError("Invalid Password, try again");
                    } else if (res.data === 'email') {
                        setError("Email not registered, try again");
                    } else {
                        setError('');
                        changeWelcome();
                        changeUser(res.data);
                        props.onChangeAdminTarget(res.data);
                    }
                })
        }
    }

    return (
        <div className="login-buttons">
            <form onSubmit={handleSubmit}>
                <div className="acc_info">
                    <input 
                        type="text" 
                        name="email" 
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                <button id="login">Login</button>
                <div id="line-break"></div>
                <div className="back">
                    <Back onChangeType={props.onChangeType}/>
                    <div className="errorm">{error}</div>
                </div>
            </form>
        </div>
    )
}