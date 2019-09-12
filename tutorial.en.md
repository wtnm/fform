# fform: tutorial

![fform](https://habrastorage.org/webt/dz/it/sl/dzitslhry8fiqoi8jowyzsnuuy0.png "fform")

<!-- toc -->

- [01. Getting started, form fields](#01-getting-started-form-fields)
- [02. Using layout](#02-using-layout)
- [03. Styles and nested layout](#03-styles-and-nested-layout)
- [04. Component extension](#04-component-extension)
- [05: Using data handlers](#05-using-data-handlers)
- [06. The use of _stateMaps](#06-the-use-of-_statemaps)
- [07. Expansion and combination of schemes](#07-expansion-and-combination-of-schemes)
- [08. Using _oneOfSelector](#08-using-_oneofselector)
- [09. Validation](#09-validation)
- [10. Own components](#10-own-components)
- [Link](#link)

<!-- tocstop -->

#### 01. Getting started, form fields
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

#### 02. Using layout
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
Let's look at a way to expand the `elements` objects. In each object, you can declare the `$ _ref` property. The value of this property must be one or more references to `elements` of the form` ^ / ... `separated by the`: `character. The object that contains `$ _ref` is processed as follows: first, all the objects are collected by reference in` $ _ref`, and then all collected objects and the current object without the `$ _ref` property are combined into one. This mechanism is used for the entire `elements` object, as well as for the properties of the` ff_layout`, `ff_custom`,` ff_validators`, `ff_dataMap`,` ff_oneOfSelector` scheme.

For example, let `elements = {" one ": {" two ": {" three ": 4," more ": 5}}}`, then `ff_layout = {" $ _ref ":" ^ / fn / one: ^ / fn / one / two "," two ": {" three ": 0}," more ": 1}` will be combined into the following object: `{" three ": 4," more ": 1 {" two " : {"three": 0, "more": 5}}} `

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
When processing `{" $ _ref ":" ^ / parts / Submit "," children ": [" Send "]}`, the object will be taken by the link `elements.parts.Submit`, then it will be merged with the object` {" children ": [" Send "]}}`, and after that it will be processed as described in the previous step.

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=3).

#### 05: Using data handlers
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

Next, we use the `_custom` property to customize the specific field to our requirements.The field is assembled from several blocks (`Main`,` Title` and others, [details in the documentation](https://github.com/wtnm/fform/blob/master/documentation.md#customization)) of which we need a block `Main` rendering directly` input`. In this block, we are interested in the `onChange` and` $ _maps` properties.

`$ _maps` is an object that determines which properties to forward from state to a component, while it is possible to use [data handler](https://github.com/wtnm/fform/blob/master/documentation.md#data- handlers) for changing them ([more in the documentation](https://github.com/wtnm/fform/blob/master/documentation.md#_maps)). We use this in order to add a handler for the `value` property (now the value from state is simply passed to the component property, without processing)
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
Let's move on to the `onChange` property. Now the following handler is used here: `{"$", "^/fn/eventValue|^/fn/setValue"}`. The handler receives an event that passes the functions `elements.fn.eventValue`. This function takes the value `event.target.value` from the event and passes it instead of the next function. All other arguments (if any) are passed without changes. `setValue` uses [API](https://github.com/wtnm/fform/blob/master/documentation.md#api) to change the state and change the field value to the passed one. 

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

First, specify the function to get the length of the passed value and the function to recover the password.
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


Let's take a closer look at `_stateMaps`. Property `from` - path from where value is taken (the relative paths beginning with `.` and `..` [more in detail about paths in the documentation](https://github.com/wtnm/fform/blob/master/documentation.md#path)) are supported). Further this value is transferred to the handler (if it is set), and then result is transferred to the path specified in property `to `.

In this example, the value of `value` is taken from the [data object](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) of the current field (`login`) and transmitted to the `params.activated` [data object](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) of the parent field. In this case, the data handler is preliminarily used, which passes 2 arguments to the input of the first function (`elements.fn.getLength`): `${0}` is replaced by the 0-th argument, which was received by the handler (this value is from `from`), and the number `10`. `getLength` will replace the value by its length, and number 10 will be passed on without change. The `elements.fn.equal` function compares the 0th argument with all the others and if there is even one match, it returns `true`, otherwise `false`. 

As a result, in the `params.activated` [data object](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) of the root field will be `true` if the length of the field `login` is 10 and `false` in any other case. Now it is necessary to add the link and map to it the data from `params.activated` [data object](https://github.com/wtnm/fform/blob/master/documentation.md#data-object). Insert it after the `password` field:
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
Don't forget to add classes to the css for the link.

```css
.grayed {
    color: #aaa;
}

.activated {
    color: #2667FF;
}
```

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=5).

#### 07. Expansion and combination of schemes
Let's add the possibility of registration to the form.
We will display the fields in a separate layer, transfer the scheme to `definitions.login` and create a link to it in the root element:
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
In the `oneOF` property, we defined 2 schemes, the first (` oneOf = 0` index) repeats the `definitions.login` form, and the second (` oneOf = 1` index) extends it using the `allOf` property. 2 new properties `confirm` and` email` are added to the extended form, the order in which fields are displayed in `_layout._fields [0]` is changed, and the password recovery link in `_layout._fields [1]` is deleted. Note that `_layout._fields` is not an array, but an object. This is done so that when merging with `definitions.login`, the 0th and 2nd elements are replaced, and the 3rd (with the submit and reset buttons) remains untouched. Merging in `fform` is implemented in such a way that if the left object is an array and the right object is not, then when combining the type of the left object (array) is preserved, therefore such a trick is possible. _ (The 1st element is the `password` field, it can be left unchanged, since now this field is displayed earlier, in the 0th element, and when the 1st element is displayed, the field will be skipped, since the fields of the object are not rendered more than once) _

Now that we have 2 form options for login (oneOf = 0) and registration (oneOf = 1), let's add the ability to switch between them. Remove the reset button (it is not really needed) and instead add a switch before the send button.

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

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=6).

#### 08. Using _oneOfSelector
So, we have a login and registration form with switching between these modes and everything seems to be fine, but there is a small problem. If you switch to the registration form and then back, then when sending data, it will be found that the data structure corresponds to the registration form, and not to the login (you can check by switching between modes and clicking submit). Why did it happen? When switching to the registration mode in the data object, the form was expanded in accordance with the registration scheme. But when the mode was switched back, the added fields were not deleted, because `fform` saves data when the` oneOf` property is switched if the type of the field does not change or if it is not in the current scheme.

You can set the `additionalProperties` property of the root field to` true`. Then unnecessary properties that are not described by the circuit will be deleted. But we want the data to not be deleted when switching, so we will implement another option for determining which scheme the data refers to. Add the hidden field `oneOf` to which we will translate the value of the` oneOf` of the root field.
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
Now we have a field by which you can determine the current mode. And the field is very useful to us. The fact is that when determining which `oneOf` index should be used when setting the value of the form,` ffom` focuses on the type of value. Those. `oneOf` schemes are scanned until a scheme with a type matching the type of the passed value is found. But if, as in this example, we have several `oneOf` schemes with the same type (in this example, this type is` object`), then the type with the lower index will always be selected. Namely, to resolve such collisions, the `_oneOfSelector` property was added to the scheme, in which a function should be set that receives a value and returns the` oneOf` index to which this value refers. We use this property:
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
Everything is simple here, our object has the `oneOf` property, which corresponds to the scheme used, and we return it. Now, when we will set the value of the form (during initialization or using the API, it does not matter), the `oneOf` scheme will be chosen correctly.

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=7).

#### 09. Validation
The time has come to add validation, of which there are 4 types in ffrom: JSON, sync, async, sybmit. Let's start with JSON. Connect the JSON validator and add a simple email verification pattern:
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
Done. Validation was also added for the minimum and maximum values of the `oneOf` field. Now JSON validation passes only if this value is 0 for the login form and 1 for the registration form.

Now we add the password matching check in the `password` and` confirm` fields. This should be done at the root field level:
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
We set the `_validators` property for the root field so that the` elements.validators.testPasswords` function receives the entire data object. The function that we defined checks the passwords for coincidence and returns an object with the properties `path` and` data`. The `path` property determines the field in which the message will be written, and` data` is the error text. For more information about the format of the return value, see [documentation] (https://github.com/wtnm/fform/blob/master/documentation.md#_validators).

Now let's emulate the asynchronous verification of the phone number:
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
Everything is extremely simple, instead of a synchronous function, asynchronous, a validator is added to the login field. Since the validator is specified in the extended scheme (index `oneOf` = 1), then it will work only in the registration form mode.

Now add the captcha verification emulation when submitting the form:
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
The `onSubmit` function can return an object with error text for the corresponding fields. If an empty object is returned, then there are no errors.

[Current result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=8).

#### 10. Own components
Suppose we want to select several tags from a list during registration. If the data requirements are not too complicated, then you can use the built-in `fform` inputs. However, if advanced functionality is required, then most likely you will need to use third-party input. We demonstrate how to do this by integrating the react-select component into a form. First install.
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
The `reactSelectParse` function converts data from the` react-select` format to the `fform` format, while` reactSelectValue` does the opposite. Add a set of `reactSelect`, as a basis it uses a set of` simple` (a basic set for displaying inputs). The React component in `$ _widget` does not change, since the current one can work with other React components using the` _ $ useTag` property, and we use it by passing in it `react-select`. Change `onChange` by setting the first parser from the` react-select` format. After that, `setValue` updates the data in state. The function `liveUpdate` makes the update work as if liveUpdate was turned on, without waiting for the input to lose focus, this is exactly the behavior that is expected from the select component.

`$ _maps` forwards the data from state to the component, in accordance with the` react-select` documentation and translates the data into an understandable `react-select` format. In `@ / fData / enum` the enumerated value from the` enum` schema property is stored, and in `@ / fData / enumExten` the extension for the enumerated value from the` _enumExten` schema property, [more in the documentation] (https: // github. com / wtnm / fform / blob / master / documentation.md # extended-schema-properties).

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
Since we use multiselect (using `_custom` we passed the parameter` isMulti` to `react-select`), we set the field type to` array` and set the `_simple` property to true so that` fform` treats this field as simple ( nested fields are not created and the data object is formed differently), i.e. all data management is given to the component, and `fform` just receives / passes the value. The `_enumExten` property sets enumerated values ​​(specifics of using` enum` and `_enumExten` [described in the documentation] (https://github.com/wtnm/fform/blob/master/documentation.md#extended-schema-properties)) , but `_preset` points to the set that we defined in` elements`.

[Final result](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=9).

#### Link

- [Github repository](https://github.com/wtnm/fform)
- [Installation and use](https://github.com/wtnm/fform#installation--usage)
- [Examples](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=0)
- [Documentation](https://github.com/wtnm/fform/blob/master/documentation.md)