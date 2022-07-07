/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-07-06 21:34:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-07 03:04:24
 */
'use strict'

import TemplateKeys from "./template-keys.js";

const EVENT_PREFIX = "do_";




class TemplateEvents {

    static invoke(eventName){
        let on_expr = this.getAttribute(eventName);
        if( on_expr ){
            (new Function( on_expr )).call(this);
        }
    }

    static on_complete(){
        TemplateEvents.invoke.call(this,"do_complete");
    }

}

export default TemplateEvents
