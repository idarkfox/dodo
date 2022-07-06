/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-07-05 00:09:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-05 00:33:18
 */
'use strict'



import TemplateDodo from "./template/template-dodo.js"

/**
 * zh-CN:   传统的js导入方式。
 * 
 * en:      Traditional JS import method.
 * 
 * <script defer type="module" src="javascripts/traditional-import.js"></script>
 */
window.addEventListener("load",function(){
    TemplateDodo.init();
});