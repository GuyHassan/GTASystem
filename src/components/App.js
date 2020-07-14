import React from 'react';
import { Router } from 'react-router-dom';
import Header from './General/Header';
import history from '../history';
import LearningManagement from '../components/Learning/LearningManagement';
import GeneralManagement from './General/GeneralManagement';
import './Style/GeneralStyling.css';
const App = () => {
    return (
        <Router history={history}  >
            <Header />
            <div className='ui container'>
                <LearningManagement />
                <GeneralManagement />
            </div>
        </Router>
    );
}
export default App;