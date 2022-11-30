
//Contructor Validator
function Validator(options){
    var selectorRules = {};
    function Validate(inputElement, rule){
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorMessage)            
        
        //Selector's rule
        var rules = selectorRules[rule.selector];
        
        
        for(var i = 0; i < rules.length; i++){
           errorMessage = rules[i](inputElement.value)
           if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }
        else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
        
    }
   
    var formElement = document.querySelector(options.form)
    
    if(formElement){
        options.rules.forEach(function(rule){
            //Save rule for each selector
            if(Array.isArray(selectorRules[rule.selector])){

            }
            else{
                selectorRules[rule.selector] = rule.test;
            }
            
            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement){
                inputElement.onblur = function(){
                    Validate(inputElement,rule)
                }
            }
            inputElement.oninput = function(){
                var errorElement = inputElement.parentElement.querySelector(options.errorMessage)            
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid')
                }
            
        });
    }
}
//Define Rules
Validator.isRequired = function(selector,message){
    return{
        selector:selector,
        test: function(value){
            return value.trim() ? undefined : message ||  'Please fill this form'
        }
    }
}
Validator.isEmail = function(selector,message){
    return{
        selector:selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Please input your email'
        }
    }
}
Validator.minLength = function(selector,min,message){
    return{
        selector:selector,
        test: function(value){
            
            return value.length >= min ? undefined : message || `Please input at least ${min} character`
        }
    }
}
Validator.isConfirmed = function(selector,getConfirmValue,message){
    return{
        selector: selector,
        test : function(value){
            return value === getConfirmValue() ? undefined : message || `Value is not correct`;
        }
    }
}