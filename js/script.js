
//Contructor Validator
function Validator(options){

    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }


    var selectorRules = {};
    function Validate(inputElement, rule){
        //var errorElement = getParent(inputElement, '.form-item')
        var errorMessage;
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorMessage)            
        
        var rules = selectorRules[rule.selector];
        for(var i = 0 ; i < rules.length ; ++i){
            switch(inputElement.type){
                case 'radio':

                    case 'checkbox':
                        errorMessage = rules[i](
                            formElement.querySelector(rule.selector + ':checked'));
                        break;
                        default:
                            errorMessage = rules[i](inputElement.value);
            }
           
           if(errorMessage) break;
        }


        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement,options.formGroupSelector).classList.add('invalid')
        }
        else{
            errorElement.innerText = '';
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage;
    }
    
    var formElement = document.querySelector(options.form);
    if(formElement){
        //submit form
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isFormValid = true;

        //validate when click submit without fill form
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = Validate(inputElement,rule)
                if(!isValid)
                {
                    isFormValid = false;
                }

                
            });
            

            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values,input){
                       switch(input.type){
                           case 'radio':
                            case 'checkbox':
                                if(input.matches(':checked')){

                                }
                                
                                break;
                                default:
                                
                       }
                        
                        return  values;
                    },{});
                    options.onSubmit(formValues);
                } 
                else{
                    formElement.submit();
                } 
            }
          
        }
        
    }
    
    if(formElement){
        options.rules.forEach(function(rule){
            //Save rule for each selector
             
            
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }
            else{
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElements = formElement.querySelectorAll(rule.selector)

            Array.from(inputElements).forEach(function(inputElement){
                inputElement.onblur = function(){
                    Validate(inputElement,rule)
                }
            
            inputElement.oninput = function(){
                var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorMessage)            
                errorElement.innerText = '';
                getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                }
            });
        });
    }
    
}
//Define Rules
Validator.isRequired = function(selector,message){
    return{
        selector:selector,
        test: function(value){
            return value ? undefined : message ||  'Please fill this form'
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