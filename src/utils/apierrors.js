class apierrors extends Error{
    constructor(
        message="spmething went wrong",
        statuscode,
        errors=[],
        stack=""

    ){
        super(message);
        this.statuscode=statuscode;
        this.errors=errors;
        this.message=message;
        this.success=false;
        this.data=null

        if (stack) {
            this.stack=stack
            
        }else{
            Error.captureStackTrace(this,this.Constructor)
        }



    }
    
}

export {apierrors};
