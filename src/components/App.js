import React from 'react';
import { BrowserRouter  } from 'react-router-dom';
import Header from './General/Header';
import history from '../history';
import LearningManagement from '../components/Learning/LearningManagement';
import GeneralManagement from './General/GeneralManagement';
import './Style/GeneralStyling.css';
const App = () => {
    return (
        <BrowserRouter basename={`${process.env.PUBLIC_URL}/`} history={history} >
            <Header />
            <div className='ui container'>
                <LearningManagement />
                <GeneralManagement />
            </div>
        </BrowserRouter>
    );
}
export default App;