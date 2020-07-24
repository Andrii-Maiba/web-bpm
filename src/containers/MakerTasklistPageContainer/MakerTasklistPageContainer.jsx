import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container} from 'semantic-ui-react';
import TasklistTable from '../../components/TasklistTable/TasklistTable';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import {getTasklistData, setCurrentItemsPart} from '../../actions/tasklistAction';

class MakerTasklistPageContainer extends Component {
    componentDidMount() {
        this.props.getTasklistData("Maker");
    }

    shouldComponentUpdate(nextProps) {
        return !(this.props.isComplete !== nextProps.isComplete ||
            this.props.completeTaskError !== nextProps.completeTaskError ||
            this.props.openedTask !== nextProps.openedTask ||
            this.props.xmlData !== nextProps.xmlData ||
            this.props.processes !== nextProps.processes ||
            this.props.chooseProcessError !== nextProps.chooseProcessError);
    }

    render() {
        // console.log("render Maker tasklist");
        return (
            <Container>
                <div className='pageBody'>
                    <TasklistTable {...this.props}/>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = ({
                             tasklist: {list, loading, currentItemsPart, currentPartsPortion},
                             processesChoose: {chooseProcessError, processes},
                             taskComplete: {isComplete, completeTaskError, xmlData, openedTask}
                         }) => {
    return {
        list,
        loading,
        currentItemsPart,
        currentPartsPortion,
        xmlData,
        openedTask,
        isComplete,
        completeTaskError,
        chooseProcessError,
        processes
    };
};

const mapDispatchToProps = (dispatch, {services}) => {
    return {
        getTasklistData: assignee => getTasklistData(services, dispatch)(assignee),
        setCurrentItemsPart: (part, portion) => dispatch(setCurrentItemsPart(part, portion))
    };
};

export default compose(withServices(), connect(mapStateToProps, mapDispatchToProps))(MakerTasklistPageContainer);
