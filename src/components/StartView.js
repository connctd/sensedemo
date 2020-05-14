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
                    <button className="StartKnownModelsButton" value="https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite" onClick={this.selectModel}>Sense demo site v1 (FH Do)</button><br />
                    <button className="StartKnownModelsButton" value="https://api.connctd.io/api/betav1/wot/locations/b55d0183-4234-4b61-8c56-efc2da63f1a1?resolve=true" onClick={this.selectModel}>Sense demo site v1 (connctd)</button>
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
