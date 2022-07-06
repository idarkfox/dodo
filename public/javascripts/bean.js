/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-17 05:06:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-17 11:37:48
 */
'use strict'

import DodoBase from "./base.js"



class JSBean extends DodoBase  {
    static tagName = "js-bean";
    constructor() {
      super();
      
      
    }
    static init(){
        customElements.define(JSBean.tagName,JSBean);
        
    }
}

export default JSBean;