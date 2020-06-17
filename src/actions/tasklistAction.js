import {GET_TASKLIST_REQUEST, GET_TASKLIST_FAILURE, GET_TASKSDATA_SUCCESS} from '../constants/tasklist';

const getTasksVariablesSuccess = values => {
    return {
        type: GET_TASKSDATA_SUCCESS,
        payload: values,
    };
};

const getTasklistFailure = error => {
    return {
        type: GET_TASKLIST_FAILURE,
        payload: error.message,
    };
};

const getTasklistData = (service, dispatch) => () => {
    dispatch({type: GET_TASKLIST_REQUEST});
    service.getTasklist().then(result => {
        service.getTasksVariables(result.data).then(res => {
            console.log("res in action", res);
            dispatch(getTasksVariablesSuccess({
                tasklistData: result.data,
                tasksVariables: res,
            }));
        })
    }).catch(err => {
            dispatch(getTasklistFailure(err));
        });
};

export { getTasklistData };
