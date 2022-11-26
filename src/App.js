import React , {useState, useEffect}from 'react';
import './App.css';
import Quiz from './components/Quiz'
import {nanoid} from 'nanoid'


function App() {
  const [allQuestions, setAllQuestions ] = useState([])
  const [isStarted, setIsStarted] = useState(false)
  const [count, setCount] = useState(0)
  const [held, setHeld] = useState(false)
  const [correct, setCorrect] = useState(0)

  const messUp = (arr)=>{ 
    arr.sort(()=>Math.random()-0.5)
    return arr
  }

  useEffect(()=>{
    async function getQuiz() {
      const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      const data = await res.json()
      let q = []
      data.results.forEach(que => {
        q.push({
          id: nanoid(),
          answers: messUp([...que.incorrect_answers, que.correct_answer]),
          question:que.question,
          correct: que.correct_answer,
          selected: null,
          held: false,
        })
      });
      setAllQuestions(q)
  }
    getQuiz()
  }, [count])

  
  function startQuiz() {
    setIsStarted(true)
  }

  function handelHeld(){
   let selected = true
   allQuestions.forEach(question=>{
    if(question.selected === null){
      selected = false
      return
    }
   })
   if (!selected) {
    return
   }
   setAllQuestions(prevQuestion=>prevQuestion.map(question=>{
    return {...question, held: true}
   }))
   setHeld(true)
   let correct = 0
   allQuestions.forEach(question=>{
    if (question.correct === question.selected) {
      correct +=1
    }
   })
   setCorrect(correct)
  }
  function handelAnswerClick(id, answer){
    setAllQuestions(prevQuestion=>prevQuestion.map(question=>{
      return question.id === id ? {...question, selected: answer}: question
    }))
  }

  function handlePlayAgain (){
    setCount(prevCount=> prevCount + 1)
    setHeld(false)
  }
  
 const questionElement = allQuestions && allQuestions.map(question=> {
  return(
    <Quiz
    question={question.question}
    key={question.id}
    id={question.id}
    isSelected={question.selected}
    correct={question.correct}
    isHeld={question.held}
    answers={question.answers}
    handelAnswerClick={handelAnswerClick}
    
    />
  )
 })

  return (
    <main>
      { !isStarted ?
      <> 
        <h2 className='header--title'>Quizzical</h2>
        <p className='main--descrip'>Some description if needed</p>
        <button className='start--btn' onClick={startQuiz}>Start quiz</button>
      </> :
      <>  
      {questionElement} 
      {held && <span className='score'>You scored {correct}/5 correct answers</span>}
          <button className='check' onClick={held ? handlePlayAgain : handelHeld}>{held ? 'Play Again' : 'Check Answer'}</button>
      </>

        
      }
    </main>
  );
}

export default App;
