/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-07-01 16:03:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 16:22:15
 */

'use strict'

class Context{

    value = {};
    /**
     * @type {HTMLElement}
     */
    owner = null;
    uuid = "";

    constructor(value={}){
        this.value = value;
    }

    getChecked(){
        if(this.uuid == null || (''+this.uuid).length < 36 ){
            throw new Error("UUID cannot be null and requires a string length of 36.");
        } else {
            return this;
        }
    }


}


class TemplateContext{
    static ContextUUID                  = "context-uuid";
    static DODO_TPL_CONTEXT             = "dodo_tpl_context";
    static DODO_CONTEXT_ARG             = "dodoContext";
    
    
    constructor(){

    }

    /**
     * 
     * @param {String} context_uuid 
     * @returns 
     */
     static GetContextByUUID(context_uuid){
        /**
         * @type {Map<String,Context>}
         */
         let m = Dodo[TemplateContext.DODO_TPL_CONTEXT];
        return m.get(context_uuid);
    }

    /**
     * 
     * @param {HTMLElement} node TemplateDodo custom HTMLElement. 
     */
    static GetContextByNode(node){
        let context_uuid = node.getAttribute(TemplateContext.ContextUUID);
        /**
         * @type {Map<String,Context>}
         */
        let m = Dodo[TemplateContext.DODO_TPL_CONTEXT];
        return m.get(context_uuid);
    }

    /**
     * 
     * @param {HTMLElement} node TemplateDodo custom HTMLElement.
     * @param {String} context_uuid 
     */
     static BindUUID(node,context_uuid){
        node.setAttribute(TemplateContext.ContextUUID,context_uuid);
    }

    /**
     * zh-CN:   获取绑定的 HTMLElement 属性 [context uuid]。
     * 
     * en:      Get the bound HTMLElement attribute [context uuid].
     * 
     * @param {HTMLElement} node TemplateDodo custom HTMLElement.
     * @returns 
     */
    static GetBindUUID(node){
        return node.getAttribute(TemplateContext.ContextUUID);
    }

    /**
     * 
     * @param {String} uuid 
     * @param {Context|Object} value 
     */
    static SaveContext(value,uuid=null){
        /**
         * @type {Map<String,Context>}
         */
        let m = Dodo[TemplateContext.DODO_TPL_CONTEXT];
        let context;
        if(value instanceof Context){
            context = value.getChecked();
        } else {
            let ctx = new Context(value);
            ctx.uuid = uuid
            context = ctx.getChecked();
        }
        return m.set(context.uuid,context);
    }

    /**
     * 
     * @param {Context|String} ctx_or_uid Context instance or UUID string.
     */
    static Destory(ctx_or_uid){
        let uuid = ctx_or_uid instanceof Context ? ctx_or_uid.getChecked().uuid : ctx_or_uid;
        /**
         * @type {Map<String,Context>}
         */
        let m = Dodo[TemplateContext.DODO_TPL_CONTEXT]
        return m.delete(uuid);
    }

}

if( typeof(Dodo[TemplateContext.DODO_TPL_CONTEXT]) == "undefined" ){
    Dodo[TemplateContext.DODO_TPL_CONTEXT] = new Map();
}

export default TemplateContext;
export {Context,TemplateContext};
