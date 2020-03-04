import React from 'react';
import '../../App.css';

export default class ModelEditor extends React.Component {
    constructor(props) {
        super(props);

        this.updateModel = this.updateModel.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = { textareaValue: "" };
    }

    updateModel(event) {
        event.preventDefault();
        this.props.cancelHandler();
        this.props.modelChangeHandler(this.state.textareaValue);
    }

    onChange(event) {
        this.setState({
            textareaValue: event.target.value
        })
    }

    render() {
        return (
            <div className="EditModelContainer">
                <h1>Edit Model</h1>
                
                <form className="EditModelForm" onSubmit={this.updateModel}>
                    <textarea className="EditModelInputField" type="text" name="updatedModel" onChange={this.onChange} defaultValue={this.props.model != null ? JSON.stringify(this.props.model, null, 4) : ""}></textarea>
                    <br />
                    <button className="Button GreenBackground" type="submit">Update</button>&nbsp;
                    <button className="Button YellowBackground" onClick={this.props.cancelHandler} type="button">Cancel</button>&nbsp;
                </form>
            </div>
        )
    }
}