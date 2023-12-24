import Delete from './Profile/Delete';

export default function MainQuestion(props){
    if(props.type === 'main') {
      return (
          <div className= "question_outer_div">
              <LeftQuestionDiv question={props.question}/>
              <MidQuestionDiv 
                type={props.type}
                question={props.question} 
                onQuestion = {props.onQuestion} 
                tags={props.tags}
                onViewChange={props.onViewChange}
              />
              <RightQuestionDiv question={props.question}/>
          </div>
      )
    } else if (props.type === 'profile_question'){
      return (
        <div className= "question_outer_div">
              <LeftQuestionDiv question={props.question}/>
              <MidQuestionDiv 
                type={props.type}
                question={props.question} 
                onQuestion = {props.onQuestion}
                tags={props.tags}
              />
              <Delete
                question={props.question}
                onChangeDataQuestions={props.onChangeDataQuestions}
                type={'question'}
              />
          </div>
      )
    } else if (props.type === 'profile_answer') {
      return (
          <div className= "question_outer_div">
              <LeftQuestionDiv question={props.question}/>
              <MidQuestionDiv 
                type={props.type}
                question={props.question} 
                onQuestion = {props.onQuestion} 
                tags={props.tags}
              />
              <RightQuestionDiv question={props.question}/>
          </div>
      )
    }
} 

function LeftQuestionDiv(props) {
    return (
        <div className="left_question_div">
            <p className="num_answer"> {props.question.answers.length} answers</p>
            <p className="num_vote"> {props.question.upvote} upvotes</p>
            <p className="num_view"> {props.question.views} views</p>
        </div>
    );
}

function MidQuestionDiv(props) {
  let tags = [];
  for(let i = 0; i < props.question.tags.length; i++) {
    tags.push(<div key={props.question.tags[i]._id} className="question_tag">{props.question.tags[i].name}</div>)
  }

  // RETURNS A QUESTION DISPLAY FOR HOME PAGE
  if(props.type === 'main') {
    const handleClick = () => {
      props.onQuestion(props.question, 'answer_page');
      props.onViewChange(props.question);
    }
  
    return (
        <div className="mid_question_div">
            <div className="question_title" id="q2" onClick={() => handleClick()}>{props.question.title}</div>
            <div className = "home_page_summary">{props.question.summary}</div>
            <div className="question_tags_div">
              {tags}
            </div>
        </div>
    );
  // RETURNS A QUESTION DISPLAY FOR PROFILE PAGE
  } else if (props.type === 'profile_question'){
    const handleClick = () => {
      props.onQuestion(props.question, 'profile_question_form');
    }
    
    return(
        <div className="mid_question_div">
            <div className="question_title" id="q2" onClick={() => handleClick()}>{props.question.title}</div>
            <div className = "home_page_summary">{props.question.summary}</div>
            <div className="question_tags_div">
              {tags}
            </div>
        </div>
    );
  // RETURNS QUESTION DISPLAY FOR ANSWER PAGE
  } else if (props.type === 'profile_answer') {
    const handleClick = () => {
      props.onQuestion(props.question, 'profile_answer_page')
    }
    return (
        <div className="mid_question_div">
            <div className="question_title" id="q2" onClick={() => handleClick()}>{props.question.title}</div>
            <div className = "home_page_summary">{props.question.summary}</div>
            <div className="question_tags_div">
              {tags}
            </div>
        </div>
    )
  }
    
}

function RightQuestionDiv(props) {
    return (
        <div className="right_question_div">
            <span className="author">{props.question.asked_by.username} </span>
            <span className="date">{calculate_date(props.question.ask_date_time, new Date())}</span>
        </div>
    );
}

export function calculate_date(post_time, current_time){
    post_time = new Date(post_time);
    if(!current_time){
      current_time = new Date();
    }
    let time_diff_milli = current_time - post_time;
    let time_diff_hrs = time_diff_milli / (1000*60*60);
    let time_diff_min;
    let time_diff_sec;
    if (time_diff_hrs < 24){
      time_diff_sec = time_diff_milli / 1000;
      time_diff_min = time_diff_sec / 60;
      if(time_diff_min < 1){
        if(Math.floor(time_diff_sec) === 1){
          return "asked " + Math.floor(time_diff_sec) + " second ago";
        }
        else
          return "asked " + Math.floor(time_diff_sec) + " seconds ago";
      }
      else if(time_diff_hrs < 1){
        if(Math.floor(time_diff_min) === 1)
          return "asked " + Math.floor(time_diff_min) + " minute ago";
        else
          return "asked " + Math.floor(time_diff_min) + " minutes ago";
      }
      else 
        if(Math.floor(time_diff_hrs) === 1)
          return "asked " + Math.floor(time_diff_hrs) + " hour ago";
        else
          return "asked " + Math.floor(time_diff_hrs) + " hours ago";
    }
    else if(time_diff_hrs >= 8760){
      let hrs = post_time.getHours();
      let min = post_time.getMinutes();
      let time = `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      return "asked " + convert_month(post_time.getMonth()) + " " + post_time.getDate() + ", " + (post_time.getYear()+1900) + " at " + time;
    }
    else{
      let hrs = post_time.getHours();
      let min = post_time.getMinutes();
      let time = `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      return "asked " + convert_month(post_time.getMonth()) + " " + post_time.getDate() +  " at " + time;
    }

}
  
export function convert_month(month){
    switch(month){
      case 0: return "Jan";
      case 1: return "Feb";
      case 2: return "Mar";
      case 3: return "Apr";
      case 4: return "May";
      case 5: return "June";
      case 6: return "July";
      case 7: return "Aug";
      case 8: return "Sept";
      case 9: return "Oct";
      case 10: return "Nov";
      case 11: return "Dec";
      default:
        return "";
    }
} 