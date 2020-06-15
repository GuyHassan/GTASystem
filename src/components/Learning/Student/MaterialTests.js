import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const checkBoxDefault = { ans1: false, ans2: false, ans3: false, ans4: false }
/**This component get a specific Question and rendering inside in the component DisplayPagesAndTests */
const MaterialTests = ({ location, onClickNext, question: { question, ans1, ans2, ans3, ans4, correctAns, hint }, numberPage }) => {
    const [checkBoxState, setCheckBoxState] = useState(checkBoxDefault)

    const onChange = ({ target: { name } }) => {
        setCheckBoxState({ ...checkBoxDefault, [name]: true })
    }
    //check if the answer is correct and send to DB the grade
    const validate = () => {
        let correctAnswer = false
        Object.entries(checkBoxState).forEach((val, index) => { return val[1] === true ? correctAnswer = index + 1 : null })
        if (!correctAnswer)
            alert("Must Enter One Answer !")
        else {
            onClickNext(Number(correctAns) === correctAnswer ? 100 : 0)
        }
    }

    return (
        <div>
            <h1 className="titleComp" style={{ marginBottom: '20px' }}>{`Question Page  ${numberPage + 1}`}</h1>
            <div style={{ textAlign: 'left' }}>
                <h3>{question}</h3>
                <input type="checkbox" name='ans1' checked={checkBoxState.ans1} onChange={onChange} /> {ans1} <br />
                <input type="checkbox" name='ans2' checked={checkBoxState.ans2} onChange={onChange} /> {ans2}<br />
                <input type="checkbox" name='ans3' checked={checkBoxState.ans3} onChange={onChange} /> {ans3}<br />
                <input type="checkbox" name='ans4' checked={checkBoxState.ans4} onChange={onChange} /> {ans4}<br />
            </div>
            <button style={{ margin: '20px' }} className='ui basic button blue' onClick={validate}>Next Question</button>
            {hint !== '.'
                && <Link to=
                    {{ pathname: `/ShowHint/${'Question-' + numberPage + 1}`, hint }} style={{ margin: '20px' }} className='ui basic button green' >
                    Hint
                    </Link>
            }
        </div>
    )
}
export default MaterialTests;