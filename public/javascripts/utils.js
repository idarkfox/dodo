/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-19 04:43:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 03:46:51
 */

'use strict'

class Utils {
    static BuildUUID(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };

    /**
     * zh-CN:   这是一个模拟"group" (array.prototype.group)的实现。
     * 
     * en:      This is an implementation of the simulated "group" (array.prototype.group).
     * 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group MDN Array.prototype.group()}
     * @see {@link https://tc39.es/proposal-array-grouping/#sec-array.prototype.group TC39 #sec-array.prototype.group}
     * 
     * @param {Array|HTMLCollection|NodeList} colls 
     * @param {Function} callback 
     * @returns 
     */
    static GroupBy(colls,callback){
        let array = [...colls];
        let group = {};
        array.forEach(ele=>{
            let key = callback(ele);
            if(key){
                (group[key]?group[key]:group[key]=[]).push(ele);
            }
        })
        return group;
    }

}

export default Utils;