"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateLib_1 = require("../src/stateLib");
const commonLib_1 = require("../src/commonLib");
const fform_1 = require("../src/fform");
const styles = {
    container: (base) => (Object.assign(Object.assign({}, base), { flex: 1 }))
};
function default_1(Select, Creatable) {
    return {
        widgets: {
            ReactSelect: Select,
            ReactCreatable: Creatable,
        },
        sets: {
            reactSelect: {
                $_ref: '^/sets/simple',
                Main: {
                    _$useTag: '^/widgets/ReactCreatable',
                    onChange: { $: '^/fn/reactSelectParse|setValue|liveUpdate' },
                    className: false,
                    styles,
                    _$skipKeys: ['styles'],
                    $_maps: {
                        value: { $: '^/fn/reactSelectValue', args: ['@/value', '@/fData/enumExten'] },
                        options: { $: '^/fn/reactSelectValue', args: ['@/fData/enum', '@/fData/enumExten'] },
                        isDisabled: '@/params/disabled'
                    },
                },
            },
            $rsClearable: { Main: { isClearable: true } },
            $rsMulti: { Main: { isMulti: true } },
            $rsStatic: { Main: { _$useTag: '^/widgets/ReactSelect' } },
            $rsList: {
                Main: {
                    $_maps: {
                        options: '@/fData/enumOpts'
                    }
                }
            },
        },
        fn: {
            reactSelectParse: function (values) {
                // console.log(values);
                if (values === null) {
                    if (this.$branch[stateLib_1.SymData].fData.type === 'array')
                        return [[]];
                    return [null];
                }
                if (!Array.isArray(values))
                    return [values.value];
                return [values.map((item) => item.value)];
            },
            reactSelectValue: function (values = [], enumExten = {}) {
                if (values === null || values === '')
                    return [];
                let res = commonLib_1.toArray(values).map((value) => {
                    let extenProps = fform_1.getExten(enumExten, value);
                    return Object.assign({ value, label: value }, extenProps);
                });
                return (commonLib_1.isArray(values)) ? [res] : res;
            }
        }
    };
}
exports.default = default_1;
;
//# sourceMappingURL=reactSelectElements.js.map