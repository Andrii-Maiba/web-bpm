import {
    GET_PROCESSES_REQUEST,
    GET_PROCESSES_FAILURE,
    GET_PROCESSES_SUCCESS,
    CLEAR_CHOOSE_PROCESSES_ERROR_MESSAGE,
    CLOSE_CHOOSE_PROCESSES_MODAL
} from '../constants/chooseProcess';

const getProcessesFailure = error => {
    return {
        type: GET_PROCESSES_FAILURE,
        payload: error.message,
    };
};

const getProcessesSuccess = (processes, location) => {
    return {
        type: GET_PROCESSES_SUCCESS,
        payload: { processes, location }
    };
};

const closeChooseProcessModal = () => {
    return {
        type: CLOSE_CHOOSE_PROCESSES_MODAL
    };
}

const clearChooseProcessErrorMessage = () => {
    return {
        type: CLEAR_CHOOSE_PROCESSES_ERROR_MESSAGE
    };
}

const getProcesses = (service, dispatch) => location => {
    dispatch({type: GET_PROCESSES_REQUEST});
    service.getProcessesList().then(res => {
        dispatch(getProcessesSuccess(res.data, location));
    }).catch(err => {
        err.data ? dispatch(getProcessesFailure(err.data)) : dispatch(getProcessesFailure(err));
    });
};

export {getProcesses, clearChooseProcessErrorMessage, closeChooseProcessModal};
