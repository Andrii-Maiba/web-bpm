export const takeChangedFormValues = (formFields, event, id, type, value) => {
    let isValidationError;
    formFields.forEach(field => {
        if (field.id === id && event.target.name === "string") {
            field.value = event.target.value.toString();
        }
        if (field.id === id && type && type === "boolean") {
            field.value = !value;
        }
        if (field.id === id && event.target.name === "long") {
            if (isNaN(event.target.value) || event.target.value.toString().includes(" ")) {
                field.value = event.target.value;
                field.longValidationErr = "Please enter a number";
                isValidationError = true;
            } else if (event.target.value.toString().includes(".")) {
                field.value = event.target.value;
                field.longValidationErr = "Please enter an integer";
                isValidationError = true;
            } else {
                field.value = event.target.value;
                field.longValidationErr = null;
                isValidationError = false;
            }
        }
        if (field.id === id && event.target.name === "double") {
            if (isNaN(event.target.value) || event.target.value === "-0.00" || event.target.value.toString().includes(" ")) {
                field.value = event.target.value;
                field.doubleValidationErr = "Please enter a number";
                isValidationError = true;
            } else if (!/^-?[0-9]+[.][0-9]{2}$/.test(event.target.value)) {
                field.value = event.target.value;
                field.doubleValidationErr = "Please enter a number with two decimal places";
                isValidationError = true;
            } else {
                field.value = event.target.value;
                field.doubleValidationErr = null;
                isValidationError = false;
            }
        }
        if (field.id === id && type && type === "enum") {
            // console.log("select e.target.value", event.target.value)
            field.value = event.target.value;
        }
        return field;
    });
    return [isValidationError, formFields];
}
