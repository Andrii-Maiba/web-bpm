import {
    COMPLETE_TASK_REQUEST,
    COMPLETE_TASK_FAILURE,
    COMPLETE_TASK_SUCCESS,
    CLEAR_ERROR_MESSAGE,
    CLOSE_TASK,
    GET_XML_SUCCESS,
} from '../constants/completeTask';

const updateTaskComplete = (state, action) => {
    if (typeof state === 'undefined') {
        return {
            loading: false,
            xmlData: null,
            completeTaskError: null,
            isComplete: false,
        };
    }
    switch (action.type) {
        case COMPLETE_TASK_REQUEST:
            return {...state.taskComplete, loading: true, isComplete: false};
        case COMPLETE_TASK_SUCCESS:
            return {
                loading: false,
                xmlData: null,
                completeTaskError: null,
                isComplete: true,
            };
        case GET_XML_SUCCESS:
            return {
                loading: false,
                xmlData: action.payload,
                completeTaskError: null,
                isComplete: false,
            };
        case COMPLETE_TASK_FAILURE:
            return {
                ...state.taskComplete,
                loading: false,
                completeTaskError: action.payload,
                isComplete: false
            };
        case CLEAR_ERROR_MESSAGE:
            return {
                ...state.taskComplete,
                completeTaskError: null,
                isComplete: false,
            };
        case CLOSE_TASK:
            return {
                loading: false,
                xmlData: null,
                completeTaskError: null,
                isComplete: false
            };
        default:
            return state.taskComplete;
    }
};

export default updateTaskComplete;
