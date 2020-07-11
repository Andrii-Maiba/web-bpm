import React, {Component} from 'react';
import {Menu, Header, Image, Button} from 'semantic-ui-react';
import {NavLink} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {connect} from 'react-redux';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import logo from '../../logo.svg';
import {getUsersLocaleData} from '../../actions/usersLocaleDataAction';

class HeaderNavContainer extends Component {
    render() {
        return (
            <Menu stackable fixed='top' fluid>
                <Menu.Item href="/">
                    <Header as='h3' color='blue'>
                        <Image src={logo}/>Web BPM</Header>
                </Menu.Item>
                <Menu.Item exact as={NavLink} to="/"
                           className="item"
                           activeClassName="active">
                    <Header as='h4'>
                        <FormattedMessage id="header.maker-tasklist-link" defaultMessage="Задачі Автора"/>
                    </Header>
                </Menu.Item>
                <Menu.Item as={NavLink} to="/checker"
                           className="item"
                           activeClassName="active">
                    <Header as='h4'>
                        <FormattedMessage id="header.checker-tasklist-link" defaultMessage="Задачі Контролера"/>
                    </Header>
                </Menu.Item>
                <Menu.Item as={NavLink} to="/archive"
                           className="item"
                           activeClassName="active">
                    <Header as='h4'><FormattedMessage id="header.archive-link" defaultMessage="Архів"/></Header>
                </Menu.Item>
                <Menu.Item position='right' borderless>
                    <Button.Group floated='right'>
                        {this.props.locale === "uk" ?
                            <Button attached='left' active compact basic color="blue" onClick={() => this.props.handleLangBtnClick("uk")}>UA</Button> :
                            <Button attached='left' compact basic color="blue" onClick={() => this.props.handleLangBtnClick("uk")}>UA</Button>}
                        {this.props.locale === "en" ?
                            <Button attached='right' active compact basic color="blue" onClick={() => this.props.handleLangBtnClick("en")}>EN</Button> :
                            <Button attached='right' compact basic color="blue" onClick={() => this.props.handleLangBtnClick("en")}>EN</Button>}
                    </Button.Group>
                </Menu.Item>
            </Menu>
        )
    }
}

const mapStateToProps = ({usersLocaleData: {locale}}) => {
    return {locale};
};

const mapDispatchToProps = (dispatch, {services}) => {
    return {
        handleLangBtnClick: locale => dispatch(getUsersLocaleData(locale))
    };
};

export default compose(withServices(), connect(mapStateToProps, mapDispatchToProps))(HeaderNavContainer);
