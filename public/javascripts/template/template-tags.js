/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-07-03 01:46:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-05 00:13:40
 */
'use strict'

import TemplateDodo from "./template-dodo.js";



function ClassBuild(tagName){

    return class extends TemplateDodo{
        static tagName = TemplateDodo.CUSTOM_TAG_NAME_PREFIX + tagName;
        constructor(){
            super();
        }
        static init(clazz){
            customElements.define(clazz.tagName, clazz);
        }
    }

}



let TemplateTagFor = ClassBuild("for");
let TemplateTagCase = ClassBuild("case");
let TemplateTagWhen = ClassBuild("when");
let TemplateTagElse = ClassBuild("else");



class TemplateTags{
    static init(){
        TemplateTagFor.init(TemplateTagFor);
        TemplateTagCase.init(TemplateTagCase);
        TemplateTagWhen.init(TemplateTagWhen);
        TemplateTagElse.init(TemplateTagElse);
    }
}


export default TemplateTags;