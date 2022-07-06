/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-07-05 00:39:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 05:47:46
 */
'use strict'

import TemplateDodo from "./template-dodo.js";

const CUSTOM_TAG_NAME_PREFIX = "do-ex-";


function ClassBuild(tagName,htmlElementName){

    return class extends htmlElementName{
        
        static tagName  = CUSTOM_TAG_NAME_PREFIX + tagName;
        static fromTag  = tagName
        /**
         * @type {TemplateRender}
         */
        render          = null;
        
        /**
         * @type {TemplateDataPackage}
         */
        dataPackage     = null;

        static isCustomTag     = true;
        static isExtendsTag    = true;

        constructor(){
            super();
            if(this.__dataPackage){
                this.dataPackage = this.__dataPackage;
            }
        }
        connectedCallback() {
            TemplateDodo.prototype.connectedCallback.call(this);
        }
        disconnectedCallback() {
            TemplateDodo.prototype.disconnectedCallback.call(this);
        }
        adoptedCallback() {
            TemplateDodo.prototype.adoptedCallback.call(this);
        }
        attributeChangedCallback(name, oldValue, newValue) {
            // if( oldValue!=null && oldValue != newValue ){
            //     this.render.clearRenderNodes();
            // }
            TemplateDodo.prototype.attributeChangedCallback.call(this,name, oldValue, newValue);
        }
    
        destory(){
            TemplateDodo.prototype.destory.call(this);
        }

        moveTo(node){
            TemplateDodo.prototype.moveTo.call(this,node);
        }

        hiddenCustomTag(){
            TemplateDodo.prototype.hiddenCustomTag.call(this);
        }
        static get observedAttributes() {
            return [...TemplateDodo.observedAttributes];
        }
        static init(clazz){
            customElements.define(clazz.tagName, clazz,{extends:clazz.fromTag});
        }
    }

}

class TemplateExtendsTags{
    static extendHtmlElements = new Map();
    constructor(){
        
    }
    /**
     * zh-CN:   在HTML基本元素上做扩展，继承基本元素的样式、属性、方法。
     * 
     * en:      Extend the HTML basic elements and inherit the styles, attributes and methods of the basic elements.
     * 
     * @param {JSONObject} options 
     */
    static use(options){
        if( TemplateExtendsTags.extendHtmlElements.get(options.tagName) == undefined ){
            let clazz = ClassBuild(options.tagName,options.htmlElementName);
            TemplateExtendsTags.extendHtmlElements.set(clazz.tagName,clazz);
            
        }
        

    }

    static hasTag(tagName){
        if(tagName){
            return TemplateExtendsTags.extendHtmlElements.get(tagName) != undefined;
        } else {
            return false;
        }
    }

    static checkHtmlTag(node){
        let tagName = node.getAttribute("is");
        return TemplateExtendsTags.hasTag(tagName);
    }

    static init(){
        TemplateExtendsTags.extendHtmlElements.forEach(clazz=>{
            clazz.init(clazz);
        })
    }
}


export default TemplateExtendsTags;