export const defineFileType = fileName => {
    let fileExtensionIndex = fileName.lastIndexOf(".");
    let fileExtension = fileName.substr(fileExtensionIndex + 1);
    switch (fileExtension) {
        case "txt":
            return "text/plain";
        case "pdf":
            return "application/pdf";
        default:
            return "text/plain";
    }
}
