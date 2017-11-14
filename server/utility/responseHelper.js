var ResponseCode = {
    OK : 200,
    CREATED : 201,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    NOT_AUTHORIZED : 401
};

exports.responseType = {
    Ok : function (res, data) {
        res.set('Content-Type', 'application/json');
        data.success = true;
        res.status(ResponseCode.OK).send(data);
    }, 
    Success : function (res, message) {
        res.set('Content-Type', 'application/json')
        res.status(ResponseCode.OK).send({ success : true,  message : message });
    },    
    Created : function (res, data) {
        res.set('Content-Type', 'application/json')
        res.status(ResponseCode.CREATED).send(data);
    },    
    NotFound : function (res, err) {
        res.status(ResponseCode.NOT_FOUND).send({ message : err.toString() });
    },    
    BadRequest : function (res, err) {
        res.status(ResponseCode.BAD_REQUEST).send({ message : err.toString()});
    },    
    InternalServerError : function (res, err) {
        res.status(ResponseCode.INTERNAL_SERVER_ERROR).send({ message : err.toString()});
    },    
    NotAuthorized : function (res, data) {
        res.status(ResponseCode.NOT_AUTHORIZED).send(data);
    }
}

exports.ResponseCode = ResponseCode;