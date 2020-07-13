import React, {Component} from 'react';
import {Menu, Header, Image, Button, Icon} from 'semantic-ui-react';
import {NavLink} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import logo from '../../logo.svg';
import {getUsersLocaleData} from '../../actions/usersLocaleDataAction';

class HeaderNavContainer extends Component {
    state = {isStackedMenu: true}

    handleMenuStackedIconClick = e => {
        e.preventDefault();
        const isStacked = !this.state.isStackedMenu;
        this.setState({isStackedMenu: isStacked});
    }

    render() {
        return (
            <Menu stackable fixed='top' fluid>
                <Menu.Item href="/" className="item menu__item">
                    <Header as='h3' className="menu__header" color='blue'><Image src={logo}/>Web BPM</Header>
                    <div className='menu__content-stacked'>
                        <Button.Group className='menu__buttons-lang-stacked'>
                            {this.props.locale === "uk" ?
                                <Button attached='left' active compact basic color="blue"
                                        onClick={() => this.props.handleLangBtnClick("uk")}>UA</Button> :
                                <Button attached='left' compact basic color="blue"
                                        onClick={() => this.props.handleLangBtnClick("uk")}>UA</Button>}
                            {this.props.locale === "en" ?
                                <Button attached='right' active compact basic color="blue"
                                        onClick={() => this.props.handleLangBtnClick("en")}>EN</Button> :
                                <Button attached='right' compact basic color="blue"
                                        onClick={() => this.props.handleLangBtnClick("en")}>EN</Button>}
                        </Button.Group>
                        {this.state.isStackedMenu ? <Icon color='blue' size='large' name='bars'
                                                          onClick={e => this.handleMenuStackedIconClick(e)}/> :
                            <Icon color='blue' size='large' name='close'
                                  onClick={e => this.handleMenuStackedIconClick(e)}/>}
                    </div>
                </Menu.Item>
                {this.state.isStackedMenu ? <Menu.Item exact as={NavLink} to="/"
                           className="item menu__item-stackable"
                           activeClassName="active">
                    <Header as='h4'>
                        <FormattedMessage id="header.maker-tasklist-link" defaultMessage="Задачі Автора"/>
                    </Header>
                </Menu.Item> : <Menu.Item exact as={NavLink} to="/"
                                          className="item"
                                          activeClassName="active">
                    <Header as='h4'>
                        <FormattedMessage id="header.maker-tasklist-link" defaultMessage="Задачі Автора"/>
                    </Header>
                </Menu.Item>}
                {this.state.isStackedMenu ? <Menu.Item as={NavLink} to="/checker"
                           className="item menu__item-stackable"
                           activeClassName="active">
                    <Header as='h4'>
                        <FormattedMessage id="header.checker-tasklist-link" defaultMessage="Задачі Контролера"/>
                    </Header>
                </Menu.Item> : <Menu.Item as={NavLink} to="/checker"
                                          className="item"
                                          activeClassName="active">
                    <Header as='h4'>
                        <FormattedMessage id="header.checker-tasklist-link" defaultMessage="Задачі Контролера"/>
                    </Header>
                </Menu.Item>}
                {this.state.isStackedMenu ? <Menu.Item as={NavLink} to="/archive"
                                                       className="item menu__item-stackable"
                                                       activeClassName="active">
                    <Header as='h4'><FormattedMessage id="header.archive-link" defaultMessage="Архів"/></Header>
                </Menu.Item> : <Menu.Item as={NavLink} to="/archive"
                                          className="item"
                                          activeClassName="active">
                    <Header as='h4'><FormattedMessage id="header.archive-link" defaultMessage="Архів"/></Header>
                </Menu.Item>}
                <Menu.Item position='right' className="item menu__item-lang">
                    <Button.Group floated='right'>
                        {this.props.locale === "uk" ?
                            <Button attached='left' active compact basic color="blue"
                                    onClick={() => this.props.handleLangBtnClick("uk")}>UA</Button> :
                            <Button attached='left' compact basic color="blue"
                                    onClick={() => this.props.handleLangBtnClick("uk")}>UA</Button>}
                        {this.props.locale === "en" ?
                            <Button attached='right' active compact basic color="blue"
                                    onClick={() => this.props.handleLangBtnClick("en")}>EN</Button> :
                            <Button attached='right' compact basic color="blue"
                                    onClick={() => this.props.handleLangBtnClick("en")}>EN</Button>}
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
