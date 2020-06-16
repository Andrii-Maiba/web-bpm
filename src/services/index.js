import axios from 'axios';
import {ENDPOINT_API_BASE} from '../constants';
// import mockedTaskListResponse from './mockedData/mockedTaskListResponse.json';
// import {mockedTaskVariablesResponse} from './mockedData/mockedTaskVariablesResponse';

class Services {
    _baseUrl = ENDPOINT_API_BASE;

    getTasklist = (assignee = "demo", processDefinitionId = "warranty_approval_test:1:e92a1672-aa4b-11ea-8c5f-0242ac110002") => {
        return new Promise((resolve, reject) => {
            resolve(
                axios.get(this._baseUrl + `engine/default/task?assignee=${assignee}&processDefinitionId=${processDefinitionId}`).then((res) => res)
                // mockedTaskListResponse
            )
            reject(new Error('Something went wrong'));
        });
    };

    getTasksVariables = (tasks) => {
        console.log("response", tasks);
        const fetchInfo = async (url, id) => {
            console.log(`Fetching ${url}`);
            const info = await axios.get(url);
            return {
                id,
                warrantyAmount: info.data.warrantyAmount,
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
        // return new Promise((resolve, reject) => {
        //     resolve(mockedTaskVariablesResponse)
        //     resolve(fetchTaskInfo(arrayOfTasksIds).then(res => res))//
        //     reject(new Error('Something went wrong'))
        // });
    }

    postCompleteTask = (id, warrantyAmount, customerName) => {
        console.log("id, warrantyAmount, customerName", id, warrantyAmount, customerName);
        return axios.post(this._baseUrl + `engine/default/task/${id}/complete`, {variables:
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

    postCreateProcess = ( {amount, customerName}, processKey, businessKey) => {
        console.log("amount, name, key, busi: ", amount, customerName, processKey, businessKey);
        return axios.post(this._baseUrl + `engine/default/process-definition/key/${processKey}/start`, {
            variables:
                {
                    customerName: {value: customerName, type: "String"},
                    warrantyAmount: {value: amount, type: "Long"}
                },
            businessKey : businessKey
        }).catch(error => {
            const err = (new Error('Something went wrong'));
            err.data = error;
            throw err;
        })
        // return new Promise((resolve, reject) => {
        //     // resolve(true)
        //     reject(new Error('Something went wrong'))
        // });
    }
}

export default Services;
