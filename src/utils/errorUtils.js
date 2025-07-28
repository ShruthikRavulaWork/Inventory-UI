/**
 * Parses an error object from an Axios API call to get a user-friendly message.
 * @param {object} err The error object.
 * @returns {string} A human-readable error message.
 */
export const getErrorMessage = (err) => {
    let errorMessage = "An unknown error occurred. Please try again.";

    if (err.response?.data) {
        if (typeof err.response.data === 'object') {
            errorMessage = err.response.data.message || err.response.data.Message || JSON.stringify(err.response.data);
        } 
        else if (typeof err.response.data === 'string' && err.response.data.length > 0) {
            errorMessage = err.response.data;
        }
    } 
    else if (err.message) {
        errorMessage = err.message;
    }
    
    return errorMessage;
};