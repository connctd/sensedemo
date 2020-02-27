import React from 'react';
import '../../App.css';

export default class ModelSelection extends React.Component {
    constructor(props) {
        super(props);

        this.state = { inputValue: this.props.defaultValue };

        this.loadLocationModel = this.loadLocationModel.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
    }

    loadLocationModel(event) {
        let encoded = Buffer.from(this.state.inputValue).toString('base64');
        window.open("/model/"+encodeURIComponent(encoded), "_self")
        event.preventDefault();
    }

    updateInputValue(event) {
        this.setState({
            inputValue: event.target.value
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.loadLocationModel}>
                    <input className="ModelInput" type="text" name="url" onChange={this.updateInputValue} value={this.state.inputValue}></input>
                    <br />
                    <button className="ModelButton"  type="submit">Load</button>
                </form>
            </div>
        )
    }
}