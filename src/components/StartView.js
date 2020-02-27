import React from 'react';
import './../App.css';
import ModelSelection from './control/ModelSelection.js';

export default class StartView extends React.Component {
    render() {
        return (
            <div className="StartContainer">
                <ModelSelection defaultValue="https://" />
            </div>
        );
    }
}
