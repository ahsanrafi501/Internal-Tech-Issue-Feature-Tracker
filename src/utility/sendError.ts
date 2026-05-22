class ApiError extends Error{
    public statusCode: number;
    public message: string;
    public data: any;
    public error: any[];

    constructor(statusCode: number, message: string = "something went wrong", data: any, error: any[], stack: string = ''){
        super(message)
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.error = error;

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
        
    }
}


export {ApiError}