import * as React from 'react';
import {basicObjects} from './core/components';

const ArrayInput = (basicObjects as any).widgets['ArrayInput'];

class FFView extends React.PureComponent<any, any> {
  FFViewValue = 0;

  onSelectChange(value: any) {
    //console.log(value)
    let self = this;
    if (value !== undefined) {
      self.FFViewValue = value;
      self.forceUpdate();
    }
  }

  render() {
    let self = this;
    const {value = self.FFViewValue, onChange = self.onSelectChange.bind(self), ...rest}: any = self.props;
    return (<div>
      <ArrayInput enumOptions={[{value: 0, label: 'form'}, {value: 1, label: 'JSON'}, {value: 2, label: 'js'}]}
                  inputProps={{className: 'ffview-input'}}
                  value={value}
                  name="cViewSelect"
                  onChange={onChange}
                  labelProps={{className: 'ffview-label'}}
                  {...rest}
      ></ArrayInput>
      <div className={'' + (value == 0 ? '' : ' hidden')}></div>
      <textarea className={'' + (value == 1 ? '' : ' hidden')}></textarea>
      <textarea className={'' + (value == 2 ? '' : ' hidden')}></textarea>
    </div>)
  }

}

export default FFView;