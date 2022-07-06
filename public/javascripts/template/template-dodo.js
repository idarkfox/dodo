/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-18 05:38:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 16:27:54
 */
'use strict'

import Utils from "../utils.js";
import DodoBase from "../base.js";
import TemplateRender from "./template-render.js";
import TemplateKeys from "./template-keys.js"
import TemplateParse from "./template-parse.js";
import TemplateContext from "./template-context.js";
import TemplateExtendsTags from "./template-extends-tags.js";


const RootTemplate  = 0;
const SubTemplate   = 1;
const ViewRender    = 2;

class TemplateExDodo extends HTMLTemplateElement{
    
    static tagName = "do-do-tpl"

    static isExtendsTag             = false;

    render                          = null;
    constructor(){
        super();
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
        TemplateDodo.prototype.attributeChangedCallback.call(this,name, oldValue, newValue);
    }

    static get observedAttributes() {
        return TemplateDodo.observedAttributes;
    }
    
    static init(){
        customElements.define(TemplateExDodo.tagName, TemplateExDodo,{extends:'template'});
    }
}

const CUSTOM_TAG_NAME_PREFIX        = "do-";
const SUBTEMPLATE_ATTRIBUTE_NAME    = "dodo-sub-tpl";
const INNER_PROPERTY_PREFIX         = "data-";


class TemplateDodo extends DodoBase{
    
    static tagName                  = "dodo-tpl";

    static isCustomTag                     = true;
    static isExtendsTag                    = false;
    /**
     * @type {TemplateRender}
     */
    render = null;

    finishedRendering = false;

    /**
     * @type {TemplateDataPackage}
     */
    dataPackage = null;

    constructor(){
        super();
        if(this.__dataPackage){
            this.dataPackage = this.__dataPackage;
        }
    }
    
    static get CUSTOM_TAG_NAME_PREFIX(){
        return CUSTOM_TAG_NAME_PREFIX;
    }

    static get SUBTEMPLATE_ATTRIBUTE_NAME(){
        return SUBTEMPLATE_ATTRIBUTE_NAME;
    }

    static get INNER_PROPERTY_PREFIX(){
        return INNER_PROPERTY_PREFIX;
    }

    static get EventNames(){
        return {"complete":"templatedodo-complete"};
    }

    connectedCallback() {
        // console.log(this);
        if(this.finishedRendering){
            return;
        }
       /*  if( SELF.CheckTemplate(this) || SELF.CheckContentNode(this) ){
            if(SELF.CheckTemplate(this)){
                if( this.render == null ){
                    this.render = new TemplateRender(this);
                }
            }
            TemplateParse.TraversalTemplateNode.call(this,this);
        } */
        
            if(SELF.CheckTemplate(this) || TemplateExtendsTags.checkHtmlTag(this) ){
                if( this.render == null ){
                    this.render = new TemplateRender(this);
                }
            }
            TemplateParse.TraversalTemplateNode.call(this,this);
        
    }

    disconnectedCallback() {
        if(this.parentNode==null){
            this.destory();
        }
    }

    adoptedCallback() {

        
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if( oldValue!=null && oldValue != newValue ){
            this.render.clearRenderNodes();
            TemplateParse.TraversalTemplateNode.call(this,this);
        }
        
        // if( !SELF.CheckSubNode(this) ){
        //     // document.dispatchEvent(new Event(SELF.EventNames.complete));
        //     this.dispatchEvent(new CustomEvent(SELF.EventNames.complete,{
        //         bubbles:false,cancelable:false
        //     }));
        // }
        
    }

    destory(){
        
        if( this.render ){
            this.render.destory();
            this.finishedRendering = false;
        }
        let ctx = TemplateContext.GetContextByNode(this)
        if( ctx != undefined && ctx.owner == this ){
            TemplateContext.Destory(ctx);
        }
    }

    /**
     * 
     * @param {TemplateDodo} node 
     */
    moveTo(node){
        node.appendChild(this);
        if(this.finishedRendering){
            this.render.adjustPosition();
        }
    }

    hiddenCustomTag(){
 
        let hiddenNode = SELF.GetTemplateRoot(SELF.GetContextUUID(this));
        hiddenNode = hiddenNode.render.nonRenderFragment;

        let traversal = (ele)=>{
            if(ele.tagName.toLowerCase()==SELF.tagName){
                ele.finishedRendering = true;
            }
            let children = SELF.GetChildren(ele);
            Array.from(children,child=>{
                traversal(child);
            });
        };
        traversal(this);
        // this.finishedRendering = true;
        hiddenNode.appendChild(this);
    }

    /**
     * observer events bind
     */
    static get observedAttributes() {
        return [...TemplateKeys.statementKeys.map(el=>(SELF.INNER_PROPERTY_PREFIX + el)),...TemplateKeys.statementKeys];
    }

   /**
     * 
     * @returns {HTMLCollection}
     */
    static GetChildren(node){
        if(node.tagName.toLowerCase()=='template'){
            return node.content.children;
        } else {
            return node.children;
        }
    }

    /**
     * 
     * @param {TemplateDodo} target 
     * @returns {Boolean}
     */
    static CheckTemplate(target){
        let attrs = SELF.GetAttributes(target);
        let result = attrs.filter(item=>{
            return TemplateKeys.statementKeys.includes(item);
        });
        return result.length > 0;
    }

    /**
     * 
     * @param {TemplateDodo} target 
     * @returns {Boolean}
     */
    static CheckContentNode(target){
        let attrs = SELF.GetAttributes(target);
        let result = attrs.filter(item=>{
            return TemplateKeys.contentKeys.includes(item);
        });
        return result.length > 0;
    }
    
    /**
     * 
     * @param {TemplateDodo} node 
     * @returns {String|null}
     */
    static GetSubNodeAttribute(node){
        return node.getAttribute(SELF.SUBTEMPLATE_ATTRIBUTE_NAME);
    }

    /**
     * 
     * @param {TemplateDodo} node 
     * @returns {Boolean}
     */
    static CheckRootNode(node){
        return node.getAttribute(SELF.SUBTEMPLATE_ATTRIBUTE_NAME) == RootTemplate;
    }
    
    /**
     * 
     * @param {TemplateDodo} node 
     * @returns {Boolean}
     */
    static CheckSubNode(node){
        return node.getAttribute(SELF.SUBTEMPLATE_ATTRIBUTE_NAME) == SubTemplate;
    }
    
    /**
     * zh-CN: 设置为可渲染。
     * 
     * en: Set to renderable.
     * 
     * @param {TemplateDodo} node 
     * @returns {Boolean}
     */
    static CheckRenderNode(node){
        return node.getAttribute(SELF.SUBTEMPLATE_ATTRIBUTE_NAME) == ViewRender;
    }


    /**
     * 
     * @param {TemplateDodo} sourceNode 
     * @param {String} attrName 
     * @returns 
     */
    static hasAttribute(sourceNode,attrName){
        return GetAttributes(sourceNode).includes(attrName);
    }

    /**
     * 
     * @param {TemplateDodo} sourceNode 
     * @returns {String[]}
     */
    static GetAttributes(sourceNode){
        let dataset = Object.keys(sourceNode.dataset);
        let dataattr = sourceNode.getAttributeNames();
        return [...new Set(dataset.concat(dataattr))];
    }

    /**
     * 
     * @param {TemplateDodo} sourceNode 
     * @param {String} name 
     * @returns {String}
     */
    static GetAttribute(sourceNode,name){
        return sourceNode.dataset[name]||sourceNode.getAttribute(name);
    }

    /**
     * 
     * @param {TemplateDodo} node 
     */
    static SetTemplateRootNode(node){
        node.setAttribute(SELF.SUBTEMPLATE_ATTRIBUTE_NAME,RootTemplate);
    }

    /**
     * 
     * @param {TemplateDodo} node 
     */
    static SetSubNode(node){
        node.setAttribute(SELF.SUBTEMPLATE_ATTRIBUTE_NAME,SubTemplate);
    }

    /**
     * 
     * @param {TemplateDodo} node 
     */
    static SetRenderNode(node){
        node.setAttribute(SELF.SUBTEMPLATE_ATTRIBUTE_NAME,ViewRender);
    }

    /**
     * zh-CN: 为dodo标签设置[index]属性
     * 
     * en: Set [index] attribute for dodo tag
     * 
     * @param {TemplateDodo} node 
     * @param {Integer} idx 
     */
    static SetItemIndex(node,idx){
        node.setAttribute(SELF.INNER_PROPERTY_PREFIX+"idx",idx);
    }

    /**
     * zh-CN: 绑定数据包。
     * 
     * en: Bind Packet.
     * 
     * @param {TemplateDodo} node 
     * @param {TemplateDataPackage} dataPackage 
     */
    static SetDataPackage(node,dataPackage){
        node.dataPackage = dataPackage;
    }


    /**
     * zh-CN:   从属性中获取[context uuid],如果不存在则创建一个新的uuid。
     * 
     * en:      Get [context uuid] from the attribute, and create a new UUID if it does not exist.
     * 
     * @param {TemplateDodo} node 
     * @returns {String} UUID
     */
    static GetContextUUID(node){
        let uuid = TemplateContext.GetBindUUID(node);
        if(uuid==null){
            uuid = Utils.BuildUUID();
        }
        return uuid;
    }

    /**
     * 
     * @param {String} context_uuid 
     * @returns {TemplateDodo}
     */
    static GetTemplateRoot(context_uuid){
        return TemplateContext.GetContextByUUID(context_uuid).owner;
    }

    /**
     * zh-CN:   保存根节点到[context]
     * 
     * en:      Save root node to [context].
     * 
     * @param {String} context_uuid 
     * @param {TemplateDodo} rootNode 
     */
    static SaveTemplateRoot(context_uuid,rootNode){
        TemplateContext.GetContextByUUID(context_uuid).owner = rootNode;
    }

    static init(){
        customElements.define(SELF.tagName, TemplateDodo);
        TemplateExDodo.init();
        
    }

}



// extends keys
TemplateKeys.statementKeys.forEach((in_key,idx)=>{
    let key = TemplateDodo.INNER_PROPERTY_PREFIX + in_key;
    Object.defineProperty(TemplateDodo.prototype,key,{
        configurable:false,
        enumerable:true,
        get(){
            return this.getAttribute(key);
        },
        set(v){
            this.setAttribute(key,v);
        }
    });
    Object.defineProperty(TemplateDodo.prototype,in_key,{
        configurable:false,
        enumerable:true,
        get(){
            return this.getAttribute(in_key);
        },
        set(v){
            this.setAttribute(in_key,v);
        }
    });
});

var SELF = TemplateDodo;



export default TemplateDodo;