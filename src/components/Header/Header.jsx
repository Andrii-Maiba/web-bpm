import React, {Component} from 'react';
import {Menu, Header, Image} from 'semantic-ui-react';
import logo from '../../logo.svg';

export default class HeaderNav extends Component {
    headerInitialState = {};
    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        const {activeItem} = this.headerInitialState
        return (
            <Menu fixed='top' fluid>
                <Menu.Item href="/">
                    <Header as='h3' color='blue'>
                        <Image src={logo} />Web BPM</Header>
                </Menu.Item>
                <Menu.Item
                    name='tasklist'
                    active={activeItem === 'tasklist'}
                    onClick={this.handleItemClick} href="/"
                >Tasklist</Menu.Item>
                <Menu.Item
                    name='startProcess'
                    active={activeItem === 'startProcess'}
                    onClick={this.handleItemClick} href="/process"
                >Start Process</Menu.Item>
            </Menu>
        )
    }
}
