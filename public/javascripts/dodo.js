/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-17 04:44:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 00:00:49
 */

'use strict'

import DodoBase from "./base.js"



class Dodo extends DodoBase {
    static tagName  = "do-do";
    static tags     = {};
    static clazz    = {};

    static #__loaded            = false;
    static #__loadCallBacks     = [];
    constructor() {
        super();
    }

    checkAndCallNext(next) {
        if (typeof (next) != 'undefined' && next != null) {
            next();
        }
    }

    method_use(next) {
        if (this.getAttribute("use") != null) {
            let useScriptPath = this.getAttribute("use");
            let hold = this.getAttribute("hold");
            let init = this.getAttribute("init") || true;//default
            let init_value = new Function("return " + (this.getAttribute("init-v") || null))();
            import(useScriptPath).then(Mod => {
                if (init == 'true') {
                    Mod.default.init(init_value);
                } else if (typeof (init) == 'string') {
                    Mod.default[init](init_value);
                }

                if (hold) {
                    Dodo.tags[Mod.default.tagName] = Mod.default;
                    Dodo.clazz[Mod.default.name] = Mod.default;
                }
            })
        } else {
            this.checkAndCallNext(next);
        }


    }



    connectedCallback() {
        this.method_use(void (0));

    }

    disconnectedCallback() {

    }
    adoptedCallback() {

    }
    attributeChangedCallback(name, oldValue, newValue) {

    }

    static init() {
        customElements.define(Dodo.tagName, Dodo);
        window.Dodo = Dodo;

        window.addEventListener("load",()=>{
            Dodo.#__loadCallBacks.forEach( callBackClosure=>callBackClosure());
            Dodo.#__loaded = true;
        });
        

    }
    
    /**
     * 
     * @param {Function} loadCallBackClosure 
     */
    static load(callBackClosure){
        Dodo.#__loadCallBacks.push(callBackClosure);
    }
}

Dodo.init();

export default Dodo;
