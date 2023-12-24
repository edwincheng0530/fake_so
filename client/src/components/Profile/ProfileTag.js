import TagBody from '../TagBody';
export default function ProfileTag(props) {
    return (
        <TagBody
            type={'profile'}
            user={props.user}
            dataQuestions={props.dataQuestions}
            tags={props.tags}
            onChangeDataQuestions={props.onChangeDataQuestions}
            onUpdateTags={props.onUpdateTags}
            onCurrentPageChange={props.onCurrentPageChange}
            onChangeTabs={props.onChangeTabs}
            onChangeSort={props.onChangeSort}
            onChangeQuestionsDisplayed={props.onChangeQuestionsDisplayed}
        />
    )
}