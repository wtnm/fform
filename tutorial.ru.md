##fform: tutorial

![fform](https://habrastorage.org/webt/dz/it/sl/dzitslhry8fiqoi8jowyzsnuuy0.png "fform")



#### 01. Начало работы, поля формы
Установим пакет:
```
npm install --save fform
```
_(подразумевается, что для сборки используется webpack или что-нибудь подобное.)_

Создадим форму для логина пользователя. Будем считать, что в качестве логина используется номер телефона.

Импортируем все необходимое, а так же стили из 'fform/addon/styling', чтобы форма правильно отображалась и создадим схему в которой определим поля формы:
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
render(<FForm core={{schema, elements: elements.extend([basicStyling])}}/>, document.querySelector('#root'));
```
Корневое поле имеет тип `object` и задает 2 поля в свойстве `properties`.

По свойствам поля `login` все достаточно очевидно:
- `type` определяет тип поля
- `title` заголовок поля
- `_placeholder` заполнитель пустого поля. (Ведущий `_` показывет, что свойство является расширением и не входит в базовую спецификацию JSONSchema.)

Четвертое свойство `_presets` поля `password` определяет какие сеты из `elements.sets` будут использоваться для постройки поля. Если свойство `_presets` не опредено, то используется свойство `type`, но только если `type` является строкой, иначе будет выведено исключение. 

В корневом поле `_presets` не определено, но свойство `type = "object"`, поэтому `ff_presets = "object"`, т.е. сет берется из `elements.sets.object`. Аналогично для поля **login** свойство `type = "string"`, поэтому `_presets = "string"`, сет берется из `elements.sets.string`.

В поле **password** `_presets` равен `"string:$password"`. Символ `:` разделяет сеты, которые должны быть объединены в один. При рендере поля, данные будут взяты из `elements.sets.string` и из `elements.sets.$password`, а затем объединены в один объект слева направо, т.е. свойства из `elements.sets.$password` перезапишут свойства с одинаковыми именами из `elements.sets.string`. Слияние глубокое, все вложенные объекты объединяются рекурсивно.

Сеты условно разделены на основные (без ведущего `$` в названии) и вспомогательные (с ведущим `$` в названии). У основного сета присутствует свойство `$_widget` с React-элементом, у вспомогательного это свойство отсутсвует, задача вспомогательного расширять и менять основной сет своими данными. [Документация](https://github.com/wtnm/fform/blob/master/documentation.md#structure#)

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=0).

#### 02. Использование layout
Добавим кнопку submit в форму. Используем для этого свойство `_layout`:
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
`ff_layout` это объект, в свойстве `$_widget` которого передаётся React-элемент, который отрендерит слой. Если `$_widget` не определен, то по-умолчанию используется `div`. Из объекта, помимо `$_widget` изымаются `$_fields`, `$_maps` `$_skipKeys`, а остальное передается как `props` React-элементу определенному в `$_widget`.

Свойство `$_fields` это массив и в нем определят порядок размещения полей и объктов. Строковые значения заменяются полями из свойства `properties` в случае если `type = "object"` и `items` в случае `type = "array"`. Если поле в схеме не найдено, то оно пропускается. В свою очередь значения-объекты обрабатываются так же, как и `_layout` и так же могут иметь свойство `$_fields`, что позволяет определять слои с требуемым уровнем вложенности (рекурсивно).

Свойство `$_maps` используется для передачи данных от state формы в компонент, [подробнее в документации](https://github.com/wtnm/fform/blob/master/documentation.md#_maps).

В данном случае `_layout` передается объект у которого только одно свойство `$_fields` опеределяющее порядок полей и объектов при выводе. `$_widget` не определен, поэтому для вывода данных используется `div`.

Поля `login` и `password` определяют их порядок вывода, затем идет объект, который выводит кнопку отправки. В качестве `$_widget` у него передан HTML-тэг `button`, в свойствах передан `type` равный `submit` и потомки в свойстве `children`, где передан текст `Send`, т.е. будет это все будет отрендерено в следующий HTML-код `<button type="submit">Send</button>`. 

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=1).

#### 03. Стили и вложенные layout
Улучшим нашу форму, добавим кнопку ресет и дополнительный, вложенный слой, чтобы отобразить эти кнопки в линию:
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
Теперь на 3-й позиции объект со свойством `$_fields`. `$_widget` у него не определен, значит по-умолчанию используется `div`. Свойство `className` перед тем как быть переданым `_$widget` предварительно обрабатывается функцией `elements._$cx`. Её работа описана в [документвции](https://github.com/wtnm/fform/blob/master/documentation.md#cx). В `$_fields` опредено 2 объекта (их обработка описана на предыдущем шаге) которые передаются `_$widget` в качестве потомков (childen). В итоге рендерится следуюзий HTML-код: `<div class="inline"><button type="submit">Send</button><button type="reset">Clear</button></div>`. 

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=2).

#### 04. Расширение компонентов
Рассмотрим способ расширения объектов `elements`. В каждом объекте можно объявить свойство `$_ref`. Значение этого свойства должна быть одна или несколько ссылок на `elements` вида `^/...` разделенных символом `:`. Объект, которые содержит `$_ref`  обрабатывается следующим образом: сначала собираются все объекты по ссылкам в `$_ref`, а затем все собранные объекты и текущий объект без свойства `$_ref` объединяются в один. Данный механизм используется для всего объекта `elements`, а так же для свойств схемы `ff_layout`, `ff_custom`, `ff_validators`, `ff_dataMap`, `ff_oneOfSelector`. 

Например пусть `elements = {"one":{"two":{"three":4, "more":5}}}`, тогда `ff_layout = {"$_ref":"^/fn/one:^/fn/one/two", "two":{"three":0}, "more":1}` будет объединен в следующий объект: `{"three":4, "more":1 {"two":{"three":0, "more":5}}}`

В базовом `elements` уже присутствуют часто используемые объекты формы ([подробнее в документации](https://github.com/wtnm/fform/blob/master/documentation.md#parts)). Перепишем `ff_layout` с их использованием `^/parts/Submit` и `^/parts/Reset`:
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
При обработке `{"$_ref": "^/parts/Submit", "children": ["Send"]}` будет взят объект по ссылке `elements.parts.Submit`, затем он будет объединен с объектом `{"children": ["Send"]}}`, а после этого он будет обработан так, как было описано на предыдущем шаге. 

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=3).

#### 05. Применение обработчиков данных
Добавим маску ввода для поля `login` вида `XXX-XXX-XXXX`. Для этого определим функции, которые будут форматировать и парсить значение поля и добавим их в `elements`. Обратите внимание функции возвращают полученный массив аргументов, изменяя в нем только самый первый. Это связано с особенностями применения [обработчиков данных](https://github.com/wtnm/fform/blob/master/documentation.md#data-handlers).
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

Далее используем свойство `_custom` позволяющее настроить конкретное поле под наши требования. Поле собирается из нескольких блоков (`Main`, `Title` и других, [подробности в документации](https://github.com/wtnm/fform/blob/master/documentation.md#customization)) из которых нам нужен блок `Main` рендерящий непосредственно `input`. В этом блоке нас интересуют свойства `onChange` и `$_maps`.

`$_maps` - это объект, который определяет какие свойства пробрасывать из state в компонент, при этом есть возможность использовать [обработчик данных](https://github.com/wtnm/fform/blob/master/documentation.md#data-handlers) для их изменения ([подробнее в документации](https://github.com/wtnm/fform/blob/master/documentation.md#_maps)). Используем это, для того чтобы добавить обработчик для свойства `value` (сейчас в свойство компнента просто передается значение из state, без обработки)
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
Теперь перейдем к свойству `onChange`. В нем сейчас используется следующий обработчик `{"$": "^/fn/eventValue|^/fn/setValue"}`. Обработчик получает event, который передает функции `elements.fn.eventValue`. Эта функция берет из event'а значение `event.target.value` и передает это значение вместо event'а следующей функции. Все остальные аргументы (если они есть) передаются без изменений. `setValue` использует [API](https://github.com/wtnm/fform/blob/master/documentation.md#api) для того, чтобы изменить state и поменять значение поля на переданное. 

Изменим свойство `onChange`, добавив между `eventValue` и `setValue` парсер.
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
Теперь наш парсер получает из `eventValue` аргументы, из самого первого аргумента удаляет все, что не является цифрами и передает их дальше в `setValue`.

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial.json&selector=4)


#### 06. Применение _stateMaps 
Добавим ссылку для восстановления пароля, при этом сделаем так, чтобы она подсвечивалась, когда номер телефона введен полностью.

Зададим функцию для получения длины переданного значения и функцию восстановления пароля.
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
Далее используем свойство `_stateMaps` для того чтобы передать из значение из поля `login` в корневое поле, при этом зададим обработчик данных, который проверит имеет ли это значение длину 10 или нет.
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
Установили `_params.liveUpdate` в `true`, чтобы данные поля сразу обновлялись, не дожидаясь потери фокуса поля.

Рассмотрим `_stateMaps` поподробнее. Свойство `from` - путь откуда берется значение. Поддерживаются относительные пути (начинаюзиеся с `.` и `..` [подробнее о путях в документации](https://github.com/wtnm/fform/blob/master/documentation.md#path)). Далее это значение передается в обработчик (если он задан), а затем результат передается по пути указанному в свойстве `to`.

В данном примере значение `value` берется из [объекта данных](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) текущего поля (`login`) и передается в `params.activated` [объекта данных](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) родительского поля. При этом, предварительно, используется обработчик данных, который на вход первой функции (`elements.fn.getLength`) передает 2 аргумента: `${0}` заменяется 0-м аргументом, который получил обработчик (это значение из `from`), и число 10. `getLength` заменят значение на его длину, а число 10 передает без изменений далее. Функция `elements.fn.equal` строго сравнивает 0-й аргумент со всеми остальными и если хоть одно совпадение, возвращает `true`, иначе `false`. 

В результате, в `params.activated` [объекта данных](https://github.com/wtnm/fform/blob/master/documentation.md#data-object) корневого поля будет `true` если длина значение поля `login` равна 10 и `false` в любом другом случае. Теперь нужно добавить ссылку и пробросить в нее данные из `params.activated` [объекта данных](https://github.com/wtnm/fform/blob/master/documentation.md#data-object). Вставим её после поля `password`:
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
Не забываем добавить в css классы для ссылки.

```css
.grayed {
    color: #aaa;
}

.activated {
    color: #2667FF;
}
```

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=5).

#### 07. Расширение и комбинирование схем
Добавим в форму возможность регистрации.
Выведем поля в отдельный слой, а схему перенесем в `definitions.login` и создадим на неё ссылку в корневом элементе:
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
Теперь используюя свойства `oneOf` и `allOf` добавим форму регистрации, расширив из формы логина.
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
В свойстве `oneOF` мы задали 2 схемы, первая (индекс `oneOf = 0`) повторяет форму `definitions.login`, а вторая (индекс `oneOf = 1`) расширяет её же используя свойство `allOf`. В расширенную форму добавляется 2 новых свойства `confirm` и `email`, меняется порядок вывода полей в `_layout._fields[0]` и удаляется ссылка восстановления пароля  в `_layout._fields[1]`. Обратите внимание, `_layout._fields` не массив, а объект. Это сделано для того, чтобы при слиянии с `definitions.login` 0-й и 1-й элементы были заменены, а 2-й (с кнопками субмита и ресета) остался не тронутым. Слияние в `fform` реализовано так, что если левый объект является массивом, а правый объект нет, то при объединении тип левого объекта (массив) сохраняется, поэтому такой трюк и возможен.

Теперь у нас есть 2 варианта формы, для логина (oneOf = 0) и регистрации (oneOf = 1), добавим возможность переключения между ними. Уберем кнопку ресета (она нам не особо нужна) и вместо неё добавим переключатель перед кнопкой отправки.

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

Функция `elements.fn.iif` принимает 3 аргумента, если 1-й истинный возвращает 2-й, иначе 3-й. В данном примере 1-м аргументом передается значение индекса `oneOf` и если он равен 0 (форма логина), то отображаем текст кнопки переключение как `Register`, а если равен 1 (форма регистрации) то `Log in`.

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=6).

#### 08. Применение _oneOfSelector
Итак, у нас есть форма логина и регисрации с переключением между этими режимами и, вроде все нормально, но есть небольшая проблема. Если переключится на форму регистрации, а затем обратно, то при отправке данных обнаружится, что структура данных соответвует форме регитрации, а не логина (можно проверить попереключавшись между режимами и нажимая submit). Почему так произошло? При переключении в режим регистрации в объект данных формы был расширен в соответсвии со схемой регистрации. Но когда режим был переключен обратно добавленные поля не были удалены, потому что `fform` сохраняет данные при переключении свойства `oneOf` если тип поля не меняется или если в текущей схеме его нет. 

Вариантов решения этой проблемы множество, и мы реализуем самый прямой и очевидный. Добавим скрытое поле `oneOf` в которое будем транслировать значение `oneOf` корневого поля.
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
Теперь у нас поле, по которому можно определить текущий режим. И поле нам весьма пригодится. Дело в том, что при определении того, какой индекс `oneOf` следует применить при устанвки значения формы `ffom` ориентируется на тип значения. Т.е. схемы `oneOf` перебираются, до тех пор, пока не будет найдена схема с типом соответствующий типу переданного значения. Но если у нас, как в данном примере, несколько схем `oneOf` с одинаковым типом (в данном примере этот тип `object`), то всегда будет выбираться тип с меньшим индексом. Именно для разрешения подобных коллизий в схему добавлено свойство `_oneOfSelector`, в котором должна быть задана функция, которая получает значение и возвращает индекс `oneOf` к которому это значение относится. Используем это свойсвтво:
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
Тут все передельно просто, у нашего объекта есть свойство `oneOf`, которое соответствует используемой схеме, его и возвращаем. Теперь, когда мы будет задавать значение формы (при инициализации или с помощью API, не важно), схема `oneOf` у нас будет выбираться правильно.

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=7).

#### 09. Валидация
Пришло время добавить валидацию, которых в `ffrom` 4 вида: JSON, sync, async, sybmit. Начнем с JSON. Подключим JSON-валидатор и добавим простой паттерн проверки e-mail:
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

render(<FForm core = {{schema, elements, JSONValidator}}/>, document.querySelector('#root'));
```
Готово. Так же была добавлена валидация по минимальному и максимальному значению поля `oneOf`. Теперь JSON валидация проходит, только если это значение равно 0 для формы логина и 1 для формы регистрации. 

Теперь добавим проверку сопадения паролей в полях `password` и `confirm`. Делать это надо на уровне корневого поля:
```js
...
elements.extend([{
	...
    validators:{
		testPasswords(value){
        	let result = {path: './confirm', data: ''}
        	if (value.password !== value.confirm) result.data = 'Пароли не совпадают';
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
Задаем свойство `_validators` для корневого поля, чтобы функция `elements.validators.testPasswords` получала весь объект с данными. Функция, которую мы определили проверяет пароли на совпадение и возвращает объект со свойствами `path` и `data`. Свойство `path` определяет поле в которое будет записано сообщение, а `data` это текст ошибки. Более подробно о формате возвращаемого значения можно узнать в [документации](https://github.com/wtnm/fform/blob/master/documentation.md#sync-validation).

Теперь сделаем эмуляцию асихронной проверки номера телефона:
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
Все предельно просто, вместо синхронной функции, асинхронная, у поля `login` добавляется валидатор. Так как валидатор задан в расширеной схеме (индекс `oneOf` = 1), то и работать он будет только в режиме регистрационной формы.

А теперь добавим эмуляцию проверки капчи при отправки формы:
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
            return {captcha: 'Неверная каптча'};
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
render(<FForm core = {{schema, elements, JSONValidator}} onSubmit="^/submits/testCaptcha"/>,
document.querySelector('#root'));
```
Функция `onSubmit` может вернуть объект с текстом ошибок для соответствующих полей. Если возвращается пустой объект, значит ошибок нет.

[Текущий результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=8).

#### 10. Собственные компоненты
Допустим мы хотим чтобы при регистрпции выбрал несколько тэгов из какого-либо списка. Если требования к данным не слишком сложное, то можно использовать встроенные input'ы `fform`. Однако если требуется расширенная функциональноть, то, скорее всего, потребуется использовать сторонний input. Продемонстируем как это сделать на примере интегрирования компонента react-select в форму. Сначала установим.
```js
npm install --save react-select
```
Теперь расширим elements добавив новый сет и функции для передачи значений от компонента к state и обратно.
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
Функция `reactSelectParse` переводит данные из формата `react-select` в формат `fform`, а `reactSelectValue` наоборот. Добавляем сет `reactSelect`, в качестве основы использует сет `simple`(базовый сет для отображения input'ов). React-компонент в `$_widget` не меняет, так как текущий умеет работать с другими React-компонентами с помощью свойства `_$useTag`, его и используем, передавая в нем `react-select`. Меняем `onChange` ставя первым парсер из формата `react-select`. После чего `setValue` обновляет данные в state. Функция `liveUpdate` заставляет обновление работать так, как если бы liveUpdate был включен, не дожидаясь потери фокуса input'а, именно такое поведение ожидается от select-компонента.

`$_maps` пробрасывает данные из state в компонент, в соответсвии с документацией `react-select` и переводя данные в понятный `react-select` формат. В `@/fData/enum` хранятся перечисляемые значение из свойства схемы `enum`, а в `@/fData/enumExten` расширение для перечисляемых значение из свойства схемы `_enumExten`, [подробнее в документации](https://github.com/wtnm/fform/blob/master/documentation.md#extended-schema-properties).

Пришло время добавить новый элемент в схему:
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
Так как мы использует мультиселект (с помощью `_custom` передали параметр `isMulti` в `react-select`), то задаем тип поля `array` и ставим свосвтво `_simple` в true, чтобы `fform` обрабатывал это поле как простое (не создаются вложенные поля и по-другому формируется объект данных), т.е. все управление данными отдано компоненту, а `fform` просто получает/передает значение. Свойство `_enumExten` задает перечисляюмые значения (особенности применения `enum` и `_enumExten` [описаны в документации](https://github.com/wtnm/fform/blob/master/documentation.md#extended-schema-properties)), ну а `_preset` указывает на сет, который мы определили в `elements`.

[Итоговый результат](https://wtnm.github.io/fform-constructor/index.html#url=tutorial_adv.json&selector=9).

#### Ссылки

- [Репозиторий на github](https://github.com/wtnm/fform)
- [Установка и использование](https://github.com/wtnm/fform#installation--usage)
- [Примеры](https://wtnm.github.io/fform-constructor/index.html#url=examples.json&selector=0)
- [Документация](https://github.com/wtnm/fform/blob/master/documentation.md)

