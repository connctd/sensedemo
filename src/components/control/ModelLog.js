import React from 'react';
import '../../App.css';

export default class ModelLog extends React.Component {
    render() {
        return (
            <div className="LogView">
                <h1>Log</h1>
                {this.props.entries.map(obj => obj)}
            </div>
        )
    }
}