import {SymData} from "../src/stateLib";
import {isArray, toArray} from "react-ts-utils";
import {getExten} from "../src/fform";

const styles = {
  container: (base: any) => ({
    ...base,
    flex: 1
  })
};

export default function (Select: any, Creatable: any) {
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
          onChange: {$: '^/fn/reactSelectParse|setValue|liveUpdate'},
          className: false,
          styles,
          _$skipKeys: ['styles'],
          $_maps: {
            value: {$: '^/fn/reactSelectValue', args: ['@/value', '@/fData/enumExten']},
            options: {$: '^/fn/reactSelectValue', args: ['@/fData/enum', '@/fData/enumExten']},
            isDisabled: '@/params/disabled'
          },
        },
      },
      $rsClearable: {Main: {isClearable: true}},
      $rsMulti: {Main: {isMulti: true}},
      $rsStatic: {Main: {_$useTag: '^/widgets/ReactSelect'}},
      $rsList: {
        Main: {
          $_maps: {
            options: '@/fData/enumOpts'
          }
        }
      },
    },

    fn: {
      reactSelectParse: function (values: any) {
        // console.log(values);
        if (values === null) {
          if (this.$branch[SymData].fData.type === 'array') return [[]];
          return [null];
        }
        if (!Array.isArray(values)) return [values.value];
        return [values.map((item: any) => item.value)]
      },
      reactSelectValue: function (values: any = [], enumExten: any = {}) {
        if (values === null || values === '') return [];
        let res = toArray(values).map((value: any) => {
          let extenProps = getExten(enumExten, value);
          return {value, label: value, ...extenProps}
        });
        return (isArray(values)) ? [res] : res;
      }
    }
  };
};
