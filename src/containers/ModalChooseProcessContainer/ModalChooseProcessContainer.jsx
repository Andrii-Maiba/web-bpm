import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Button, Menu, Header, Modal, Message, Dimmer, Loader} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {injectIntl} from "react-intl";
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import {
    clearChooseProcessErrorMessage,
    closeChooseProcessModal,
    getProcesses
} from '../../actions/chooseProcessAction';
import {chooseProcessMessages} from './ModalChooseProcessContainerMessages';

class ModalChooseProcessContainer extends Component {
    state = {modalChooseProcessOpen: false}

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevProps.processes !== this.props.processes && prevProps.processes === null) {
    //         this.setState({
    //             modalChooseProcessOpen: true,
    //             processes: this.props.processes
    //         });
    //     }
    // }

    handleChooseProcessModalOpen = () => {
        this.props.getProcesses(this.props.location);
        this.setState({modalChooseProcessOpen: true})
    }

    handleChooseProcessModalClose = () => {
        this.setState({modalChooseProcessOpen: false});
        this.props.closeChooseProcessModal();
    }

    render() {
        const {loading, chooseProcessError, clearChooseProcessErrorMessage, intl} = this.props;
        // console.log("location", this.props.location);
        if (chooseProcessError) {
            setTimeout(() => clearChooseProcessErrorMessage(), 4000);
        }
        return (
            <Modal trigger={<Button color="blue"
                                    onClick={this.handleChooseProcessModalOpen}>{intl.formatMessage(chooseProcessMessages["button-open"])}</Button>}
                   open={this.state.modalChooseProcessOpen}
                   onClose={this.handleChooseProcessModalClose} closeIcon>
                <Header color="blue" icon='add' content={intl.formatMessage(chooseProcessMessages.header)}/>
                <Modal.Content>
                    {loading && <Dimmer active inverted><Loader inverted/></Dimmer>}
                    {this.props.processes !== null && <Menu fluid vertical>
                        {this.props.processes.map(process => <Menu.Item
                            onClick={this.handleChooseProcessModalClose} key={process.key}
                            as={Link} to={`/create-process/${process.key}`}>{process.name}</Menu.Item>)}
                    </Menu>}
                    {chooseProcessError &&
                    <Message error header={intl.formatMessage(chooseProcessMessages["error-header"])}
                             content={chooseProcessError}/>}
                </Modal.Content>
            </Modal>
        )
    }
}

const mapStateToProps = ({processesChoose: {loading, chooseProcessError, processes}}) => {
    return {loading, chooseProcessError, processes};
};

const mapDispatchToProps = (dispatch, {services}) => {
    return {
        getProcesses: location => getProcesses(services, dispatch)(location),
        clearChooseProcessErrorMessage: () => dispatch(clearChooseProcessErrorMessage()),
        closeChooseProcessModal: () => dispatch(closeChooseProcessModal())
    };
};

export default compose(injectIntl, withServices(), connect(mapStateToProps, mapDispatchToProps))(ModalChooseProcessContainer);
