import axios from "axios";

export default function Logout(props) {
    const handleLogout = async () => {
        try{
            await axios.post('http://localhost:8000/logout');
            props.onChangeWelcome('login');
        }
        catch(error){
            console.error('Error during logout: ' , error);
        }
    }
    return (
        <button className="logout" onClick={handleLogout}>Logout</button>
    )
}