/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-19 23:55:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-03 21:07:39
 */

/**
 * roadmap:
 * 1.Edit in web browser;
 * 2.build result to server;
 * 3.edit result to vscode ${file-name}-dodo-edit.${file-suffix}
 */


'use strict'


import Utils from "./utils.js";


class ComponentEdit extends HTMLElement{
    static tagName              = "dodo-edit";
    static MENU_LISTEN_EVENT    = 'mouseup';
    static WIREFRAME_OFFSET     = 0;
    static BORDER_WIDTH         = 0;

    static BORDER_COLOR         = 'rgba(153,153,255,0.8)';//'#9999FF';
    static BG_COLOR             = 'rgba(102,153,255,0.5)';

    targetElements;
    targetEvents = new Map();
    wireframe_select;
    selectElement;

    ctrlKey = false;
    constructor(){
        super();
        let self = this;

    
        this.targetElements                         = null;
        this.wireframe_select                       = document.createElement('div');
        // this.wireframe_select.style.boxSizing       = 'border-box';
        this.wireframe_select.style.position        = 'absolute';
        this.wireframe_select.style.borderStyle     = 'solid';
        this.wireframe_select.style.borderColor     = ComponentEdit.BORDER_COLOR;

        this.wireframe_select.style.backgroundColor = ComponentEdit.BG_COLOR;
        this.wireframe_select.style.minWidth        = ComponentEdit.BORDER_WIDTH+'px';
        this.wireframe_select.style.minHeight       = ComponentEdit.BORDER_WIDTH+'px';
        this.wireframe_select.style.zIndex          = '2';
        this.wireframe_select.hidden                = true;

        this.wireframe_select.oncontextmenu = ()=> false;

        this.wireframe_select.addEventListener('dblclick',(e)=>{
            console.log(e);
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        });
        this.wireframe_select.addEventListener('mouseup',(e)=>{
            if(e.button==2){
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }
        });

        let keydown_event = e=>{
            self.ctrlKey = e.ctrlKey;
            window.removeEventListener('keydown',keydown_event);
        };
        window.addEventListener('keydown',keydown_event);
        window.addEventListener('keyup',e=>{
            self.ctrlKey = e.ctrlKey;
            window.addEventListener('keydown',keydown_event);
        });

        this.parentNode.insertBefore(this.wireframe_select,this.nextSibling);
    }

    get target(){
        return this.getAttribute('target');
    }

    set target(v){
        this.setAttribute('target',v);
    }

    static get observedAttributes() {
        return ['target'];
    }

    createTargetEventHandle(){
        let self = this;
        return function (event) {
            let wireframe = self.wireframe_select;
            let target = event.target;
            if(target==wireframe){
                if(!self.ctrlKey){
                    wireframe.hidden = true;
                } else {
                    let x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
                    let y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
                    let elements = document.elementsFromPoint(x, y);
                    for( let i=0;i<elements.length;i++){
                        if(elements[i]==this.selectElement && i<(elements.length-1)){
                            target = elements[i+1];
                            break;
                        }
                        if(i==elements.length-1){
                            target = elements[1];
                        }
                    }
                    // console.log(elements,target);
                }
            }
            if(target==wireframe){
                return;
            }
            
            let targetStyle = getComputedStyle(target);
            let x = target.offsetLeft;
            let y = target.offsetTop;

            this.selectElement = target;

            wireframe.hidden = false;
            wireframe.style.boxSizing = targetStyle.boxSizing;
            
            if(target.tagName.toLocaleLowerCase()!='body'){
                x -= parseInt(targetStyle.marginLeft);
                y -= parseInt(targetStyle.marginTop);
            }
            wireframe.style.left                = x + 'px';  
            wireframe.style.top                 = y + 'px';
            wireframe.style.width               = target.offsetWidth + 'px';
            wireframe.style.height              = target.offsetHeight + 'px';
            wireframe.style.borderTopWidth      = targetStyle.marginTop;
            wireframe.style.borderLeftWidth     = targetStyle.marginLeft;
            wireframe.style.borderRightWidth    = targetStyle.marginRight;
            wireframe.style.borderBottomWidth   = targetStyle.marginBottom;

            // let wirframeStyle = getComputedStyle(wireframe);

            if(event.button==2){

            }
            
        }
    }

   

    createTargetEventObject(uuid,element,handleEvent){
        let self = this;
        return {
            type:ComponentEdit.MENU_LISTEN_EVENT,
            element:element,
            'dodo-edit-uuid':uuid,
            handleEvent: handleEvent,
            destory:function(){
                this.element.oncontextmenu = ()=> true;
                this.element.removeEventListener(this.type,this);
                this.element = null;
            }
        };
    }

    update(){

        let self = this;
        this.clearEvents();

        this.targetElements =  document.querySelectorAll(this.target);

        let handleEvent = this.createTargetEventHandle();

        Array.from(this.targetElements,(element,idx)=>{
            

            let uuid = Utils.BuildUUID();
            let event_object = this.createTargetEventObject(uuid,element,handleEvent);
            element.setAttribute('dodo-edit-uuid',uuid);
            this.targetEvents.set(`${ComponentEdit.MENU_LISTEN_EVENT}-${uuid}`,event_object);
            element.oncontextmenu = ()=> false;
            element.addEventListener(ComponentEdit.MENU_LISTEN_EVENT,this.targetEvents.get(`${ComponentEdit.MENU_LISTEN_EVENT}-${uuid}`));
            
        });
    }

    clearEvents(){
        if(this.targetEvents.size>0){
            this.targetEvents.forEach((v,k)=>{
                v.destory();
            });
            this.targetEvents.clear();
        }
    }

    connectedCallback() {
        console.log("ComponentEdit");
        this.update();

    }

    disconnectedCallback(){
        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue!=null && oldValue != newValue){
            console.log("attributeChangedCallback");
            this.update();
        }
    }

    static init(){
        customElements.define(ComponentEdit.tagName, ComponentEdit);
    }
}

export default ComponentEdit;