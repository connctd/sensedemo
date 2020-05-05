import React from 'react';
import '../../App.css';

export default class AddThingDescriptionWindow extends React.Component {
    constructor(props) {
        super(props);

        this.addThingDescription = this.addThingDescription.bind(this);

        this.state = { };
    }

    async addThingDescription(f) {
        console.log(f.currentTarget.thingLink.value);

        /*
        var xconfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "value": pos.x.toString() })
        }

        var url = "https://api.connctd.io/api/v1/things/a359ce93-098c-41ec-9ef1-8c2846d258f7/components/tracker/properties/x";

        var respX = await fetch(asInternalURL(xURL, "backend"), xconfig);
        var respY = await fetch(asInternalURL(yURL, "backend"), yconfig);

        if (respX.status !== 204 && respY.status !== 204) {
            console.error("Bad response");
        }
        */

        f.preventDefault();
        this.props.cancelHandler();
    }

    render() {
        var id = this.props.roomInformation.id;
        id = id.substring(0,10)+"...";

        return (
            <div className={this.props.windowVisible ? 'AddThingDescriptionWindow' : 'AddThingDescriptionWindow Hidden'}>
                <h1>Add Thing Description</h1>

                <form className="AddThingDescriptionForm" onSubmit={this.addThingDescription}>
                    <div className="AddThingDescriptionWindowContent">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>ID</td>
                                        <td>{id}</td>
                                    </tr>
                                    <tr>
                                        <td>Room</td>
                                        <td>{this.props.roomInformation.name}</td>
                                    </tr>
                                    <tr>
                                        <td>x</td>
                                        <td>{this.props.roomInformation.x}</td>
                                    </tr>
                                    <tr>
                                        <td>y</td>
                                        <td>{this.props.roomInformation.y}</td>
                                    </tr>
                                    <tr>
                                        <td>TD URL</td>
                                        <td><input type="text" name="thingLink" /></td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>

                    <br />
                    <br />

                    <button className="Button GreenBackground" type="submit">Add</button>&nbsp;
                    <button className="Button YellowBackground" onClick={this.props.cancelHandler} type="button">Cancel</button>&nbsp;
                </form>
            </div>
        )
    }
}