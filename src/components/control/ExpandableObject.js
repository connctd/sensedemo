import React from 'react';
import '../../App.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default class ExpandableObject extends React.Component {
    constructor(props) {
        super(props);
        
        var color = "Blue";
        var sign = "i";
        if (this.props.severity === "err") {
            color = "Red";
            sign = "E";
        } else if (this.props.severity === "warn") {
            color = "Yellow";
            sign = "w";
        }

        this.state = { sign: sign, color: color, message: this.props.message, json: this.props.json, exploded: false };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        var newState = this.state;
        newState.exploded = !this.state.exploded;
        this.setState(newState);
    }

    render() {
        return (
            <div className="Log">
                <div className="LogEntry">
                    <svg className={"LogIcon " + this.state.color} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7" cy="9" r="6" />
                        <text
                            x={7}
                            y={12}
                            className="LogIconText">{this.state.sign}
                        </text>
                    </svg>
                    &nbsp; {this.state.message}
                </div>
                <div className={this.state.json == null ? 'LogEntryButton Hidden' : 'LogEntryButton'}>
                    <button
                        className={this.state.exploded ? 'HideButton' : 'ShowButton'} onClick={this.toggle}>
                        {this.state.exploded ? 'hide' : 'show'}
                    </button>&nbsp;
                    <CopyToClipboard className={this.state.copied ? 'CopiedButton' : 'CopyButton'} text={this.state.json}
                        onCopy={() => this.setState({ copied: true })} onMouseOver={() => this.setState({ copied: false })}>
                        <button>copy</button>
                    </CopyToClipboard>
                </div>
                <pre className={this.state.exploded ? 'Code' : 'Code Hidden'}>
                    {this.state.json}
                </pre>
            </div>
        )
    }
}