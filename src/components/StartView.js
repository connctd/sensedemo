import React from 'react';
import './../App.css';
import ModelSelection from './control/ModelSelection.js';

export default class StartView extends React.Component {
    constructor(props) {
        super(props);

        this.modelSelectionRef = React.createRef();
        this.selectModel = this.selectModel.bind(this);
    }

    selectModel(e) {
        this.modelSelectionRef.current.updateInputValue(e);
    }

    render() {
        return (
            <div className="StartContainer">
                <img src="/images/logo6.png" height="60" alt="logo" />
                <ModelSelection ref={this.modelSelectionRef} defaultValue="https://" />
                <br/>
                <br />
                <h1>Known models</h1>
                <div>
                    <button className="StartKnownModelsButton" value="https://193.25.30.222:2443/ict-gw/v1/sites/senseDemoSite" onClick={this.selectModel}>Sense demo site v1 (FH Do)</button><br />
                    <button className="StartKnownModelsButton" value="https://api.connctd.io/api/betav1/wot/locations/8cf59011-4571-45b1-802b-bf5b866b8f89?resolve=true" onClick={this.selectModel}>Sense demo site v1 (connctd)</button>
                </div>
                <div className="StartFooter">
                    <img src="/images/logo1.png" height="30" alt="logo"/>
                    <img src="/images/logo2.png" height="30" alt="logo" />
                    <img src="/images/logo3.png" height="30" alt="logo" />
                    <img src="/images/logo4.png" height="30" alt="logo" />
                    <img src="/images/logo5.png" height="30" alt="logo" />
                </div>
            </div>
        );
    }
}
