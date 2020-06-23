import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Button, Header, Message, Modal, Loader} from 'semantic-ui-react';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import {postCompleteTask, clearErrorMessage, closeTask, getTaskAppData} from '../../actions/taskCompleteAction';

class ModalCompleteContainer extends Component {
    state = {modalOpen: false};
    // fileLink = React.createRef();

    shouldComponentUpdate(nextProps) {
        if (nextProps.isComplete) {
            this.setState({modalOpen: false});
            this.props.closeTask();
            return false;
        }
        return true;
    }
    // componentWillUnmount() {
    //     let windowUrl = window.URL || window.webkitURL;
    //         windowUrl.revokeObjectURL(this.props.taskAppData);
    // }

    handleOpen = () => {
        this.setState({modalOpen: true});
    }
    handleClose = () => {
        this.setState({modalOpen: false});
        this.props.closeTask();
    }
    handleDownloadFile = e => {
        e.preventDefault();
        this.props.getTaskAppData(this.props.id, this.props.warrantyApp.valueInfo.filename);
        // e.target.click();
        // const file = new File(this.props.taskAppData);
        // download(file, this.props.warrantyApp.valueInfo.filename);
    }

    render() {
        const {customerName, warrantyAmount, id, completeTask, warrantyApp, loading, completeTaskError, clearErrorMessage} = this.props;
        if (completeTaskError) {
            setTimeout(() => clearErrorMessage(), 4000);
        }
        return (
            <Modal trigger={<Button color="blue" onClick={this.handleOpen}>Open</Button>}
                   open={this.state.modalOpen}
                   onClose={this.handleClose} closeIcon>
                <Header color="blue" icon='check circle outline' content='Complete Task'/>
                <Modal.Content>
                    {loading && <Loader active inverted />}
                    {warrantyApp && <a className="complete__file-link" download={warrantyApp.valueInfo.filename} href={warrantyApp.valueInfo.filename} onClick={this.handleDownloadFile}>{warrantyApp.valueInfo.filename}</a>}
                    <div className="flexStart">
                        <Header as='h4' content='Customer Name:'/>
                        <p className="modalText">{customerName.value}</p>
                    </div>
                    <div className="flexStart">
                        <Header as='h4' content='Amount:'/>
                        <p className="modalText">{warrantyAmount.value}</p>
                    </div>
                    {completeTaskError && <Message negative>
                        <Message.Header>An error occurred</Message.Header>
                        <p>{completeTaskError}</p>
                    </Message>}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='blue'
                            onClick={() => completeTask(id, warrantyAmount.value, customerName.value)}>Complete</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = ({taskComplete: {loading, isComplete, completeTaskError}}) => {
    return {
        loading,
        // taskAppData,
        isComplete,
        completeTaskError
    };
};

const mapDispatchToProps = (dispatch, {services}) => {
    return {
        completeTask: (id, warrantyAmount, customerName) => postCompleteTask(services, dispatch)(id, warrantyAmount, customerName),
        getTaskAppData: (id, appName) => getTaskAppData(services, dispatch)(id, appName),
        clearErrorMessage: () => dispatch(clearErrorMessage()),
        closeTask: () => dispatch(closeTask())
    };
};


export default compose(withServices(), connect(mapStateToProps, mapDispatchToProps))(ModalCompleteContainer);
