import React, { useState } from 'react';

const checkBoxDefault = { ans1: false, ans2: false, ans3: false, ans4: false }

const MaterialTests = ({ onClickNext, question: { question, ans1, ans2, ans3, ans4, correctAns, hint }, numberPage }) => {
    const [checkBoxState, setCheckBoxState] = useState(checkBoxDefault)
    const onChange = ({ target: { name } }) => {
        setCheckBoxState({ ...checkBoxDefault, [name]: true })
    }
    const validate = () => {
        let correctAnswer = false
        Object.entries(checkBoxState).forEach((val, index) => { return val[1] === true ? correctAnswer = index + 1 : null })

        if (!correctAns)
            alert("Must Enter One Answer !")
        else {
            onClickNext(Number(correctAns) === correctAnswer ? 100 : 0)
        }

    }
    // const renderContent = () => {
    //     return <h1></h1>
    // }
    // const onClickHint = () => {
    //     <Modal
    //         show={true}
    //         title="Hint"
    //         actions={renderAction()}
    //         onDismiss={() => history.push("/LecturerView")}
    //         className="ui container">
    //         {renderContent()}
    //     </Modal>
    // }
    return (
        <div>
            <h1 className="titleComp" style={{ marginBottom: '20px' }}>{`Question Page  ${numberPage}`}</h1>
            <h3>{question}</h3>
            <input type="checkbox" name='ans1' checked={checkBoxState.ans1} onChange={onChange} /> {ans1} <br />
            <input type="checkbox" name='ans2' checked={checkBoxState.ans2} onChange={onChange} /> {ans2}<br />
            <input type="checkbox" name='ans3' checked={checkBoxState.ans3} onChange={onChange} /> {ans3}<br />
            <input type="checkbox" name='ans4' checked={checkBoxState.ans4} onChange={onChange} /> {ans4}<br />
            <button style={{ margin: '20px' }} className='ui primary button' onClick={validate}>Next Question</button>
            {hint && <button style={{ margin: '20px' }} className='ui primary button' /* onClick={onClickHint} */>Hint</button>}
        </div>
    )
}
export default MaterialTests;