import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {Form, Input, Button, Header, Modal, Message, Dimmer, Loader} from 'semantic-ui-react';
import FileBase64 from 'react-file-base64';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import {
    createProcess,
    clearCreateErrorMessage,
    closeCreateModal,
    getStartEventXml
} from '../../actions/processCreateAction';
import {takeChangedFormValues} from '../../utils/takeChangedDynamicFormValues';

class ModalCreateContainer extends Component {
    state = {modalCreateOpen: false, isCreatingValidationErr: false}
    creatingFormFields

    shouldComponentUpdate(nextProps) {
        if (nextProps.isCreated) {
            this.setState({modalCreateOpen: false, amountValidationErr: null});
            this.props.closeModal();
            return false;
        }
        return true;
    }

    getCreatingFormFieldsData = (formDataFields, formData = []) => {
        [...formDataFields].forEach(el => {
            let fieldData = {};
            fieldData.id = el.attributes.id.value;
            if (el.attributes.type.value === "string") {
                fieldData.value = el.attributes.defaultValue ? el.attributes.defaultValue.value : '';
            }
            if (el.attributes.type.value === "long") {
                fieldData.value = el.attributes.defaultValue ? el.attributes.defaultValue.value : 0;
            }
            if (el.attributes.type.value === "double") {
                fieldData.value = el.attributes.defaultValue ? el.attributes.defaultValue.value : 0.00;
            }
            if (el.attributes.type.value === "file") {
                fieldData.fileName = "";
            }
            if (el.attributes.type.value === "boolean") {
                fieldData.value = el.attributes.defaultValue ? el.attributes.defaultValue.value : false;
            }
            if (el.attributes.type.value === "enum") {
                const enumValues = [...el.attributes.id.ownerElement.children];
                fieldData.values = [];
                enumValues.forEach(el => {
                    fieldData.values.push(el.attributes);
                })
                fieldData.value = el.attributes.defaultValue ? el.attributes.defaultValue.value : fieldData.values[0].id.value;
            }
            fieldData.type = el.attributes.type.value;
            fieldData.label = el.attributes.label.value;
            formData.push(fieldData);
        });
        // console.log("formValues", formData);
        return formData;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.xmlStartEventData !== this.props.xmlStartEventData && prevProps.xmlStartEventData === null) {
            this.creatingFormFields = [...this.props.xmlStartEventData].find(el => el.nodeName === "bpmn:extensionElements").children[0].children;
            // console.log("creatingFormFields", this.creatingFormFields)
            this.setState({
                modalCreateOpen: true,
                data: this.getCreatingFormFieldsData(this.creatingFormFields),
                isCreatingValidationErr: false
            });
        }
    }

    handleCreateModalOpen = () => {
        this.props.getStartEventXml();
        this.setState({modalCreateOpen: true, amountValidationErr: null})
    }

    handleCreateModalClose = () => {
        this.setState({modalCreateOpen: false, amountValidationErr: null});
        this.props.closeModal();
    }

    handleChange = (event, id, type, value) => {
        const [isValidationError, formFields] = takeChangedFormValues(this.state.data, event, id, type, value);
        this.setState({...this.state, isValidationError, data: [...formFields]});
    }

    handleCreatingFileInputChange = (e, id) => {
        const fileValueBase64 = e.base64.split(',')[1];
        const formFieldsData = this.state.data;
        formFieldsData.forEach(field => {
            if (field.id === id) {
                field.value = fileValueBase64;
                field.fileName = e.name;
            }
            return field;
        });
        this.setState({...this.state, data: [...formFieldsData]});
    }

    handleSubmit = event => {
        this.props.createProcess(this.state.data);
        event.preventDefault();
    }

    render() {
        const {loading, createProcessError, clearErrorMessage} = this.props;
        if (createProcessError) {
            setTimeout(() => clearErrorMessage(), 4000);
        }
        // console.log("state.data", this.state.data)
        return (
            <Modal trigger={<Button color="blue" onClick={this.handleCreateModalOpen}>Create</Button>}
                   open={this.state.modalCreateOpen}
                   onClose={this.handleCreateModalClose} closeIcon>
                <Header color="blue" icon='add' content='Create Process'/>
                <Modal.Content>
                    {loading && <Dimmer active inverted><Loader inverted/></Dimmer>}
                    {this.state.data && <Form onSubmit={this.handleSubmit} error>
                        {this.state.data.map(el => {
                            if (el.type === "string" && el.id.toLowerCase().includes("comment")) {
                                return (<Form.TextArea key={el.id}
                                                       label={el.label}
                                                       name={el.type}
                                    // placeholder={el.label}
                                                       placeholder={el.value}
                                                       value={el.value}
                                                       onChange={e => this.handleChange(e, el.id)}/>)
                            } else if (el.type === "string") {
                                return (<Form.Field key={el.id} required fluid width={8}
                                                    control={Input}
                                                    label={el.label}
                                                    name={el.type}
                                    // placeholder={el.label}
                                                    placeholder={el.value}
                                                    value={el.value}
                                                    onChange={e => this.handleChange(e, el.id)}
                                />)
                            } else if (el.type === "long") {
                                return (<Form.Field key={el.id} required fluid width={8}
                                                    control={Input}
                                                    label={el.label}
                                                    name={el.type}
                                    // placeholder="0"
                                                    placeholder={el.value}
                                                    value={el.value}
                                                    error={el.longValidationErr}
                                                    onChange={e => this.handleChange(e, el.id)}
                                />)
                            } else if (el.type === "double") {
                                return (<Form.Field key={el.id} required fluid width={8}
                                                    control={Input}
                                                    label={el.label}
                                                    name={el.type}
                                    // placeholder="0.00"
                                                    placeholder={el.value}
                                                    value={el.value}
                                                    error={el.doubleValidationErr}
                                                    onChange={e => this.handleChange(e, el.id)}
                                />)
                            } else if (el.type === "boolean") {
                                return (<Form.Checkbox key={el.id}
                                                       checked={el.value}
                                                       label={el.label[0].toUpperCase() + el.label.slice(1)}
                                                       onChange={e => this.handleChange(e, el.id, el.type, el.value)}
                                />)
                            } else if (el.type === "file") {
                                return (<Fragment key={el.id}>
                                    <label className="label">{el.label}</label>
                                    <label key={el.id} className="form__file-input-label">
                                        <FileBase64 multiple={false}
                                                    onDone={e => this.handleCreatingFileInputChange(e, el.id)}/>
                                        {(el.fileName !== "") ? el.fileName : "Choose a file"}
                                    </label>
                                </Fragment>)
                            } else if (el.type === "enum") {
                                return (<Form.Field key={el.id}
                                                    value={el.value}
                                                    label={el.label}
                                                    onChange={e => this.handleChange(e, el.id, el.type)}
                                                    control='select'>
                                    {el.values.map(elem => <option key={elem.id.value}
                                                                   value={elem.id.value}>{elem.name.value}</option>)}
                                </Form.Field>)
                            } else {
                                return (<Form.Field key={el.id} fluid width={8}
                                                    control={Input}
                                                    label={el.label}
                                                    name={el.type}
                                    // placeholder=""
                                                    placeholder={el.value}
                                                    value={el.value}
                                                    onChange={e => this.handleChange(e, el.id)}
                                />)
                            }
                        })}
                        {this.state.isValidationError ? <Form.Field
                            control={Button}
                            color="blue"
                            floated='right'
                            className="modalButton"
                            content='New' disabled
                        /> : <Form.Field
                            control={Button}
                            color="blue"
                            floated='right'
                            className="modalButton"
                            content='New'
                        />}
                    </Form>}
                    {createProcessError && <Message error header='An error occurred' content={createProcessError}/>}
                </Modal.Content>
            </Modal>
        )
    }
}

const mapStateToProps = ({processCreate: {loading, isCreated, createProcessError, xmlStartEventData}}) => {
    return {loading, xmlStartEventData, isCreated, createProcessError};
};

const mapDispatchToProps = (dispatch, {services}) => {
    return {
        createProcess: (data,
                        processKey = "warranty_approval_test",
                        businessKey = "myBusinessKey") => createProcess(services, dispatch)(data, processKey, businessKey),
        getStartEventXml: (procDefinitionKey = "warranty_approval_test") => getStartEventXml(services, dispatch)(procDefinitionKey),
        clearErrorMessage: () => dispatch(clearCreateErrorMessage()),
        closeModal: () => dispatch(closeCreateModal())
    };
};

export default compose(withServices(), connect(mapStateToProps, mapDispatchToProps))(ModalCreateContainer);
