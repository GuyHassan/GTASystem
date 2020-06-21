import React, { useEffect, useState } from 'react';
import MaterialTests from '../Student/MaterialTests';
import { connect } from 'react-redux';
import { getMaterialPages, getMaterialQuestions, getMaterialExamQuestions } from '../../../Redux/actions';
import MaterialPages from '../Student/MaterialPages';
import { Grid, Icon } from 'semantic-ui-react'
import { server } from '../../../Apis/server';
import history from '../../../history';
const [pageDetails, questionDetails] = [{ page: { title: '', freeText: '', file: '', streamLink: '' }, index: '' }, { question: { question: '', ans1: '', ans2: '', an3: '', ans4: '', correctAns: '' }, index: '' }]
/**This component shows a window where there will be material study pages.
 * in addition tests and you will be able to switch between the different pages */
const DisplayPagesAndTests = ({ getMaterialPages, getMaterialQuestions, getMaterialExamQuestions, Pages, Questions, match: { params: { className, profession, type, keyCollection, indexTopic } } }) => {
    const [currentpPage, setCurrentPage] = useState(pageDetails)
    const [currentpQuestion, setCurrentQuestion] = useState(questionDetails)
    const [finishQuestion, setFinishQuestion] = useState(0);
    const { user } = JSON.parse(localStorage.getItem("userCredential"))
    // on next page (material page no Question !!)
    const onNextPageArrow = () => {
        setCurrentPage(prevState => {
            return prevState.index + 1 === Pages.length
                ? prevState
                : { page: Pages[prevState.index + 1], index: prevState.index + 1 }
        })
    }
    // on previous page (material page no Question !!)
    const onPreviousPageArrow = () => {
        setCurrentPage(prevState => {
            return prevState.index === 0
                ? prevState
                : { page: Pages[prevState.index - 1], index: prevState.index - 1 }
        })
    }
    // on next page when he in practice mode
    const nextPageQuestion = (answer) => {
        server.patch(`/setArrayGrade?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopic}&gradeType=${'studyGrades'}&grade=${answer}`).then(res => {
            if (!(currentpQuestion.index + 1 === Questions.length))
                setCurrentQuestion(prevState => { return { question: Questions[prevState.index + 1], index: prevState.index + 1 } });
            else {
                alert('Well Done, Finish the Questions !')
                server.patch(`/setIsFinishQuestion?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopic}`)
                server.patch(`/calcFinalGrade?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopic}&keyCollection=${keyCollection}`)
                history.push(`/MaterialView/${profession}/${className}`)
            }
        })

    }
    // on next page when he in final test mode !
    const nextPageFinalTest = (answer) => {
        const indexTopicNeeded = Questions.hasOwnProperty("subTopicsIndex") ? indexTopic + ',' + Questions.subTopicsIndex : indexTopic;
        server.patch(`/setArrayGrade?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopicNeeded}&gradeType=${'testGrades'}&grade=${answer}`).then(res => {
            !(currentpQuestion.index + 1 === Questions.questions.length)
                ? setCurrentQuestion(prevState => { return { question: Questions.questions[prevState.index + 1], index: prevState.index + 1 } })
                : getMaterialExamQuestions({ profession, user, indexTopic })
        })

    }
    // Grid component that show the next and previous arrow side by side with the material
    const GridExampleInverted = () => (
        <Grid columns='equal' divided inverted padded textAlign='center'>
            <Grid.Row >
                <Grid.Column width="2" verticalAlign='middle'>
                    {type === 'MaterialPages' && <Icon name='arrow alternate circle left' onClick={onPreviousPageArrow} size='big' />}
                </Grid.Column>
                <Grid.Column width="12">
                    {type === 'MaterialPages'
                        ? <MaterialPages page={currentpPage.page} numberPage={currentpPage.index} />
                        : <MaterialTests question={currentpQuestion.question} numberPage={currentpQuestion.index} onClickNext={type === 'MaterialQuestions' ? nextPageQuestion : nextPageFinalTest} />
                    }
                </Grid.Column>
                <Grid.Column width="2" verticalAlign='middle'>
                    {type === 'MaterialPages' && <Icon name='arrow alternate circle right' size='big' className="ui floated right" onClick={onNextPageArrow} />}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
    /** after rendering he check if type is materialPages or materialQuestion or materialTestQuestion
     * the call to redux function depending the type  */
    useEffect(() => {
        type === 'MaterialPages'
            ? getMaterialPages(keyCollection)
            : type === 'MaterialQuestions'
                ? getMaterialQuestions(keyCollection)
                : getMaterialExamQuestions({ profession, indexTopic, user })
    }, [getMaterialPages, getMaterialQuestions, getMaterialExamQuestions, profession, indexTopic, keyCollection, type, user])
    // set current page material
    useEffect(() => {
        Pages.length
            && setCurrentPage({ page: Pages[0], index: 0 })
    }, [Pages])
    /**check if type is MaterialQuestions if yes we call from practice material otherwise we call from Final Test.
     * this useEffect put the last current question where student stop on him
      */
    useEffect(() => {
        if (type === 'MaterialQuestions')
            server.get(`/getArrayGrade?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopic}&gradeType=${'studyGrades'}`).then(res => {
                const lastQuestionIndex = res.data === "isEmpty" ? 0 : res.data.length;
                if (Questions.length) {
                    setFinishQuestion(lastQuestionIndex)
                    setCurrentQuestion({ question: Questions[lastQuestionIndex], index: lastQuestionIndex })
                }
            })
        else if (type === 'MaterialTestQuestion') {
            const indexTopicNeeded = Questions.hasOwnProperty("subTopicsIndex") ? indexTopic + ',' + Questions.subTopicsIndex : indexTopic
            if (!Array.isArray(Questions))
                server.get(`/getArrayGrade?studentName=${user}&professionName=${profession}&topicIndexes=${indexTopicNeeded}&gradeType=${'testGrades'}`).then(res => {
                    const lastQuestionIndex = res.data === "isEmpty" ? 0 : res.data.length;
                    if (Questions.questions !== undefined && Questions.questions.length) {
                        setCurrentQuestion({ question: Questions.questions[lastQuestionIndex], index: lastQuestionIndex })
                    }
                })
            else if (Questions[0] === 'Finish') {
                alert('Well Done, The Test Is Finish !');
                history.push(`/MaterialView/${profession}/${className}`)
            }
        }

    }, [Questions, profession, indexTopic, user, type, className])
    return (
        <div>
            {(Questions.length <= finishQuestion && type === 'MaterialQuestions') ||
                (type === 'MaterialTestQuestion' && Questions.length === 0)
                ? <h1 style={{ textAlign: 'center', color: 'maroon' }}> No Questions Exist ! </h1>
                : <GridExampleInverted />
            }
        </div>
    )
}
const mapStateToProps = (state) => {
    return { Pages: state.materialPages, Questions: state.materialQuestions }
}
export default connect(mapStateToProps, { getMaterialPages, getMaterialQuestions, getMaterialExamQuestions })(DisplayPagesAndTests);