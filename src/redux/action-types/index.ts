
import authTypes from './authTypes';
import chatTypes from './chatTypes';
import homeTypes from './homeTypes';
import otherTypes from './otherTypes';
import userTypes from './userTypes';

const ActionTypes = {
  ...userTypes,
  ...otherTypes,
  ...authTypes,
  ...homeTypes,
  ...chatTypes,
}
export interface action {
  type: String,
  payload?: any
}

export default ActionTypes