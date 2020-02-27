import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ModelView from './components/ModelView.js';
import StartView from './components/StartView.js';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Router>
        <Switch>
            <Route key="app" path="/model/:model" component={ModelView} />
            <Route key="app" path="/" component={StartView} />
        </Switch>
    </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();