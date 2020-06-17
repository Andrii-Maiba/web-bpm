import {
    CREATE_PROCESS_REQUEST,
    CREATE_PROCESS_FAILURE,
    CREATE_PROCESS_SUCCESS,
    CLEAR_CREATE_ERROR_MESSAGE,
    CLOSE_CREATE_MODAL
} from '../constants/createProcess';

const createProcessFailure = error => {
    return {
        type: CREATE_PROCESS_FAILURE,
        payload: error.message,
    };
};

const closeCreateModal = () => {
    return {
        type: CLOSE_CREATE_MODAL
    };
}

const clearCreateErrorMessage = () => {
    return {
        type: CLEAR_CREATE_ERROR_MESSAGE
    };
}

const createProcess = (service, dispatch) => (data, processKey, businessKey) => {
    dispatch({type: CREATE_PROCESS_REQUEST});
    service.postCreateProcess(data, processKey, businessKey).then((res) => {
        dispatch({type: CREATE_PROCESS_SUCCESS});
    }).catch(err => {
            dispatch(createProcessFailure(err.data));
        });
};

export {createProcess, clearCreateErrorMessage, closeCreateModal};
