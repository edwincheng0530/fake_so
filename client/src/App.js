// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js';
import { useState, useEffect } from 'react';
import LoginPage from './components/HomePage/LoginPage';
import axios from 'axios';
axios.defaults.withCredentials = true;

function App() {
  const [welcome, setWelcome] = useState('login');
  const [user, setUser] = useState('');
  const [adminTarget, setAdminTarget] = useState('');

  const handleChangeWelcome = (welcome) => {
    setWelcome(welcome);
  }

  const handleChangeAdminTarget = (target) => {
    setAdminTarget(target);
  }

  const handleChangeUser = (user) => {
    if(user === 'guest') {
      setUser(user);
      return;
    }
    updateUser(user);
  }

  const updateUser = async (user)=>{
    await axios.post('http://localhost:8000/updateUser', user)
      .then((res)=>{
        setUser(res.data[0]);
      })

    
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await axios.get('http://localhost:8000/checkSession');
        if (session.data.success) {
          console.log('Session is valid');
          setUser(session.data.user); 
          handleChangeWelcome("questions");
        } else {
          console.log('No valid session found');
        }
      } catch (err) {
        console.log('Error checking session:', err);
      }
    };
  
    checkSession();
  },[]);

  let page;
  switch(welcome) {
    case "login":
      page = <LoginPage 
        onChangeWelcome={handleChangeWelcome}
        onChangeUser={handleChangeUser}
        onChangeAdminTarget={handleChangeAdminTarget}
        />
      break;
    case "questions":
      page = <FakeStackOverflow
        onChangeWelcome={handleChangeWelcome}
        onChangeUser={handleChangeUser}
        user={user}
        adminTarget={adminTarget}
        onChangeAdminTarget={handleChangeAdminTarget}
      />;
      break;
    default:
  }
  return (
    <section className="fakeso">
      {page}
    </section>
  );
}

export default App;
