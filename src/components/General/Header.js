import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import JumbotronMain from './JumbotronMain';
import { connect } from 'react-redux';
import { SignIn, SignOut } from '../../Redux/actions';

const Header = ({ SignIn, SignOut, userID, isLoggedIn, isLecturer }) => {

    const currentUser = () => {
        let concatenationElement = [];
        const typeRoute = isLecturer ? '/LecturerView' : '/StudentView';
        if (!isLoggedIn) {
            return <Link to='/Login' style={{ fontWeight: '900' }} className="item">Login</Link>
        }
        if (isLecturer) {
            concatenationElement.push(
                <Link key={0} to='/studentPermissions' className='item'>Student Permission</Link>
            )
        }
        concatenationElement.push(
            <Link key={1} to={typeRoute} className="item">Metarial View</Link>,
            <p key={3} className="item" style={{ color: 'red', fontWeight: '800' }}>{userID}</p>,
            <Link key={2} to='/Login' onClick={logOut} style={{ fontWeight: '900' }} className='item'>Logout</Link>
        )
        return concatenationElement;
    }
    const logOut = () => {
        SignOut();
        localStorage.clear();
    }
    useEffect(() => {
        // let mounted = true;
        const setStorage = () => {
            const currUser = JSON.parse(localStorage.getItem('userCredential'));
            if (currUser)
                SignIn({ userID: currUser.user, isLecturer: currUser.isLecturer });
        }
        setStorage();

        //this return is a cleanup function (componentDidUnMount - AFTER HE FINISH)
        return () => {
            // mounted = false;
        }
    }, [SignIn])

    return (
        <div>
            <div className="ui container ui secondary pointing menu">
                <Link to={{
                    pathname: '/'
                }}
                    className="item">
                    GTA - System
             </Link>
                <div className="right menu">
                    <Link to="/AboutUs" className="item">About Us </Link>
                    {currentUser()}
                </div>
            </div>
            <JumbotronMain />
        </div>
    );
}
const mapStateToProps = (state) => {
    //...state.isSignedIn = {userID : , isLoggedin: true / false, isLecturer: true / false}
    return { ...state.whoIsOnline }
}
export default connect(mapStateToProps, { SignIn, SignOut })(Header);