import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container} from 'semantic-ui-react';
import TasklistTable from '../../components/TasklistTable/TasklistTable';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import {getTasklistData} from '../../actions/tasklistAction';

class MakerTasklistPageContainer extends Component {
    componentDidMount() {
        this.props.getTasklistData("Maker");
    }

    shouldComponentUpdate(nextProps) {
        return !(this.props.isComplete !== nextProps.isComplete ||
            this.props.completeTaskError !== nextProps.completeTaskError ||
            // this.props.taskAppData !== nextProps.taskAppData ||
            this.props.isCreated !== nextProps.isCreated ||
            this.props.createProcessError !== nextProps.createProcessError);
    }

    render() {
        return (
            <Container>
                <div className='tasklistBody'>
                    <TasklistTable {...this.props}/>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = ({
                             tasklist: {list, loading},
                             taskComplete: {isComplete, completeTaskError},
                             processCreate: {isCreated, createProcessError}
}) => {
    return {
        list,
        loading,
        // taskAppData,
        isComplete,
        completeTaskError,
        isCreated,
        createProcessError
    };
};

const mapDispatchToProps = (dispatch, {services}) => {
    return {
        getTasklistData: assignee => getTasklistData(services, dispatch)(assignee),
    };
};

export default compose(withServices(), connect(mapStateToProps, mapDispatchToProps))(MakerTasklistPageContainer);
