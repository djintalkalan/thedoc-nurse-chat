
import authTypes from './authTypes';
import chatTypes from './chatTypes';
import otherTypes from './otherTypes';
import patientTypes from './patientTypes';

const ActionTypes = {
  ...otherTypes,
  ...authTypes,
  ...patientTypes,
  ...chatTypes,
}
export interface action {
  type: String,
  payload?: any
}

export default ActionTypes