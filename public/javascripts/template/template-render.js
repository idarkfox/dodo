/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-18 04:32:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 05:53:39
 */
'use strict'

import Utils from "../utils.js";
import TemplateExtendsTags from "./template-extends-tags.js";


class TemplateRender {
    targetTemplate;
    /**
     * @type {Node[]}
     */
    renderNodes;
    nodeInsertPoint = null;
    nodeInsertPointUUID = null;

    /**
     * 
     * @param {HTMLElement} in_targetTemplate 
     */
    constructor(in_targetTemplate) {
        this.targetTemplate = in_targetTemplate;
        this.renderNodes = [];
        this.nonRenderFragment = document.createDocumentFragment();
        this.nodeInsertPointUUID = Utils.BuildUUID();

    }

    destory() {
        this.clearRenderNodes();
        this.clearInsertPoint();
    }

    render() {

        /**
         * Extended from internal HTML tags
         */
        if ( TemplateExtendsTags.checkHtmlTag(this.targetTemplate) ) {

            this.targetTemplate.append(...this.renderNodes);


        } else {
            /**
             * Custom Elements
             */
            this.buildInsertPoint();

            let posNode = this.targetTemplate.nextSibling;
            let fragment = new DocumentFragment();
            for (let idx in this.renderNodes) {
                fragment.append(this.renderNodes[idx]);
            }
            this.targetTemplate.parentNode.insertBefore(fragment, posNode);

            this.clearInsertPoint();
        }




    }

    adjustPosition() {
        /**
         * Extended from internal HTML tags
         */
        if (TemplateExtendsTags.checkHtmlTag(this.targetTemplate) ) {




        } else {
            this.buildInsertPoint();

            let posNode = this.targetTemplate.nextSibling;
            let fragment = new DocumentFragment();
            for (let idx in this.renderNodes) {
                fragment.append(this.renderNodes[idx]);
            }
            this.targetTemplate.parentNode.insertBefore(fragment, posNode);
    
            for (let idx in this.renderNodes) {
                if (this.renderNodes[idx].render != null && typeof (this.renderNodes[idx].render.adjustPosition) != "undefined") {
                    this.renderNodes[idx].render.adjustPosition();
                }
            }
    
            this.clearInsertPoint();
        }

    }

    buildInsertPoint() {
        this.nodeInsertPoint = document.createElement('do-do-point');
        this.nodeInsertPoint.hidden = true;
        this.nodeInsertPoint.innerText = "insert point";
        this.nodeInsertPoint.dataset.uuid = this.nodeInsertPointUUID;
        this.targetTemplate.parentNode.insertBefore(this.nodeInsertPoint, this.targetTemplate.nextSibling);
    }

    clearInsertPoint() {
        if (this.nodeInsertPoint != null) {
            this.targetTemplate.parentNode.removeChild(this.nodeInsertPoint);
            this.nodeInsertPoint = null;
        }
    }

    clearRenderNodes() {
        for (let idx in this.renderNodes) {
            let renderNode = this.renderNodes[idx];
            renderNode.parentNode.removeChild(renderNode);
            if (typeof (renderNode.destory) != "undefined") {
                renderNode.destory();
            }
        }
        this.renderNodes = [];

    }

    push(v) {
        this.renderNodes.push(v);
    }

    /**
     * @param {Node[]} in_array
     */
    set nodes(in_array = []) {
        if (in_array == null) {
            return;
        }
        this.clearRenderNodes();
        this.renderNodes = [...in_array];
    }

    get nodes() {
        return this.renderNodes;
    }
}

export default TemplateRender;