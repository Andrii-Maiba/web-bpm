import axios from 'axios';
import {ENDPOINT_API_BASE} from '../constants';
// import mockedTaskListResponse from './mockedData/mockedTaskListResponse.json';
// import {mockedTaskVariablesResponse} from './mockedData/mockedTaskVariablesResponse';

class Services {
    _baseUrl = ENDPOINT_API_BASE;

    getTasklist = assignee => {
        return new Promise((resolve, reject) => {
            resolve(
                axios.get(this._baseUrl + `engine/default/task?assignee=${assignee}`).then((res) => res)
                // mockedTaskListResponse //for testing
            )
            reject(new Error('Something went wrong'));
        });
    };

    getTasksVariables = tasks => {
        const fetchInfo = async (url, id) => {
            const info = await axios.get(url);
            return {
                id,
                warrantyAmount: info.data.warrantyAmount,
                warrantyApplication: info.data.warrantyApplication,
                customerName: info.data.customerName
            }
        }

        const fetchTaskInfo = async (taskIds) => {
            const requests = taskIds.map(taskId => {
                const url = this._baseUrl + `engine/default/task/${taskId}/variables`;
                return fetchInfo(url, taskId)
                    .then((res) => {
                        return res;
                    })
            })
            return Promise.all(requests);
        }

        let arrayOfTasksIds = [];
        tasks.forEach(task => {
            arrayOfTasksIds.push(task.id);
        });
        return fetchTaskInfo(arrayOfTasksIds).then(res => res);
        // return new Promise((resolve, reject) => { //for testing
        //     resolve(mockedTaskVariablesResponse)
        //     reject(new Error('Something went wrong'))
        // });
    }

    postCompleteTask = (id, warrantyAmount, customerName) => {
        return axios.post(this._baseUrl + `engine/default/task/${id}/complete`, {
            variables:
            // return axios.post(this._baseUrl + `engine/default/task/9d6c3795-aa4d-11ea-8c5f-0242ac110002/complete`, {variables: //for testing an error
                {
                    customerName: {value: customerName},
                    warrantyAmount: {value: warrantyAmount}
                }
        }).catch(error => {
            const err = (new Error('Something went wrong'));
            err.data = error;
            throw err;
        })
    }

    postCreateProcess = ({amount, customerName, fileValue, fileName}, processKey, businessKey) => {
        // console.log("amount, name, fileValue, fileName, key, bus: ", amount, customerName, fileValue, fileName, processKey, businessKey);
        let requestBody;
        if (fileName) {
            requestBody = {
                variables:
                    {
                        customerName: {value: customerName, type: "String"},
                        warrantyAmount: {value: amount, type: "Long"},
                        warrantyApplication: {
                            value: fileValue,
                            type: "file",
                            valueInfo: {
                                filename: fileName,
                                encoding: "Base64"
                            }
                        }
                    },
                businessKey,
                withVariablesInReturn: true
            }
        } else {
            requestBody = {
                variables:
                    {
                        customerName: {value: customerName, type: "String"},
                        warrantyAmount: {value: amount, type: "Long"}
                    },
                businessKey,
                withVariablesInReturn: true
            }
        }
        return axios.post(this._baseUrl + `engine/default/process-definition/key/${processKey}/start`, requestBody).catch(error => {
            const err = (new Error('Something went wrong'));
            err.data = error;
            throw err;
        })
        // return new Promise((resolve, reject) => { //for testing
        //     // resolve(true)
        //     reject(new Error('Something went wrong'))
        // });
    }

    getTaskData = id => {
        return axios.get(this._baseUrl + `engine/default/task?processInstanceId=${id}`).catch(error => {
            const err = (new Error('Something went wrong'));
            err.data = error;
            throw err;
        })
    }

    getTaskFileContent = id => {
        return axios.get(this._baseUrl + `engine/default/task/${id}/variables/warrantyApplication/data`, {
            responseType: 'arraybuffer'
        }).catch(error => {
            const err = (new Error('Something went wrong'));
            err.data = error;
            throw err;
        })
    }
}

export default Services;
