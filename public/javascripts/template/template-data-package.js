/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-29 16:24:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-04 19:02:22
 */
'use strict'
class TemplateDataPackage{
    #__data;
    #__idx;
    constructor(data,idx=-1){
        this.#__data = data;
        this.#__idx = idx;
    }
    keys(){
        return Object.keys(this.#__data);
    }
    values(){
        return Object.values(this.#__data);
    }
    get index(){
        return this.#__idx;
    }
}

export default TemplateDataPackage;