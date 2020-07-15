import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {Form, Input, Button, Header, Modal, Message, Dimmer, Loader} from 'semantic-ui-react';
import {injectIntl} from "react-intl";
import FileBase64 from 'react-file-base64';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import {
    createProcess,
    clearCreateErrorMessage,
    closeCreateModal,
    getStartEventXml
} from '../../actions/createProcessAction';
import {takeChangedFormValues} from '../../utils/takeChangedDynamicFormValues';
import {createModalMessages} from './ModalCreateContainerMessages';
import {validationMessages} from '../../utils/validationFormMessages';

class ModalCreateContainer extends Component {
    state = {modalCreateOpen: false, isCreatingValidationError: false}
    creatingFormFields

    shouldComponentUpdate(nextProps) {
        if (nextProps.isCreated) {
            this.setState({modalCreateOpen: false, isCreatingValidationError: false});
            this.props.closeModal();
            return false;
        }
        return true;
    }

    getCreatingFormFieldsData = (formDataFields, formData = []) => {
        Array.from(formDataFields).forEach(el => {
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
                let booleanDefaultValue;
                if (el.attributes.defaultValue) {
                    const defaultValueString = el.attributes.defaultValue.value;
                    // eslint-disable-next-line
                    booleanDefaultValue = (defaultValueString == String(defaultValueString ? true : false)) ? (defaultValueString ? true : false) : (!defaultValueString ? true : false);
                }
                fieldData.value = el.attributes.defaultValue ? booleanDefaultValue : false;
            }
            if (el.attributes.type.value === "enum") {
                const enumValues = Array.from(el.attributes.id.ownerElement.children);
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
            this.creatingFormFields = Array.from(this.props.xmlStartEventData).find(el => el.nodeName === "bpmn:extensionElements").children[0].children;
            // console.log("creatingFormFields", this.creatingFormFields)
            this.setState({
                modalCreateOpen: true,
                data: this.getCreatingFormFieldsData(this.creatingFormFields),
                isCreatingValidationError: false
            });
        }
    }

    handleCreateModalOpen = () => {
        this.props.getStartEventXml();
        this.setState({modalCreateOpen: true, isCreatingValidationError: false})
    }

    handleCreateModalClose = () => {
        this.setState({modalCreateOpen: false, isCreatingValidationError: false});
        this.props.closeModal();
    }

    handleChange = (event, id, type, value) => {
        const [isValidationError, formFields] = takeChangedFormValues(this.state.data, event, id, type, value);
        this.setState({...this.state, isCreatingValidationError: isValidationError, data: [...formFields]});
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
        const {loading, createProcessError, clearErrorMessage, intl} = this.props;
        if (createProcessError) {
            setTimeout(() => clearErrorMessage(), 4000);
        }
        // console.log("state.data", this.state.data)
        return (
            <Modal trigger={<Button color="blue" onClick={this.handleCreateModalOpen}>{intl.formatMessage(createModalMessages["button-open"])}</Button>}
                   open={this.state.modalCreateOpen}
                   onClose={this.handleCreateModalClose} closeIcon>
                <Header color="blue" icon='add' content={intl.formatMessage(createModalMessages.header)}/>
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
                                                    error={el.longValidationErr && intl.formatMessage(validationMessages[`${el.longValidationErr}`])}
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
                                                    error={el.doubleValidationErr && intl.formatMessage(validationMessages[`${el.doubleValidationErr}`])}
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
                                        {(el.fileName !== "") ? el.fileName : intl.formatMessage(createModalMessages["input-file"])}
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
                        {this.state.isCreatingValidationError ? <Form.Field
                            control={Button}
                            color="blue"
                            floated='right'
                            className="modalButton"
                            content={intl.formatMessage(createModalMessages["button-action"])} disabled
                        /> : <Form.Field
                            control={Button}
                            color="blue"
                            floated='right'
                            className="modalButton"
                            content={intl.formatMessage(createModalMessages["button-action"])}
                        />}
                    </Form>}
                    {createProcessError && <Message error header={intl.formatMessage(createModalMessages["error-header"])} content={createProcessError}/>}
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

export default compose(injectIntl, withServices(), connect(mapStateToProps, mapDispatchToProps))(ModalCreateContainer);
