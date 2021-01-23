import React from "react";
import axios from "axios";

export default class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: localStorage.getItem("user"),
            loggedIn : localStorage.getItem("logged"),
            serverName: "",
            serverEmail: ""
        }
    }

    componentDidMount() {
        let link = "http://localhost:8080/user/" + this.state.username;
        axios.get(link)
        .then(res => {
            this.setState({
                serverName: res.data.username,
                serverEmail: res.data.email
            })
            //alert('../static/img/' + this.state.name + '.jpg')
        })
        .catch(err => {
            alert(err);
        });
    }

    render() {
        return (
            <h1>{this.state.serverName + " " + this.state.serverEmail}</h1>
        )
    }
}