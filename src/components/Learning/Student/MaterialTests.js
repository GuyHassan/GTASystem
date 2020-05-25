import React, { useState } from 'react';

const checkBoxDefault = { ans1: false, ans2: false, ans3: false, ans4: false }

const MaterialTests = ({ onClickFinish, question: { question, ans1, ans2, ans3, ans4, correctAns }, numberPage }) => {
    const [checkBoxState, setCheckBoxState] = useState(checkBoxDefault)
    const onChange = ({ target: { name } }) => {
        setCheckBoxState({ ...checkBoxDefault, [name]: true })
    }
    const validate = () => {
        let correctAns = false
        Object.entries(checkBoxState).forEach(val => { return val[1] === true ? correctAns = val : null })

        if (!correctAns)
            alert("Must Enter One Answer !")
        else {
            onClickFinish({ ...correctAns, index: numberPage })
        }

    }
    return (
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ textDecoration: 'underline', marginBottom: '20px' }}>{`Question Page  ${numberPage}`}</h1>
            <h3>{question}</h3>
            <input type="checkbox" name='ans1' checked={checkBoxState.ans1} onChange={onChange} /> {ans1} <br />
            <input type="checkbox" name='ans2' checked={checkBoxState.ans2} onChange={onChange} /> {ans2}<br />
            <input type="checkbox" name='ans3' checked={checkBoxState.ans3} onChange={onChange} /> {ans3}<br />
            <input type="checkbox" name='ans4' checked={checkBoxState.ans4} onChange={onChange} /> {ans4}<br />
            <button style={{ margin: '20px' }} className='ui primary button' onClick={validate}>Next Question</button>
        </div>
    )
}
export default MaterialTests;