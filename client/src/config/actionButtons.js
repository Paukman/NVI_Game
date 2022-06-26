import { colors } from 'mdo-react-components';
import { getText } from 'utils/localesHelpers';

export const buttonEditGrey = {
  clickId: 'edit',
  text: '',
  variant: 'tertiary',
  iconName: 'Edit',
  iconColor: colors.iconGrey,
};

export const buttonRemoveGrey = {
  clickId: 'remove',
  text: '',
  variant: 'tertiary',
  iconName: 'Delete',
  iconColor: colors.iconGrey,
};

export const cancelButton = {
  clickId: 'cancel',
  text: getText('generic.cancel'),
  variant: 'default',
  dataEl: 'buttonCancel',
};

export const submitButton = {
  clickId: 'submit',
  text: getText('generic.save'),
  variant: 'success',
  dataEl: 'buttonSave',
};

export const buttonComment = {
  clickId: 'comment',
  text: '',
  variant: 'tertiary',
  iconName: 'Comment',
  iconColor: colors.blue,
};
