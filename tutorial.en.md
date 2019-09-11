# fform: tutorial

![fform](https://habrastorage.org/webt/dz/it/sl/dzitslhry8fiqoi8jowyzsnuuy0.png "fform")

<!-- toc -->

<!-- tocstop -->

####01. Getting started, form fields
First, install the package:
```
npm install --save fform
```
_(assuming that webpack or something similar is used for building.)_

Let's create a form for user login. We consider that as a login phone number is used.

We import everything we need, styles from `fform/addon/styling`, to display form correctly and create a scheme in which we define the form fields:
```js
import * as React from 'react';
import {render} from 'react-dom';
import {FForm, elements} from 'fform';
import * as basicStyling from '../addons/styling/basic.json'
import 'fform/addon/styling/fform.css';

let schema = {
    "type": "object",
    "properties": {
        "login": {
            "type": "string",
            "title": "phone number",
            "_placeholder": "Enter phone number..."
        },
        "password": {
            "type": "string",
            "title": "password",
            "_placeholder": "Enter password...",
            "_presets": "string:$password"
        }
    }
}:
render(<FForm core={{name: "name", schema, elements: elements.extend([basicStyling])}}/>, document.querySelector('#root'));
```
The root field is of the `object` type and it sets 2 fields in the `properties` property.

By the properties of the field `login` everything is quite obvious:
- `type` defines the field type
- `title` headline of the field
- `_placeholder` is an empty field filler. (The leading `_` shows that the property is an extension and is not included in the basic JSONSchema specification.)

The fourth property `_presets` of the `password` field determines which sets of the `elements.sets` will be used to build the field. If the `_presets` property is not specified, then the `type` property is used, but only if the `type` is single-type, otherwise an exception will be thrown. 

In the root field `_presets` property is not defined, but the `type = "object"`, so `ff_presets = "object`, i.e. the set is taken from `elements.sets.object`. Similarly to the **login** field, the property `type = "string"`, so `_presets = "string"`, the set is taken from `elements.sets.string`.

In the **password** field `_presets` value is `"string:$password"`. The symbol `:` separates the sets to be combined into one. When rendering the field, the data will be taken from the `elements.sets.string` and from the `elements.sets.$password` and then merged into one object from left to right, i.e. the properties from `elements.sets.$password` will overwrite the properties with the same names from the `elements.sets.string`. The merge is deep, all nested objects are merged recursively.

Sets are conditionally divided into main (without the leading `$` in the name) and additional (with the leading `$` in the name). The main set has the property `$_widget` with React-element, the additional one has no such property, the task of the additional one is to extend and change the main set with its data. [Documentation](https://github.com/wtnm/fform/blob/master/documentation.md#structure#)

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=0).

##### 02. Using layout
Let's add the submit button to the form. We'll use the `_layout` property for this purpose:
```js
schema = {
    "type": "object",
    "_layout": {
        "$_fields": [
            "login",
            "password",
            {
                "_$widget": "button",
                "type": "submit",
                "children": ["Send"]
             }
        ]
    },
    "properties": {
		...
    }
}:
```
`ff_layout` is an object, the `$_widget` property of which is a React-element, which will render the layer. If `$_widget` is not defined, then `div` is used by default. Properties `$_widget`, `$_maps` `$_skipKeys` are removed from the object and the rest is passed as a `props` to React-element defined in `$_widget`.

The `$_fields` property is an array and defines the order of fields and objects placement. String values are replaced by fields from the `properties` property if `type = "object` and `items` in the case of `type = "array`. If field is not found in the scheme, then it is skipped. Object values are processed in the same way as `_layout` and can have the property `$_fields`, which allows you to define layers with the required nesting level (recursively).

The `$_maps` property is used to transfer data from the form state to the components, [see documentation](https://github.com/wtnm/fform/blob/master/documentation.md#_maps).

In this case, `_layout` is passed to the object that has only one property `$_fields` defining the order of fields and objects. `$_widget` is not defined, so `div` is used to output data.

The `login` and `password` fields define their order, then the object that defines the send button. The `$_widget` property of this object has an HTML tag `button`, property `type` equal to `submit` and children is array with one text element `Send`, and this all will be rendered into the next HTML code `<button type="submit">Send</button>`. 

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=1).

#### 03. Styles and nested layout
Improve our form by adding a reset button and an additional nested layer to display these buttons in a line:
```js
schema = {
    "type": "object",
    "_layout": {
        "$_fields": [
            "login",
            "password",
            {
            	"className": {"inline": true},
                "$_fields": [
                    {
                        "_$widget": "button",
                        "type": "submit",
                        "children": ["Send"]
                    },
                    {
                        "_$widget": "button",
                        "type": "reset",
                        "children": ["Clear"]
                    }
                ]
            }
        ]
    },
    "properties": {
		...
    }
}:
```
Now at the 3rd position there is an object with the property `$_fields`. `$_widget` is not defined, so by default `div` is used. The `className` property is preprocessed by the `elements._$cx` function before being passed to the `_$widget`. Its work is described in [documentation](https://github.com/wtnm/fform/blob/master/documentation.md#cx). In `$_fields` there are 2 objects (their processing is described in the previous step), which are passed to `_$widget` as childen. As a result, the following HTML code is rendered: `<div class="inline"><button type="submit">Send</button><button type="reset">Clear</button></div>`. 

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=2).

#### 04. Component extension
Let's look at a way to extend the `elements` objects. In each object you can declare the property `$_ref`. The value of this property must be one or more references to the `elements` kind of `^/...` separated by the symbol `:`. Objects that contain `$_ref` are processed in the following way: first, all objects by reference are collected in `$_ref`, and then all collected objects and the current object without the `$_ref` property are combined into one. This mechanism is used for the entire `elements` object, as well as for the scheme properties `ff_layout`, `ff_custom`, `ff_validators`, `ff_dataMap`, `ff_oneOfSelector`. 

For example, let's say `elements = {"one":{"two":{"three":4, "more":5}}}`, then `ff_layout = {"$_ref":"^/fn/one:^/fn/one/two", "two":{"three":0}, "more":1}` will be combined into the following object: `{"three":4, "more":1 {"two":{"three":0, "more":5}}}`

The basic `elements` already contains frequently used form objects ([see documentation](https://github.com/wtnm/fform/blob/master/documentation.md#parts)). Let's rewrite `ff_layout` using them `^/parts/Submit` and `^/parts/Reset`:
```js
...
"_layout": {
    "$_fields": [
        "login",
        "password",
        {
            "className": {"inline": true},
            "$_fields": [
                {"$_ref": "^/parts/Submit", "children": ["Send"]},
                {"$_ref": "^/parts/Reset", "children": ["Clear"]}
            ]
        }
    ]
}
...
```
When processing `{"$_ref": "^/parts/Submit", "children": ["Send"]}` will take the object by reference `elements.parts.Submit`, then it will be merged with the object `{"children": ["Send"]}}`, and then it will be processed as described in the previous step. 

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=3).

####05: Using data handlers
Let's add an input mask for the `login` field of the `XXX-XXX-XXXX` kind. To do this, let's define the functions that will format and parse the field value and add them to `elements`. Pay attention to the functions that return the obtained array of arguments, changing only the very first one. This is due to the peculiarities of using [data handlers](https://github.com/wtnm/fform/blob/master/documentation.md#data-handlers).
```js
...
elements.extend([{
    fn:{
		formatPhone(value, ...args){
            let a = value.substr(3, 3);
    	    let b = value.substr(6, 4);
	        return [value.substr(0, 3) + (a ? '-' + a : '') + (b ? '-' + b : ''), ...args]
        },
        parsePhone: (value, ...args) => [value.replace(/\D+/g, '').substr(0,10), ...args]
	}
}])
...
```

Next, we use the `_custom` property to customize the specific field to our requirements. The field is composed of several blocks (`Main`, `Title` and others, [details in the documentation](https://github.com/wtnm/fform/blob/master/documentation.md#customization)) from which we need a block `Main` rendering directly `input`. In this block we are interested in properties `onChange` and `$_maps `.

`$_maps` is an object that defines what properties to throw from state to component, and it is possible to use [data handler](https://github.com/wtnm/fform/blob/master/documentation.md#data-handlers) to change them ([see documentation](https://github.com/wtnm/fform/blob/master/documentation.md#_maps)). We use this to add a handler for the `value` property (now the value from state is simply passed to the property of the component, without processing)
```js
schema = {
	,,,
    "properties": {
    	"login": {
			...
            "_custom":{
            	"Main":{
                	"$_maps":{
                    	"value": {"$":"^/fn/formatPhone", "args":["@/value"]}
                    }
                }
            }
        },
		...
    }
}:
```
Let's move on to the `onChange` property. Now the following handler `{"$" is used here: "^/fn/eventValue|^/fn/setValue"}`. The handler receives an event that passes the functions `elements.fn.eventValue`. This function takes the value `event.target.value` from the event and passes it instead of the next function. All other arguments (if any) are passed without changes. `setValue` uses [API](https://github.com/wtnm/fform/blob/master/documentation.md#api) to change the state and change the field value to the passed one. 

Let's change the `onChange` property by adding a `eventValue` and `setValue` parser between it.
```js
schema = {
	,,,
    "properties": {
    	"login": {
			...
            "_custom":{
            	"Main":{
                	"onChange":{"$": "^/fn/eventValue|parsePhone|setValue"},
					...
                }
            }
        },
		...
    }
}:
```
Now our parser receives arguments from `eventValue`, removes everything from the very first argument that is not numbers and passes them on to `setValue`.

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=4)


#### 06. The use of _stateMaps 
Let's add a link to recover the password and make it illuminated when the phone number is entered in full.

Specify the function to get the length of the transmitted value and the function to recover the password.
```js
...
elements.extend([{
    fn:{
		...
        getLength: (value, ...args) => [value ? value.length : 0, ...args],
        restorePass(){
        	let login = this.get("./login@value");
            if (login && login.length == 10) alert('Password sent to number ' + login)
			else alert('Please enter full number')
        }
	}
}])
...
```
Next, use the `_stateMaps` property to pass the value from the `login` field to the root field, and set the data handler to check whether the value has a length of 10 or not. Also, set `_params.liveUpdate` to `true` so that the data fields are immediately updated without waiting for the input's focus to be lost.
```js
schema = {
	,,,
    "properties": {
    	"login": {
			...
             "_params": {"liveUpdate": true},
            "_stateMaps": [{
            	"from": "./@/value",
                "to": "../@/params/activated",
                "$": "^/fn/getLength|equal",
                "args": ["${0}", 10]
            }]
        },
		...
    }
}:
```


Let's take a closer look at `_stateMaps`. Property `from` - a way from where value is taken (the relative paths beginning with `.` and `...` [more in detail about paths in the documentation](https://github.com/wtnm/fform/blob/master/documentation.md#path)) are supported). Further this value is transferred to the handler (if it is set), and then result is transferred on a way specified in property `to `.

In this example, the value of `value` is taken from the [data object](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) of the current field (`login`) and transmitted to the `params.activated` [data object](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) of the parent field. In this case, the data handler is preliminarily used, which passes 2 arguments to the input of the first function (`elements.fn.getLength`): `${0}` is replaced by the 0-th argument, which was received by the handler (this value is from `from`), and the number `10`. `getLength` will replace the value by its length, and number 10 will be passed on without change. The `elements.fn.equal` function compares the 0th argument with all the others and if there is even one match, it returns `true`, otherwise `false`. 

As a result, in the `params.activated` [data object](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) of the root field will be `true` if the length of the field `login` is 10 and `false` in any other case. Now it is necessary to add the reference and to throw in in it the data from `params.activated` [data object](https://github.com/wtnm/fform/blob/master/documentation.md#data-object). Insert it after the `password` field:
```js
schema = {
    "type": "object",
    "_layout": {
        "$_fields": [
            "login",
            "password",
            {
                "_$widget": "a",
                "href": "#",
                "className": {"grayed": true},
                "onClick": {"$": "^/fn/restorePass"},
                "children": ["Restore password"],
                "$_maps": {
                	"className/activated": "@/params/activated"
                }
             },
             ...
        ]
    },
    "properties": {
		...
    }
}:
```
Don't forget to add reference classes to the css.

```css
.grayed {
    color: #aaa;
}

.activated {
    color: #2667FF;
}
```

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=5).

#### 07. Expansion and combination of schemes
Let's add the possibility of registration to the form.
We will display the fields in a separate layer, and transfer the scheme to `definitions.login` and create a link to it in the root element:
```js
schema = {
	"definitions": {
    	"loginForm": {
        	"type": "object",
            "_layout": {
                "$_fields": [
                    {
                    	"$_fields": ["login", "password"]
                    },
                    ...
                ]
            },
            "properties": {
                ...
            }
        }
    },
	"$ref": "#/definitions/loginForm"
}:
```
Now using the properties `oneOf` and `allOf` let's add a registration form, expanding the form login.
```js
schema = {
	"definitions": {
		...
    },
	"oneOf": [
    	{"$ref": "#/definitions/loginForm"},
        {
        	"allOf": [
            	{"$ref": "#/definitions/loginForm"},
                {
                	"_layout": {
                        "$_fields": {
                            "0": {
                                "$_fields": [
                                	"login",
                                    "email",
                                    {
                                    	"className": {"fform-inline": true}
                                    	"$_fields":["password", "confirm"]
                                    }]
                            },
                            "2": false
                        }
                    },
                   "properties": {
                		"confirm": {
                        	"type": "string",
                            "title": "confirm",
                            "_placeholder": "Confirm password...",
                            "_presets": "string:$password:$inlineTitle"
                         },
                         "email": {
                        	"type": "string",
                            "title": "E-mail",
                            "_placeholder": "Enter email...",
                            "_presets": "string:$inlineTitle"
                         }
            		}
                }
            ]
        }
    ]
}:
```
In the `oneOF` property we have set 2 schemes, the first (index `oneOf = 0`) repeats the form `definitions.login`, and the second (index `oneOf = 1`) expands it using the property `allOf`. The extended form adds 2 new properties `confirm` and `email`, changes the order of outputting fields in `_layout._fields[0]` and deletes the link of password recovery in `_layout._fields[1]`. Note that `_layout._fields` is not an array, but an object. This is done to ensure that the `definitions.login` 0 and 2 elements are replaced and the 3-rd (with submit and reset buttons) remains untouched when merged with the `definitions.login`. Merger in `fform` is implemented so that if the left object is an array, and the right object is not, then when you merge the type of the left object (array) is preserved, so this trick and is possible. The _(1st element is the `password` field, it can be left unchanged, because now this field is displayed earlier in the 0th element, and when the 1st element is displayed, the field will be skipped, because the object's fields are rendered no more than once)_

Now that we have 2 form options for login (oneOf = 0) and registration (oneOf = 1), let's add the ability to switch between them. Remove the socket button (it is not really needed) and instead add a switch before the send button.

```js
schema = {
	"definitions": {
    	"loginForm": {
        	"type": "object",
            "_layout": {
                    ...
                    {
                    	"className": {"inline": true},
                        "$_fields": [
                        	{
                            	"$_ref": "^/parts/Button", 
                            	"children": [],
                                "onClick": {
                                	"$": "^/fn/setValue",
                                    "args": [
                                    	{"$": "^/fn/iif", "args": ["@oneOf", 0, 1]},
                                        {"path": "./@oneOf"}
                                    ]
                                },
                                "$_maps": {
                                	"children/0": { "$": "^/fn/iif",
                                    "args": ["@oneOf", "Back to login form", "Register"]}
                                }
                            },
                            {"$_ref": "^/parts/Submit", "children": ["Send"]}
                        ]
                    }
                ]
            },
            "properties": {
                ...
            }
        }
    },
	...
}:
```


The `elements.fn.iif` function takes 3 arguments if the 0th true returns the 1st, otherwise the 2nd. In this example, the 0th argument passes the value of the index `oneOf` and if it is equal to 0 (login form), we display the text of the switch button as `Register`, and if it is equal to 1 (registration form) then `Log in`.

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=6).

##### 08. Using _oneOfSelector
So, we have a form of login and registration with switching between these modes and everything seems to be fine, but there is a small problem. If you switch to the registration form and then back, when you send the data, you will find that the structure of the data corresponds to the form of registration, not the login (you can check by switching between the modes and pressing submit). Why did this happen? When switching to the registration mode, the data object of the form was extended according to the registration scheme. But when the mode was switched back added fields were not deleted, because `fform` saves data when switching the property `oneOf` if the type of field does not change or if the current scheme does not have it. 

You can set the `additionalProperties` property of the root field to `true`. Then superfluous properties which are not described by the scheme will be deleted. But we want that the data at switching did not leave, therefore we realise other variant of definition to what scheme the data concern. We will add the latent field `oneOf ` in which we will broadcast value `oneOf ` a root field.
```js
schema = {
	"definitions": {
    	"loginForm": {
        	"type": "object",
			...
            "properties": {
                ...
                "oneOf":{
                	"type": "integer",
                    "_params": {"hidden": true},
                    "_stateMaps": {"from": "../@/oneOf", "to": "./@/value"}
                }
            }
        }
    },
	...
}:
```
Now we have a field where you can define the current mode. And this field will be very useful for us. The matter is that at definition of what index `oneOf ` should be applied at installation of value of the form `ffom ` is guided by type of value. I.e. schemes `oneOf ` are searched, until the scheme with type corresponding to type of the transferred value will not be found. But if we have, as in this example, several schemes `oneOf ` with the same type (in this example, this type of `object `), the type with a smaller index will always be selected. It is to resolve such collisions that the `_oneOfSelector` property is added to the scheme, in which the function that receives the value and returns the `oneOf` index to which this value refers should be specified. Let's use it privately:
```js
elements.extend([{
    fn:{
		...
        oneOfGetter: (value) => value ? value.oneOf : 0,
}]);
schema = {
	"definitions": {
    	"loginForm": {
			"_oneOfSelector": "^/fn/oneOfGetter",
			...

        }
    },
	...
}:
```
Here all is redistributed simply, our object has property `oneOf ` which corresponds to the used scheme, it and we return. Now, when we will set value of the form (at initialisation or by means of API, it is not important), the scheme `oneOf ` at us will be chosen correctly.

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=7).

##### 09. Validation
It's time to add validation, which in `ffrom` 4 types: JSON, sync, async, sybmit. Let's start with JSON. Let's connect JSON-validator and add a simple pattern of checking e-mail:
```js
...
import imjvWrapper from 'fform/addons/imjvWrapper';
import * as imjvValidator from 'fform/addons/is-my-json-valid-lite';
const JSONValidator = imjvWrapper(imjvValidator);
...
schema = {
	...
	"oneOf": [
    	{
            "allOf": [
                {"$ref": "#/definitions/loginForm"},
                {"properties": {"oneOf": {"minimum": 0, "maximum": 0}}}
            ]
        },
        {
        	"allOf": [
            	{"$ref": "#/definitions/loginForm"},
                {
					...
                   "properties": {
						...
                         "email": {
                        	...
                            "pattern": "\\S+@\\S+\\.\\S+"
                         },
                         "oneOf": {"minimum": 1, "maximum": 1}
            		}
                }
            ]
        }
    ]
}:

render(<FForm core = {{name:"name", schema, elements, JSONValidator}}/>, document.querySelector('#root'));
```
It's done. Also, the validation for the minimum and maximum value of the field `oneOf` has been added. Now JSON validation passes only if this value is 0 for login form and 1 for registration form. 

Now let's add a password match check in the `password` and `confirm` fields. This should be done at the root level:
```js
...
elements.extend([{
	...
    validators:{
		testPasswords(value){
        	let result = {path: './confirm', data: ''}
        	if (value.password !== value.confirm) result.data = 'Passwords not match';
            return result;
        }
	}
}])
schema = {
	...
	"oneOf": [
    	...
        {
        	"allOf": [
            	{"$ref": "#/definitions/loginForm"},
                {
					"_validators": ["^/validators/testPasswords"],
                    ...
                }
            ]
        }
    ]
}:
...
```
Set the `_validators` property for the root field so that the `elements.validators.testPasswords` function gets the entire data object. The function we defined checks passwords for matches and returns the object to the `path` and `data` properties. The `path` property defines the field in which the message will be written, and `data` is the error text. More in detail about a format of returned value it is possible to learn in [documentation](https://github.com/wtnm/fform/blob/master/documentation.md#_validators).

Now we will make emulation of asynchronous check of phone number:
```js
...
elements.extend([{
	...
    validators:{
    	...
		async testPhoneNumber(value){
        	return value === '1234567890'? 'Номер уже существует' : '';
        }
	}
}])
schema = {
	...
	"oneOf": [
    	{"$ref": "#/definitions/loginForm"},
        {
        	"allOf": [
            	{"$ref": "#/definitions/loginForm"},
                {
                	"properties": {
						"login": {"_validators": ["^/validators/testPhoneNumber"]}
                    	...
                    }
                    ...
                }
            ]
        }
    ]
}:
...
```
Everything is very simple, instead of synchronous function, asynchronous, the field `login` is added validator. Since the validator is set in the extended scheme (index `oneOf` = 1), it will work only in the registration form mode.

And now let's add emulation of captcha check when submitting the form:
```js
...
elements.extend([{
	...
    submits:{
    	...
		async testCaptcha(event, value, form){
        	event.preventDefault();
        	if(value.captcha === '12345') {
                alert(value)
                return {}
            }
            return {captcha: 'Wrong captcha'};
        }
	}
}])
schema = {
	...
	"oneOf": [
    	{"$ref": "#/definitions/loginForm"},
        {
        	"allOf": [
            	{"$ref": "#/definitions/loginForm"},
                {
                	"_layout": {
                        "$_fields": {
                            "0": {
                                "$_fields": [
                                	...
                                    {"children": ["captcha to display here: 12345"]},
                                    "captcha"
                                    ]
                            },
                            "2": false
                        }
                    },
                	"properties": {
						"captcha": {
                        	"type": "string",
                            "title": "Captcha",
                            "_placeholder": "Enter captcha...",
                            "_presets": "string:$inlineTitle"
                        }
                    	...
                    }
                    ...
                }
            ]
        }
    ]
}:
...
render(<FForm core = {{name:"name", schema, elements, JSONValidator}} onSubmit="^/submits/testCaptcha"/>,
document.querySelector('#root'));
```
The `onSubmit` function can return the object with the error text for the corresponding fields. If an empty object is returned, there are no errors.

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=8).

#### 10. Own components
Suppose we want to select several tags from a list when registering. If data requirements to the data not too difficult it is possible to use built in input's `fform `. However, if extended functionality is required, you will most likely need to use a third-party input. Let's demonstrate how to do this by integrating the react-select component into the form. First, let's install it.
```js
npm install --save react-select
```
Now let's extend elements by adding a new grid and functions to transfer values from component to state and back.
```js
import Select from 'react-select';
...
elements.extend([{
  widgets: {
    reactSelect: Select
  },
  fn: {
  	...
    reactSelectParse: function (values) {
      if (values === null) {
        if (this.$branch[Symbol.for('FFormData')].fData.type === 'array') return [[]];
        return null;
      }
      if (!Array.isArray(values)) return values.value;
      return [values.map((item) => item.value)]
    },
    reactSelectValue: function (values = []) {
      if (!Array.isArray(values)) return values ? [{value: values, label: values}] : [];
      return [values.map((value) => {return {value, label: value}})]
    },
  },
  sets: {
    reactSelect: {
      $_ref: '^/sets/simple',
      Main: {
        _$useTag: '^/widgets/reactSelect',
        onChange: {$: '^/fn/reactSelectParse|setValue|liveUpdate'},
        $_maps: {
          isDisabled: '@/params/disabled',
          value: {$: '^/fn/reactSelectValue', args: ['@/value']},
          options: {$: '^/fn/reactSelectValue', args: ['@/fData/enum']},
        },
      },
    },
  }
}])
```
The `reactSelectParse` function converts data from the `react-select` format to the `fform` format and `reactSelectValue` function conversely. We add the `reactSelect` grid, and use the `simple` grid (the base grid for displaying inputs) as a basis. The `$_widget` react-component does not change, because the current one can work with other React-components using the `_$useTag` property, and we use it by passing `react-select` in it. Change `onChange` by setting the parser from the `react-select` format first. Then `setValue` updates the data in state. The `liveUpdate` function makes the update work as if liveUpdate were enabled without waiting for the input focus to be lost, which is what the select-component is expected to do.

`$_maps` throws data from state to component according to `react-select` documentation and converts the data into understandable `react-select` format. In `@/fData/enum` the listed value from the scheme property `enum` is stored, and in `@/fData/enumExten` expansion for listed value from the scheme property `_enumExten`, [details in the documentation](https://github.com/wtnm/fform/blob/master/documentation.md#extended-schema-properties).

It is time to add a new element to the scheme:
```js
schema = {
	...
	"oneOf": [
    	{"$ref": "#/definitions/loginForm"},
        {
        	"allOf": [
            	{"$ref": "#/definitions/loginForm"},
                {
                	"_layout": {
                        "$_fields": {
                            "0": {
                                "$_fields": [
                                	...
                                    "subs"
                                    ...
                                    ]
                            },
                            "1": false
                        }
                    },
                	"properties": {
						...
                        "subs": {
                          "type": "array",
                          "title": "Some subs",
                          "_presets": "reactSelect:$inlineTitle",
                          "_simple": true,
                          "_placeholder": "Select subs...",
                          "_custom": {
                              "Body": {"className": {"react-select": true}},
                              "Main": {"isMulti": true}
                          },
                          "enum": ["one", "two", "three", "four", "five", "six", "seven", "eight"]
                        }
                    }
                    ...
                }
            ]
        }
    ]
}:
```
Since we use a multiselect (using `_custom` passed the parameter `isMulti` to `react-select`), we set the field type `array` and set the default `_simple` to true, so that `fform` handles this field as a simple one (nested fields are not created and the data object is formed differently), i.e. all data management is given to the component, and `fform` just receives/transmits value. The `_enumExten` property specifies the listed values (features of using `enum` and `_enumExten` [described in the documentation](https://github.com/wtnm/fform/blob/master/documentation.md#extended-schema-properties)), but `_preset` indicates the grid that we defined in `elements`.

[Final result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=9).

##### References

- [Github repository](https://github.com/wtnm/fform)
- [Installation and use](https://github.com/wtnm/fform#installation--usage)
- [Examples](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=0)
- [Documentation](https://github.com/wtnm/fform/blob/master/documentation.md)