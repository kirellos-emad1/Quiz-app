import { nanoid } from "nanoid"
export default function Quiz (props) {
    console.log(props)
    function handelClick (answer){
        if(props.isHeld){
            return
        }
        props.handelAnswerClick(props.id, answer)
    }
     const answerElement = props.answers&&props.answers.map(answer=>{
        let id = null
        if(props.isHeld){
            if(props.correct === answer){
                id='correct'
            }else if(props.isSelected === answer){
                id="in-correct"
            }else{
                id= 'not-selected'
            }
        }
         return(
             <button key={nanoid()}  id={id} className={answer === props.isSelected? 'answer selected' : 'answer'} onClick={()=>handelClick(answer)}>{answer}</button>
         )
     })
    return (
        <div className="question--continer">
            <p className=" question--title">{props.question}</p>  
            {answerElement}
            <hr/>
        </div>
    )
}
