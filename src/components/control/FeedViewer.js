import React from 'react';
import '../../App.css';

export default class FeedViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showFeed: false };
    }

    enableFeed() {
        var newState = this.state;
        newState.showFeed = true;
        this.setState(newState);
    }    

    render() {
        if (this.state.showFeed) {
            if (this.props.mode === "img") {
                return (
                    <div className="FeedWindow">
                        <div className="FeedWindowMainElement">
                            <img alt="Stream" height="100%" src={this.props.frameSrc} onClick={this.props.cancelHandler}/>
                        </div>
                        <div className="FeedWindowNavElement">
                            <button className="Button YellowBackground" onClick={this.props.cancelHandler} type="button">Close</button>&nbsp;
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="FeedWindowMainElement">
                            <iframe title="IFrame" width="100%" height={this.props.frameHeight} src={this.props.frameSrc}></iframe>
                        </div>
                        <div className="FeedWindowNavElement">
                            <button className="Button YellowBackground" onClick={this.props.cancelHandler} type="button">Close</button>&nbsp;
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <div className="FeedWindow">
                    <div className="FeedWindowMainElement">
                        <div className="FeedWindowMiddleElement">
                            <button className="Button GreenBackground" onClick={() => this.enableFeed()}>Enable Livefeed</button>
                        </div>
                    </div>
                    <div className="FeedWindowNavElement">
                        <button className="Button YellowBackground" onClick={this.props.cancelHandler} type="button">Close</button>&nbsp;
                    </div>
                </div>
            )
        }
    }
}