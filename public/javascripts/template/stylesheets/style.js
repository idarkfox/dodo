/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-07-06 20:25:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-07 08:10:18
 */
'use strict'

import TemplateContext from "../template-context.js";
import TemplateDodoError from "../template-error.js";


const dodo_style_mapping = {
    
    bg:{
        color(c){
            this.style.backgroundColor = c;
        },
    },
    txt:{
        all(sa){
            
        },
        size(s){
            this.style.fontSize = s;
        },
        color(c){
            this.style.color = c;
        }
    }
}

class DodoStyle extends HTMLElement{
    
    /**
     * 
     * @param {HTMLElement} element 
     * 
     * @example data-dstyle="bg.color(x.b)"
     * 
     */
    static parse(element){
        let dstyle = element.dataset.dstyle;
        let exprs = dstyle.split(';');
        let context = TemplateContext.GetContextByNode(element).getChecked();
        let data = {};
        let dataPackage = element.dataPackage || new TemplateDataPackage({});
        let args = [TemplateContext.DODO_CONTEXT_ARG, ...dataPackage.keys()];

        //let fun = dodo_style_mapping['bg'].color.bind(element);
        //fun('red');

        exprs.forEach(expr=>{
            let methodEndPos = expr.indexOf('(');
            let methodkeys = expr.substring(0,methodEndPos).split('.');
            let valExpr = expr.substring(methodEndPos);
            let method = dodo_style_mapping;
            methodkeys.forEach(key=>{
                method = method[key];
            })
            try{
                data = new Function(args, '"use strict"; return ' + valExpr)(context.value, ...dataPackage.values() );
                (method.bind(element))(data);
            } catch(err){
                (new TemplateDodoError(err,"parse expr error from [TemplateParse.build_data]",node)).show();
            }
        })
        
        
    }



    
}

export default DodoStyle;