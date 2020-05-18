import React from 'react';
import '../../App.css';
import { asInternalURL } from '../../utils/Common.js'

export default class AddThingDescriptionWindow extends React.Component {
    constructor(props) {
        super(props);

        this.addThingDescription = this.addThingDescription.bind(this);

        this.state = { };
    }

    async addThingDescription(f) {
        f.preventDefault();
        
        var newLocation = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "td": f.currentTarget.thingLink.value, "x": this.props.roomInformation.x, "y": this.props.roomInformation.y })
        }

        var url = this.props.roomInformation.id;

        var resp = await fetch(asInternalURL(url, "add"), newLocation);

        if (resp.status !== 201) {
            console.error("Bad response");
            alert("Looks like something has failed. Error code: "+resp.status);
        } else {
            window.location.reload();
        }
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
                                        <td width="40%">ID</td>
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