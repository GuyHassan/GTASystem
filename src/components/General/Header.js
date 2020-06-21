import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import JumbotronMain from './JumbotronMain';
import { Nav, Navbar } from "react-bootstrap";
import { ReactComponent as Logo } from "../../assets/img/LogoNavbar.svg";
import { connect } from 'react-redux';
import { SignIn, SignOut } from '../../Redux/actions';
import '../Style/Header.css';
/** This component is a Navbar in the top */
const Header = ({ SignIn, SignOut, userID, isLoggedIn, isLecturer }) => {
    // pass a user id and return uppercase first character
    const prettyUserName = user => { return user.substring(0, 1).toUpperCase() + user.substring(1) }

    const NavbarBootstrap = () => {
        return (
            <Navbar collapseOnSelect expand="lg" className="color-nav" variant="dark" sticky="top">
                <Navbar.Brand as={Link} to="/">
                    < Logo alt="" width="40" height="30" className="d-inline-block align-top mr-2 " />
                    <span id="titleHeader">GTA - System</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className="userTitle">
                            <p>{userID ? prettyUserName(userID) : null}</p>
                        </Nav.Link >
                        <Nav.Link as={Link} to="/AboutUs">About Us</Nav.Link>
                    </Nav>
                    <Nav>
                        {dynamicElements()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
    const dynamicElements = () => {
        let concatenationElement = [];
        const typeRoute = isLecturer ? '/LecturerView' : '/StudentView';
        if (!isLoggedIn) {
            return <Nav.Link as={Link} to='/Login' className="loginLogout"><p>Login</p></Nav.Link>
        }
        concatenationElement.push(
            isLecturer
                ? <Nav.Link as={Link} key={0} to='/LecturerView/StudentPermissions' className='item'>Student Permission</Nav.Link>
                : <Nav.Link as={Link} key={0} to={`${typeRoute}/StudentProgress`} className="item">Student Feedback</Nav.Link>
        )
        concatenationElement.push(
            <Nav.Link as={Link} key={1} to={`${typeRoute}/Profession`} className="item">Profession View</Nav.Link>,
            <Nav.Link as={Link} key={2} to='/Login' onClick={logOut} className='loginLogout'><p>Logout</p></Nav.Link>
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
            <NavbarBootstrap />
            <JumbotronMain />
        </div>
    );
}
const mapStateToProps = (state) => {
    //...state.isSignedIn = {userID : , isLoggedin: true / false, isLecturer: true / false}
    return { ...state.whoIsOnline }
}
export default connect(mapStateToProps, { SignIn, SignOut })(Header);