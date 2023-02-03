export class HttpConstants {
    
    public REQUEST_STATUS = {
      SUCCESS_200: {
        CODE: 200,
        MESSAGE: 'Success!',
      },
      CREATED_201: {
        CODE: 201,
        MESSAGE: 'Created!',
      },
      BAD_REQUEST_400: {
        CODE: 400,
        MESSAGE: 'Bad Request!',
      },
      UNAUTHORIZED_401: {
        CODE: 401,
        MESSAGE: 'Unauthorized!',
      },
      REQUEST_NOT_FOUND_404: {
        CODE: 404,
        MESSAGE: 'Request Not Found!',
      },
      ALREADY_EXIST_409: {
        CODE: 409,
        MESSAGE: 'Already Exists!',
      },
      SERVER_ERROR_500: {
        CODE: 500,
        MESSAGE: 'Server Error!',
      },
      ALREADY_LOGGED_IN_409: {
        CODE: 409,
        MESSAGE: 'Already Logged In!',
      },
      NO_DATA_FOUND: {
        CODE: 202,
        MESSAGE: 'No data found',
      },
    };
  
    constructor() {
    }
    
  }