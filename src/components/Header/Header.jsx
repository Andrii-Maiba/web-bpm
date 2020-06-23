import React, {Component} from 'react';
import {Menu, Header, Image} from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import logo from '../../logo.svg';

class HeaderNav extends Component {
    state = {activeItem: 'makerTasklist'};
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const {activeItem} = this.state;
        return (
            <Menu fixed='top' fluid>
                <Menu.Item href="/">
                    <Header as='h3' color='blue'>
                        <Image src={logo}/>Web BPM</Header>
                </Menu.Item>
                <Menu.Item href="/"
                    name='makerTasklist'
                    active={activeItem === 'makerTasklist'}
                    onClick={this.handleItemClick}>
                    <Header as='h4'>Maker Tasklist</Header>
                </Menu.Item>
                <Menu.Item as={NavLink} to="/checker"
                    name='checkerTasklist'
                    active={activeItem === 'checkerTasklist'}
                    onClick={this.handleItemClick}>
                    <Header as='h4'>Checker Tasklist</Header>
                </Menu.Item>
                <Menu.Item as={NavLink} to="/archive"
                    name='archive'
                    active={activeItem === 'archive'}
                    onClick={this.handleItemClick}>
                    <Header as='h4'>Archive</Header>
                </Menu.Item>
            </Menu>
        )
    }
}

export default HeaderNav;
