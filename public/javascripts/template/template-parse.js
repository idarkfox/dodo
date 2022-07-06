/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-23 12:20:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 15:58:20
 */

'use strict'

import TemplateDodo from "./template-dodo.js";
import TemplateDataPackage from "./template-data-package.js";
import TemplateContext from "./template-context.js";
import TemplateDodoError from "./template-error.js";
import TemplateExtendsTags from "./template-extends-tags.js";

import Utils from "../utils.js";



class TemplateParse {

    /**
     * zh-CN:   解析context模板
     * 
     * en:      parse context template
     * 
     * @param {TemplateDodo} parent 
     * @returns 
     */
    static parse_context(parent) {
        let nodes = [];
        let children = TemplateDodo.GetChildren(parent);
        Array.from(children, node => {
            let cloneNode = document.importNode(node, true);
            TemplateDodo.SetRenderNode(cloneNode);
            nodes.push(cloneNode);
        });
        return nodes;
    }

    /**
     * 
     * @param {String} expr_str 
     * @param {TemplateDodo} node 
     * @returns {object}
     */
    static build_data(expr_str, node) {
        let context = TemplateContext.GetContextByNode(node);
        let data = {};
        let dataPackage = node.dataPackage || new TemplateDataPackage({});
        let args = [TemplateContext.DODO_CONTEXT_ARG, ...dataPackage.keys()];
        if (expr_str.length > 0) {
            try{
       
                data = new Function(args, '"use strict"; return ' + expr_str)(context.value, ...dataPackage.values());
                
            } catch(err){
                (new TemplateDodoError(err,"parse expr error from [TemplateParse.build_data]",node)).show();
            }
            
        }
        return data;
    }

    /**
     * 
     * @param {TemplateDodo} node 
     * @returns {object}
     */
    static parse_in(node) {
        let in_str = TemplateDodo.GetAttribute(node, 'in');
        return SELF.build_data(in_str, node);
    }

    // foreach/ for ... in
    /**
     * 
     * @param {TemplateDodo|HTMLElement} node TemplateDodo or customized built-in element.
     * @returns {HTMLElement[]}
     * 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#customized_built-in_element MDN #customized_built-in_element}
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#customized-built-in-element TC39 #customized built-in element}
     */
    static parse_foreach(node) {
        let for_str = TemplateDodo.GetAttribute(node, 'for');
        let data = SELF.parse_in(node);
        let args = for_str.replace(/[\(\)\{\}]/g, '').split(',');
        if (args.length < 3) {
            args.push('array');
        }
        let nodes = [];
        data.forEach(function (dat, idx) {

            /**
             * currentValue , index , array
             */
            let dataobj = {
                [args[0]]: dat,
                [args[1]]: idx,
                [args[2]]: data,
            };
            let dataPackage = new TemplateDataPackage(dataobj, idx);
            let children = TemplateDodo.GetChildren(node);
            Array.from(children, child => {
                child.hidden = true;
                let cloneNode = document.importNode(child, true);
                cloneNode.hidden = false;
                SELF.TopNodeRenderConfigure(cloneNode, dataPackage);
                nodes.push(cloneNode);
            })
        }, this);

    
        return nodes;
    }


    // for(;;) to do
    static parse_for_expr(node) {
        let for_str = TemplateDodo.GetAttribute(node, 'for');
        // for(let i=0;i<x.length;i++){}
        // to do

    }

    /**
     * 
     * @param {TemplateDodo} node 
     * @returns {HTMLElement[]}
     */
    static parse_case(node) {
        
        let case_str = TemplateDodo.GetAttribute(node, 'case');

        let subTemplates = Utils.GroupBy(TemplateDodo.GetChildren(node), (ele) => {
            let attr = TemplateDodo.GetAttributes(ele);
            if (attr.includes("when")) {
                return "whenNodes";
            } else if (attr.includes("else")) {
                return "elseNodes";
            } else {
                return null;
            }
        });

        
        /**
         * @type {TemplateDoeo};
         */
        let whenResult = null;
        let case_str_exists = case_str.length > 0;
        for(let i=0;i<subTemplates.whenNodes.length;i++){
            if ( case_str_exists ) {
                let data = SELF.build_data(case_str, node);
                whenResult = SELF.parse_case_when_equal(subTemplates.whenNodes[i], data);
            } else {
                whenResult = SELF.parse_case_when_expr(subTemplates.whenNodes[i],node);
            }
            if(whenResult!=null){
                break;
            }
        }

        let cloneNode = null;
        if(whenResult!=null){
            cloneNode = document.importNode(whenResult, true);
        } else {
            if(subTemplates.elseNodes.length>0){
                cloneNode = document.importNode(subTemplates.elseNodes[0], true);
            }
        }

        if ( cloneNode != null ){
            let childNodes = TemplateDodo.GetChildren(cloneNode);
            [...childNodes].forEach(child => {
                SELF.TopNodeRenderConfigure(child, node.dataPackage);
            });
            return [...childNodes];
        } else {
            return [];
        }

    }

    /**
     * zh-CN:   判断值与[when]属性是否相等
     * 
     * 
     * 
     * @param {TemplateDodo} node 
     * @param {*} value 
     * @returns 
     */
    static parse_case_when_equal(node, value) {
        let when_str = TemplateDodo.GetAttribute(node,"when");
        let bool = false;
        try{
            bool = new Function('value', `"use strict"; return ${when_str} == value;`)(value);
        }catch(err){
            (new TemplateDodoError(err,"parse expr error from [TemplateParse.parse_case_when_equal]",node)).show();
        }
        if(bool){
            return node;
        } else {
            return null;
        }
    }

    /**
     * zh-CN:   处理表达式，需要从父节点获取绑定的数据包。
     * 
     * 
     * @param {TemplateDodo} whenNode 
     * @param {TemplateDodo} parentNode 
     */
    static parse_case_when_expr(whenNode,parentNode) {
        let when_str = TemplateDodo.GetAttribute(whenNode,"when");
        let result = SELF.build_data(when_str, parentNode);
        if(result==true){
            return whenNode;
        } else {
            return null;
        }
    }





    /**
     * zh-CN:   解析Text内容
     * 
     * en:      parse Text content
     * 
     * @param {TemplateDodo} dodoTextNode 
     */
    static parse_text(dodoTextNode) {

        /**
         * @type {TemplateDataPackage} TemplateDataPackage
         */
        let data = dodoTextNode.dataPackage;// || new TemplateDataPackage({});

        /**
         * @type {string[]}
         */
        let args = data.keys();

        let val = TemplateDodo.GetAttribute(dodoTextNode, 'text');
        let fun = new Function(args, `return ${val}`);
        let txtnode = document.createTextNode( fun(...data.values() ) );
        if(TemplateExtendsTags.checkHtmlTag(dodoTextNode)){
            dodoTextNode.appendChild(txtnode);
            dodoTextNode.finishedRendering = true;
        } else {
            dodoTextNode.replaceWith(txtnode);
        }
        
    }

    /**
     * zh-CN:   解析HTML内容
     * 
     * en:      parse html content
     * 
     * @param {TemplateDodo} dodoHtmlNode 
     */
    static parse_html(dodoHtmlNode) {
        /**
         * @type {TemplateDataPackage} TemplateDataPackage
         */
        let data = dodoHtmlNode.dataPackage;// || new TemplateDataPackage({});

        /**
         * @type {string[]}
         */
        let args = data.keys();
        let val = TemplateDodo.GetAttribute(dodoHtmlNode, 'html');
        let fun = new Function(args, `return ${val}`);
        let htmlContainer = document.createElement("div");
        htmlContainer.innerHTML = fun(...data.values());
        dodoHtmlNode.replaceWith(...htmlContainer.children);

        if(TemplateExtendsTags.checkHtmlTag(dodoHtmlNode)){
            dodoHtmlNode.innerHTML = fun(...data.values());
            dodoHtmlNode.finishedRendering = true;
        } else {
            let htmlContainer = document.createElement("div");
            htmlContainer.innerHTML = fun(...data.values());
            dodoHtmlNode.replaceWith(...htmlContainer.children);
        }
    }

    /**
     * 
     * @param {TemplateDodo} node 
     */
    static render(node){
        let context_uuid = TemplateContext.GetBindUUID(node);
        node.render.render();
        node.finishedRendering = true;


        // Move and hide the HTML tag of the render point handler if it is not the root node.
        if ( TemplateExtendsTags.checkHtmlTag(node) ){
            
        } else if (TemplateDodo.GetTemplateRoot(context_uuid) != node && !(node.getAttribute("clear") == "false")) {
            node.hiddenCustomTag();
        }
    }

    /**
     * zh-CN: 设置为可渲染，仅处理自定义元素。
     * 
     * en: Set to renderable, Handle only custom elements.
     * 
     * @param {HTMLElement} node 
     * @param {TemplateDataPackage} dataPackage 
     * @returns 
     */
    static TopNodeRenderConfigure(node, dataPackage) {



        if (TemplateDodo.CheckTemplate(node) || TemplateDodo.CheckContentNode(node) || TemplateExtendsTags.checkHtmlTag(node) ) {
            TemplateDodo.SetRenderNode(node);
            TemplateDodo.SetItemIndex(node, dataPackage.index);
            TemplateDodo.SetDataPackage(node, dataPackage);

            if( typeof(node.isCustomTag)=="undefined" ){
                node.__dataPackage = dataPackage;
            }


            return;
        } 
        [...TemplateDodo.GetChildren(node)].forEach(child => {
            SELF.TopNodeRenderConfigure(child, dataPackage);
        })

    }

    /**
     * zh-CN: 遍历节点树。
     * 
     * en: Traversing Node Tree.
     * 
     * @param {TemplateDodo} currenNode 
     * @param {TemplateDodo} parentNode 
     * @param {String} context_uuid 
     * @returns 
     */
    static TraversalTemplateNode(currenNode, parentNode = null, in_context_uuid = null) {

        let context_uuid = in_context_uuid;

        /**
         * zh-CN:   当前节点是子模板位于另一个模板中，不可渲染，需要保持原状。
         *          这里需要说明一下：模板的渲染是逐级进行的，会单独复制出模板到渲染点并标记其为可渲染状态，
         *          被复制出的模板进入connect [connectedCallback()]时会再次执行此过程，由于状态被标记为可
         *          渲染["dodo-sub-tpl=2":ViewRender]，因此可以执行后续的解析和渲染过程。
         * 
         * en:      The current node is a child template in another template and cannot be rendered. 
         *          It needs to be left as it is. The explanation here is that the rendering of templates is 
         *          done step by step. Templates are copied individually to the rendering point and marked 
         *          as renderable. When the copied template enters connect [connectedCallback()], this process 
         *          is executed again. Since the state is marked as renderable ["dodo-sub-tpl=2": ViewRender], 
         *          subsequent parsing and rendering processes can be performed.
         */
        if (typeof (currenNode) == 'undefined' || TemplateDodo.CheckSubNode(currenNode)) {
            return;
        }

        let attrs = TemplateDodo.GetAttributes(currenNode);

        /**
         * zh-CN:   是context模板
         * en:      Is context template.
         */
        if (attrs.includes('context')) {

            /**
             * zh-CN:   第一次遍历当前节点时，“Context UUID” 属性不存在，因此将生成新的UUID。
             * en:      The "context UUID" attribute does not exist when the current node is traversed for the first time, so a new UUID will be generated.
             */
            let uuid = TemplateDodo.GetContextUUID(currenNode);
            let value = (new Function(`return ${TemplateDodo.GetAttribute(currenNode, 'context')}`))();
            TemplateContext.SaveContext(value,uuid);
            TemplateContext.BindUUID(currenNode, uuid);
            context_uuid = uuid;

            /**
             * zh-CN:   该context模板不是根节点，但它有自己的UUID，该context模板将被作为根节点保存，以供它内部的模板使用。
             * en:      The context template is not a root node, but it has its own UUID and will be saved as the root node for use by templates inside it.
             */
            if (TemplateDodo.GetSubNodeAttribute(currenNode) != null) {
                TemplateDodo.SaveTemplateRoot(context_uuid, currenNode);
            }

        }

        /**
         * Is empty context.
         * zh-CN:   根部不存在context模板，为其创建一个空context。
         * en:      There is no context template at the root, so create an empty context for it.
         */
        if (context_uuid == null) {
            context_uuid = TemplateContext.GetBindUUID(currenNode);

            if (context_uuid == null) {
                context_uuid = Utils.BuildUUID();
                TemplateContext.SaveContext({},context_uuid);
                TemplateContext.BindUUID(currenNode, context_uuid);
            }
        }
        
        // Is subtemplate.
        if (parentNode != null && ( TemplateExtendsTags.checkHtmlTag(currenNode) || currenNode.tagName == TemplateDodo.tagName.toUpperCase() ) ) {
            
            TemplateDodo.SetSubNode(currenNode);
            TemplateContext.BindUUID(currenNode, context_uuid);

        }


        /**
         * zh-CN:   这里，所有自定义子节点都将执行 [TemplateDodo.SetSubNode]。
         * en:      Here, all custom child nodes will execute [TemplateDodo.SetSubNode].
         */
        let children = TemplateDodo.GetChildren(currenNode);
        if (children != null && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                SELF.TraversalTemplateNode.call(this, children[i], currenNode, context_uuid);
            }
        }



        // Start processing current node
        
        if ( parentNode == null ) {

            // It is the top node . It is set as the root node and stored in the context.

            if (TemplateDodo.GetSubNodeAttribute(currenNode) == null) {
                TemplateDodo.SetTemplateRootNode(currenNode);
                TemplateDodo.SaveTemplateRoot(context_uuid, currenNode);
            }

            // Render the current node.

            if ( attrs.includes('context') ) {
                currenNode.render.nodes = SELF.parse_context(currenNode);
                currenNode.render.render();
                currenNode.finishedRendering = true;
            }
            else if ( attrs.includes('for') ) {

                if (attrs.includes('in')) {
                    currenNode.render.nodes = SELF.parse_foreach(currenNode);
                    SELF.render(currenNode);
                }

            } else if (attrs.includes('text')) {

                // Text template is without renderer.
                SELF.parse_text(this);
            } else if (attrs.includes('html')) {

                // HTML template is without renderer.

                SELF.parse_html(this);
            } else if (attrs.includes('case')) {
                
                currenNode.render.nodes = SELF.parse_case(this);
                SELF.render(currenNode);
                
            } else if (attrs.includes('expr')) {
                
            }

        }


    }


}

let SELF = TemplateParse;

export default TemplateParse;