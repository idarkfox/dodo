/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-18 05:21:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-28 22:16:56
 */
'use strict'

class TemplateText extends Node{
    txt="";
    constructor(){
        super();
    }
    set txt(v){
        this.txt=v;
    }
    get txt(){
        return this.txt;
    }
}