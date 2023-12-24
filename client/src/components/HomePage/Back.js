export default function Back(props) {
    const changeType = () => {
        props.onChangeType('main');
    }
    return (
        <button onClick={changeType}>Back</button>
    )
}