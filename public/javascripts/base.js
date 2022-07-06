/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-17 11:34:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-18 02:44:37
 */
'use strict'

class DodoBase extends HTMLElement {
  static tagName = "do-do-base";
  constructor() {
    super();
    this.hidden = true;
    this.attachShadow({ 'mode': "closed" });
  }
}
export default DodoBase;