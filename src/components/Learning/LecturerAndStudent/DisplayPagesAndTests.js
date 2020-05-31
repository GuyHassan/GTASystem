import React, { useEffect, useState } from 'react';
import MaterialTests from '../Student/MaterialTests';
import { connect } from 'react-redux';
import { getMaterialPages, getMaterialQuestions } from '../../../Redux/actions';
import MaterialPages from '../Student/MaterialPages';
import { Grid, Icon } from 'semantic-ui-react'

const DisplayPagesAndTests = ({ getMaterialPages, getMaterialQuestions, Pages, Questions, match: { params: { type, keyCollection } } }) => {
    const [pages, setPages] = useState([])
    const [questions, setQuestions] = useState([])
    const [currentpPage, setCurrentPage] = useState({ page: { title: '', freeText: '', file: '', streamLink: '' }, index: '' })
    const [currentpQuestion, setCurrentQuestion] = useState({ question: { question: '', ans1: '', ans2: '', an3: '', ans4: '', correctAns: '' }, index: '' })
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
    const onClickFinish = (answer) => {
        //here need to impllement and send the 'answer' attribute to back and update the DB with a new answer !!!!
        if (!currentpQuestion.index + 1 === Questions.length) {
            setCurrentQuestion(prevState => { return { question: Questions[prevState.index + 1], index: prevState.index + 1 } })
        }
        else {
            alert('Well Done, Finish the test !')
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
                        : <MaterialTests question={currentpQuestion.question} numberPage={currentpQuestion.index} onClickFinish={onClickFinish} />
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
    }, [getMaterialPages, getMaterialQuestions])
    useEffect(() => {
        Pages.length
            && setCurrentPage({ page: Pages[0], index: 0 })
    }, [Pages])
    useEffect(() => {
        Questions.length
            && setCurrentQuestion({ question: Questions[0], index: 0 })
    }, [Questions])
    return (
        <div className="displayMaterial">
            <GridExampleInverted />
        </div>
    )
}
const mapStateToProps = (state) => {
    return { Pages: state.materialPages, Questions: state.materialQuestions }
}
export default connect(mapStateToProps, { getMaterialPages, getMaterialQuestions })(DisplayPagesAndTests);