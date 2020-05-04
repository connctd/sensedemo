import React from 'react';
import '../../App.css';

export default class NotificationLog extends React.Component {
    render() {
        return (
            <div className="NotificationView">
                <h1>Notifications</h1>
                {this.props.entries.map(obj => obj)}
            </div>
        )
    }
}