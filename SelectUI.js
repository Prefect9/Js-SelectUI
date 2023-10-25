/*
    Author: Мистер Мир
    Tg: @id_dev9
    Varsion 1.01
*/
var SelectUI = function(select){
    if(!select || typeof select != "object" || select.constructor.name != "HTMLSelectElement") throw new Error("SelectUI: You can init only select")
    var that = this
    
    var container = document.createElement('div')
    select.parentNode.insertBefore(container, select)
    container.appendChild(select)
    container.setAttribute("data-select-ui", "")
    
    var selectedText = document.createElement('div')
    selectedText.setAttribute("data-select-ui-selected", "")
    container.appendChild(selectedText)
    
    var modal = document.createElement('div'),
        modalShowed = false
    modal.setAttribute("data-select-ui-modal", "")
    container.appendChild(modal)
    var ShowModal = function(){
        modalShowed = true
        container.setAttribute("data-select-ui-active", "")
    }
    var HideModal = function(){
        modalShowed = false
        container.removeAttribute("data-select-ui-active")
    }
    
    var optionsBlock = document.createElement('div')
    optionsBlock.setAttribute("data-select-ui-options", "")
    modal.appendChild(optionsBlock)
    
    var options = [],
        classList = []
    var PushOption = function(option){
        var html = option.getAttribute("data-html") ? option.getAttribute("data-html") : option.innerHTML,
            optionObj = { value: option.value, content: html, original: option },
            el = document.createElement("div")
        el.setAttribute("data-select-ui-option", "")
        el["SelectUI-option"] = optionObj
        el.innerHTML = html
        optionObj["el"] = el
        options.push(optionObj)
        optionsBlock.appendChild(el)
    }
    var SetOption = function(optionObj){
        select.value = optionObj.value
        select.dispatchEvent(new Event("change"))
    }
    var Update = function(){
        for(var option of options) option.el.remove()
        for(var className of classList) container.classList.remove(className)
        options = []
        classList = []
        
        for(var option of select.children) PushOption(option)
        for(var className of select.classList){
            container.classList.add(className)
            classList.push(className)
        }
        Render()
    }
    that.Update = Update
    
    var Render = function(){
        var value = select.value,
            content = ""
        for(var option of options){
            if(option.value == value){
                selectedText.innerHTML = option.content
                option.el.setAttribute("data-select-ui-option-active", "")
            }else option.el.removeAttribute("data-select-ui-option-active")
        }
    }
    
    select.addEventListener("change", Render)
    
    var FindParent = function(el, selector){
        if (Element.prototype.closest) return el.closest(selector)
        while (parent) {
            if (parent.matches(selector)) return parent
            parent = parent.parentElement
        }
        return null
    }
    document.addEventListener("click", function(e){
        var target = e.target,
            parentSelectUI = FindParent(target, "[data-select-ui]"),
            isThis = target.hasAttribute("data-select-ui") && target == container || parentSelectUI && parentSelectUI == container
        
        if(isThis){
            if(!modalShowed) return ShowModal()
            
            var parentOption = FindParent(target, "[data-select-ui-option]"),
                isOption = target.hasAttribute("data-select-ui-option") || parentOption
            if(isOption) SetOption(target.hasAttribute("data-select-ui-option") ? target["SelectUI-option"] : parentOption["SelectUI-option"]) || HideModal()
            else e.preventDefault()
        }else if(modalShowed) HideModal()
    })
    
    Update()
}
window.SelectUI = SelectUI



































































































