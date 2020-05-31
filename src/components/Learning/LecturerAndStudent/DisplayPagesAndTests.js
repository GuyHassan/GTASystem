import React, { useEffect, useState } from 'react';
import MaterialTests from '../Student/MaterialTests';
import { connect } from 'react-redux';
import { getMaterialPages, getMaterialQuestions } from '../../../Redux/actions';
import MaterialPages from '../Student/MaterialPages';
import { Grid, Icon } from 'semantic-ui-react'

const DisplayPagesAndTests = ({ getMaterialPages, getMaterialQuestions, Pages, Questions, match: { params: { type, keyCollection } } }) => {
    const [testPage, setTestPage] = useState([
        { freeText: "The study of structure begins with numbers, first the familiar natural numbers and integers and their arithmetical operations, which are recorded in elementary algebra. The deeper properties of these numbers are studied in number theory. The investigation of methods to solve equations leads to the field of abstract algebra, which, among other things, studies rings and fields, structures that generalize the properties possessed by everyday numbers. Long standing questions about compass and straightedge constructions were finally settled by Galois theory. The physically important concept of vectors, generalized to vector spaces, is studied in linear algebra. Themes common to all kinds of algebraic structures are studied in universal algebra.", title: "Algebra", streamLink: "https://www.youtube.com/embed/d0plTCQgsXs", file: 'https://en.wikipedia.org/wiki/Areas_of_mathematics' },
        { freeText: 'blabla', title: "test", file: '', streamLink: "https://www.youtube.com/embed/DhoURcvUZJQ" }])
    const [testQuestion, setTestQuestion] = useState([
        { question: 'What is def in Python Language?', ans1: 'name of list', ans2: "inital a function", ans3: 'speicel variable', ans4: 'object that return null', correctAns: '2' },
        { question: 'function with void need return somthing ?', ans1: 'yes only boolean', ans2: "is not must! but she can", ans3: 'no! he doing job and done', ans4: 'only object will return', correctAns: '3' }
    ])
    const [currentpPage, setCurrentPage] = useState({ page: '', index: '' })
    const [currentpQuestion, setCurrentQuestion] = useState({ question: '', index: '' })
    const onNextArrow = () => {
        setCurrentPage(prevState => {
            return prevState.index + 1 === testPage.length
                ? prevState
                : { page: testPage[prevState.index + 1], index: prevState.index + 1 }
        })
    }
    const onPreviousArrow = () => {
        setCurrentPage(prevState => {
            return prevState.index === 0
                ? prevState
                : { page: testPage[prevState.index - 1], index: prevState.index - 1 }
        })
    }
    const onClickFinish = (answer) => {
        //here need to impllement and send the 'answer' attribute to back and update the DB with a new answer !!!!
        if (!currentpQuestion.index + 1 === testQuestion.length) {
            setCurrentQuestion(prevState => { return { question: testQuestion[prevState.index + 1], index: prevState.index + 1 } })
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
        type === 'MaterialPages'
            ? setCurrentPage({ page: testPage[0], index: 0 })
            : setCurrentQuestion({ question: testQuestion[0], index: 0 })
    }, [Pages, Questions])
    return (
        <GridExampleInverted />
    )
}
const mapStateToProps = (state) => {
    return { Pages: state.materialPages, Questions: state.materialQuestions }
}
export default connect(mapStateToProps, { getMaterialPages, getMaterialQuestions })(DisplayPagesAndTests);