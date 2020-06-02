import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getMaterialQuestions, getMaterialExamQuestions } from '../../../Redux/actions';
import { server } from '../../../Apis/server';
import history from '../../../history';

const details = { question: '', ans1: '', ans2: '', ans3: '', ans4: '', hint: '', correctAns: '' }

const CreateMaterialQuestions = ({ getMaterialQuestions, getMaterialExamQuestions, materialQuestions, match: { params: { keyCollection, profession, className, type } } }) => {
    const [detailsQuestion, setDetailsQuestion] = useState(details);
    const [listQuestions, setListQuestions] = useState([])
    const [counterQuestions, setCounterQuestions] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onChange = ({ target: { value, name } }) => {
        setDetailsQuestion({ ...detailsQuestion, [name]: value });
    }
    const validate = () => {
        if (Object.values(detailsQuestion).some(value => { return value === ''; })) {
            setErrorMessage("Must Enter All Fields");
            return false;
        }
        else if (!(detailsQuestion.correctAns >= 1 && detailsQuestion.correctAns <= 4)) {
            setErrorMessage("Correct Answer Must Be Between 1-4");
            return false;
        }
        return true;
    }
    const onNextPage = () => {
        if (validate()) {
            setCounterQuestions(counterQuestions + 1)
            setListQuestions([...listQuestions, detailsQuestion])
            setDetailsQuestion(details)
            setErrorMessage('')
        }
    }
    const onFinish = () => {
        if (Object.values(detailsQuestion).some(value => { return value !== ''; }))
            setErrorMessage('Must Enter NextPage Before Finish!');

        else if (listQuestions.length) {
            server.post('/addTopicMaterials', { newArr: listQuestions, keyCollection, type }).then(res => {
                alert("Questions Uploaded !");
                history.push(`/MaterialView/${profession}/${className}`);
            })
        }

    }
    useEffect(() => {
        type === 'questions'
            ? getMaterialQuestions(keyCollection)
            : getMaterialExamQuestions(keyCollection);
    }, [getMaterialQuestions, getMaterialExamQuestions, keyCollection])
    useEffect(() => {
        setCounterQuestions(materialQuestions.length)
    }, [materialQuestions])
    return (
        <div>
            <h1 className="titleComp">{`Question Page ${counterQuestions}`}</h1>
            <form className="ui error form">
                <label >Question</label>
                <textarea name="question" value={detailsQuestion.question} onChange={onChange} placeholder="Write a Question?" cols="100" rows="3" />
                <br />
                <label >Answer 1</label>
                <input name="ans1" value={detailsQuestion.ans1} onChange={onChange} type="text" />
                <label >Answer 2</label>
                <input name="ans2" value={detailsQuestion.ans2} onChange={onChange} type="text" />
                <label >Answer 3</label>
                <input name="ans3" value={detailsQuestion.ans3} onChange={onChange} type="text" />
                <label >Answer 4</label>
                <input name="ans4" value={detailsQuestion.ans4} onChange={onChange} type="text" />
                <label >Hint</label>
                <input name="hint" value={detailsQuestion.hint} onChange={onChange} type="text" />
                <label >Correct Answer</label>
                <br />
                <input name="correctAns" value={detailsQuestion.correctAns} onChange={onChange} type="text" style={{ width: '40px' }} />
                <br /><br />
                <div className='ui error message header' style={{ fontSize: '1em', marginBottom: '10px', marginTop: '-15px' }}>
                    {errorMessage}
                </div>

            </form>
            <button onClick={onNextPage} className="ui button primary"> Next Page </button>
            <button onClick={onFinish} className="ui button black"> Finish </button>
            <br /><br />
        </div>
    )
}
const mapStateToProps = (state) => {
    return { materialQuestions: state.materialQuestions }
}
export default connect(mapStateToProps, { getMaterialQuestions, getMaterialExamQuestions })(CreateMaterialQuestions);