import Back from './Back';
import {useState} from 'react';
import axios from 'axios';

export default function Register(props) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verify, setVerify] = useState('');
    const [error, setError] = useState('');

    const validateInfo = () => {
        let sUser = username.trim();
        let sEmail = email.trim();
        let sPassword = password.trim();
        let sVerify = verify.trim();

        let email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let index = sEmail.indexOf('@');
        let email_id;
        if (index !== -1) {
            email_id = sEmail.substring(0, index);
        }
        if(sUser.length === 0 || sEmail.length === 0 || sPassword.length === 0 || sVerify.length === 0) {
            setError('No fields can be left empty');
            return false;
        } else if (!email_regex.test(sEmail)) {
            setError('Email msut be a valid address, e.g. me@mydomain.com');
            return false;
        } else if (sPassword.trim().includes(sUser) || sPassword.trim().includes(email_id.trim())) {
            setError('The password cannot include your username or email id');
            return false;
        } else if (sPassword !== sVerify){
            setError('Passwords do not match');
            return false;
        }
        setError('');
        return true;
    }

    const changeType= () => {
        props.onChangeType('main');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(validateInfo()) {
            axios.post('http://localhost:8000/newuser', {username, email, password})
                .then((res) => {
                    if(!res.data) {
                        setError('This email is already in use. Please pick another email.');
                    } else {
                        setError('');
                        changeType();
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
                        name="username" 
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                    ></input>
                    <input 
                        type="text"
                        name="email" 
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <div className="passwords">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}
                        ></input>
                        <input 
                            type="password" 
                            name="confirmpassword" 
                            placeholder='Confirm Password'
                            onChange={(e) => setVerify(e.target.value)}
                        ></input>
                    </div>
                </div>
                <button id="register">Sign Up</button>
                <div id="line-break"></div>
                <div className="back">
                    <Back onChangeType={props.onChangeType}/>
                    <div className="errorm">{error}</div>
                </div>
            </form>
        </div>
    )
}