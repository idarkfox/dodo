/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-07-04 19:10:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-04 20:42:32
 */
'use strict'
class TemplateDodoError extends Error{

    #__console_info;
    constructor(err,message,sourceHtmlElement=null){
        super()
        this.message = message;
        this.cause = err;
        this.#__console_info = {message:message,cause:err};
        if(sourceHtmlElement!=null){
            this.#__console_info["errorSource"] = sourceHtmlElement;
        }
    }
    show(){
        console.error(this.#__console_info);
    }
    throw(){
        throw this;
    }
}

export default TemplateDodoError;