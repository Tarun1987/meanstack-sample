// Constructor
function FailureResponse(status, message) {
    // always initialize all instance properties
    this.status = status;
    this.message = message; // default value
  }
  
  // export the class
  module.exports = FailureResponse;