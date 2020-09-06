import React, { Fragment } from 'react';
import { Nav } from 'react-bootstrap';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import routes from './conf/routes';

function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);

    // We need this to reset the max age of our userId
    if (cookies && cookies.userId) {
        setCookie('userId', cookies.userId, {
            path: '/',
            maxAge: process.env.REACT_APP_ENV_COOKIES_MAX_AGE
        });
    }

    // Checks if the user is logged in
    function isLoggedIn() {
        return cookies.userId == 'undefined' || !cookies.userId ? false : true;
    }

    return (
        <BrowserRouter>
            <Nav defaultActiveKey="/">
                {isLoggedIn() ?
                    <Fragment>
                        <Nav.Item as="li">
                            <Nav.Link href="/tweet">Tweet</Nav.Link>               
                        </Nav.Item>

                        <Nav.Item as="li">
                            <Nav.Link onClick={() => {
                                removeCookie('userId');
                            }}>Logout</Nav.Link>               
                        </Nav.Item>  
                    </Fragment>
                : 
                    <Nav.Item as="li">
                        <Nav.Link href="/login">Login</Nav.Link>               
                    </Nav.Item>
                }               
            </Nav> 
            <Fragment>
                {routes.map( ({ path, component, name}) => {
                    return <Route exact path={path} key={name} component={component} />
                })}
            </Fragment>
        </BrowserRouter>
    );
}

export default App;
