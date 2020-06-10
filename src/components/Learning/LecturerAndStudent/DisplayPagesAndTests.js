import React, { useEffect, useState } from 'react';
import MaterialTests from '../Student/MaterialTests';
import { connect } from 'react-redux';
import { getMaterialPages, getMaterialQuestions } from '../../../Redux/actions';
import MaterialPages from '../Student/MaterialPages';
import { Grid, Icon } from 'semantic-ui-react'
import { server } from '../../../Apis/server';
import history from '../../../history';

const DisplayPagesAndTests = ({ getMaterialPages, getMaterialQuestions, Pages, Questions, match: { params: { className, profession, type, keyCollection, indexTopic } } }) => {
    const [currentpPage, setCurrentPage] = useState({ page: { title: '', freeText: '', file: '', streamLink: '' }, index: '' })
    const [currentpQuestion, setCurrentQuestion] = useState({ question: { question: '', ans1: '', ans2: '', an3: '', ans4: '', correctAns: '' }, index: '' })
    const [finishQuestion, setFinishQuestion] = useState(-1);
    const { user } = JSON.parse(localStorage.getItem("userCredential"))
    const onNextArrow = () => {
        setCurrentPage(prevState => {
            return prevState.index + 1 === Pages.length
                ? prevState
                : { page: Pages[prevState.index + 1], index: prevState.index + 1 }
        })
    }
    const onPreviousArrow = () => {
        setCurrentPage(prevState => {
            return prevState.index === 0
                ? prevState
                : { page: Pages[prevState.index - 1], index: prevState.index - 1 }
        })
    }
    const nextPageQuestion = (answer) => {
        //here need to impllement and send the 'answer' attribute to back and update the DB with a new answer !!!!
        if (!currentpQuestion.index + 1 === Questions.length) {
            setCurrentQuestion(prevState => { return { question: Questions[prevState.index + 1], index: prevState.index + 1 } });
            server.patch(`/setArrayGrade?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopic}&gradeType=${'studyGrades'}&grade=${answer}`);
        }
        else {
            alert('Well Done, Finish the Questions !')
            server.patch(`/setIsFinishQuestion?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopic}`);
            server.patch(`/setArrayGrade?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopic}&gradeType=${'studyGrades'}&grade=${answer}`);
            history.push(`/MaterialView/${profession}/${className}`)
        }
    }

    const GridExampleInverted = () => (
        <Grid columns='equal' divided inverted padded textAlign='center'>
            <Grid.Row >
                <Grid.Column width="2" verticalAlign='middle'>
                    {type === 'MaterialPages' && <Icon name='arrow alternate circle left' onClick={onPreviousArrow} size='big' />}
                </Grid.Column>
                <Grid.Column width="12">
                    {type === 'MaterialPages'
                        ? <MaterialPages page={currentpPage.page} numberPage={currentpPage.index} />
                        : <MaterialTests question={currentpQuestion.question} numberPage={currentpQuestion.index} onClickNext={nextPageQuestion} />
                    }
                </Grid.Column>
                <Grid.Column width="2" verticalAlign='middle'>
                    {type === 'MaterialPages' && <Icon name='arrow alternate circle right' size='big' className="ui floated right" onClick={onNextArrow} />}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
    useEffect(() => {
        type === 'MaterialPages'
            ? getMaterialPages(keyCollection)
            : getMaterialQuestions(keyCollection)
    }, [getMaterialPages, getMaterialQuestions, keyCollection, type])
    useEffect(() => {
        Pages.length
            && setCurrentPage({ page: Pages[0], index: 0 })
    }, [Pages])
    useEffect(() => {
        server.get(`/getArrayGrade?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopic}&gradeType=${'studyGrades'}`).then(res => {
            const lastQuestionIndex = res.data === "OK" ? 0 : res.data.length;
            if (Questions.length) {
                setFinishQuestion(lastQuestionIndex)
                setCurrentQuestion({ question: Questions[lastQuestionIndex], index: lastQuestionIndex })
            }
        })
    }, [Questions, profession, indexTopic, user])

    return (
        <div>
            {Questions.length <= finishQuestion && type === 'MaterialQuestions'
                ? <h1 style={{ textAlign: 'center', color: 'maroon' }}> Finish Questions !! </h1>
                : <GridExampleInverted />
            }
        </div>
    )
}
const mapStateToProps = (state) => {
    return { Pages: state.materialPages, Questions: state.materialQuestions }
}
export default connect(mapStateToProps, { getMaterialPages, getMaterialQuestions })(DisplayPagesAndTests);