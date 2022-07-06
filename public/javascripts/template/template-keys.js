/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-18 21:32:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-05 00:12:26
 */
'use strict'

let index = 0;
let state = 0;
class TemplateKeys{

    static statements = [
        {
            "level":index++,
            keys:['context','fetch','sse'],
            state:[]
        },
        {
            "level":index++,
            keys:['tag','cmd'],
            state:[]
        },
        {   
            "level":index++,
            keys:['for','in','if','elseif','case','when','else'],
            state:[]
        }
    ];

    static statementKeys = (()=>{
        let keys = [];
        Array.from(TemplateKeys.statements,item=>{
            keys = keys.concat(item.keys);
        });
        return keys;
    })();

    static properties = [];

    static contents = [
        {
            "level":index++,
            keys:[ 'html','text','svg','img' ]
        }
    ];
    static contentKeys =  (()=>{
        let keys = [];
        Array.from(TemplateKeys.contents,item=>{
            keys = keys.concat(item.keys);
        });
        return keys;
    })();

}


TemplateKeys.statements.forEach((obj,i)=>{
    obj.state = [];
    obj.keys.forEach(()=>{
        obj.state.push(++state);
    })
})

TemplateKeys.properties.forEach((obj,i)=>{
    obj.state = [];
    obj.keys.forEach(()=>{
        obj.state.push(++state);
    })
})

TemplateKeys.contents.forEach((obj,i)=>{
    obj.state = [];
    obj.keys.forEach(()=>{
        obj.state.push(++state);
    })
})




export default TemplateKeys;