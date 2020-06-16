import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Button, Header, Message, Modal} from 'semantic-ui-react';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import {postCompleteTask, clearErrorMessage, closeTask} from '../../actions/taskCompleteAction';

class ModalCompleteContainer extends Component {
    state = {modalOpen: false}

    shouldComponentUpdate(nextProps) {
        if (nextProps.isComplete) {
            this.setState({modalOpen: false});
            this.props.closeTask();
            return false;
        }
        return true;
    }

    handleOpen = () => this.setState({modalOpen: true})
    handleClose = () => {
        this.setState({modalOpen: false});
        this.props.closeTask();
    }

    render() {
        const {customerName, warrantyAmount, id, completeTask, completeTaskError, clearErrorMessage} = this.props;
        if (completeTaskError) {
            setTimeout(() => clearErrorMessage(), 3000);
        }
        return (
            <Modal trigger={<Button color="blue" onClick={this.handleOpen}>Launch</Button>}
                   open={this.state.modalOpen}
                   onClose={this.handleClose} closeIcon>
                <Header color="blue" icon='check circle outline' content='Complete Task'/>
                <Modal.Content>
                    <div className="flexStart">
                        <Header as='h4' content='Customer Name:'/>
                        <p className="modalText">{customerName}</p>
                    </div>
                    <div className="flexStart">
                        <Header as='h4' content='Amount:'/>
                        <p className="modalText">{warrantyAmount}</p>
                    </div>
                    {completeTaskError && <Message negative>
                        <Message.Header>An error occurred</Message.Header>
                        <p>{completeTaskError}</p>
                    </Message>}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='blue'
                            onClick={() => completeTask(id, warrantyAmount, customerName)}>Complete</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = ({taskComplete: {isComplete, completeTaskError}}) => {
    return {
        isComplete,
        completeTaskError
    };
};

const mapDispatchToProps = (dispatch, {services}) => {
    return {
        completeTask: (id, warrantyAmount, customerName) => postCompleteTask(services, dispatch)(id, warrantyAmount, customerName),
        clearErrorMessage: () => dispatch(clearErrorMessage()),
        closeTask: () => dispatch(closeTask())
    };
};


export default compose(withServices(), connect(mapStateToProps, mapDispatchToProps))(ModalCompleteContainer);
