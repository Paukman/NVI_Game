import React from 'react';
import PropTypes from 'prop-types';

import { Button, InputField, Content } from 'mdo-react-components';

import { ItemIndexStyle, TextStyle } from '../styled';
import { HmgGlCodeSelector } from '../../../components';
import { PurchaseOrderSingleItemRow } from './PurchaseOrderSingleItemRow';
import { getText } from '../../../utils/localesHelpers';

export const PurchaseOrderAddEditItem = (props) => {
  PurchaseOrderAddEditItem.propTypes = {
    purchaseOrderItems: PropTypes.arrayOf(PropTypes.shape({})),
    deletePOItem: PropTypes.func,
    onChangePOItem: PropTypes.func,
  };

  const { purchaseOrderItems, deletePOItem, onChangePOItem } = props;

  return (
    <>
      <Content mt={20} />
      <PurchaseOrderSingleItemRow
        itemNumber={
          <TextStyle fontSize='12px' fontWeight='600'>
            {getText('po.itemNo')}
          </TextStyle>
        }
        itemDescription={
          <TextStyle fontSize='12px' fontWeight='600'>
            {getText('po.description')}
          </TextStyle>
        }
        hmgGlCode={
          <TextStyle fontSize='12px' fontWeight='600'>
            {getText('po.glCode')}
          </TextStyle>
        }
        unitOfMeasure={
          <TextStyle fontSize='12px' fontWeight='600'>
            {getText('po.unit')}
          </TextStyle>
        }
        unitPrice={
          <TextStyle textAlign='end' fontSize='12px' fontWeight='600'>
            {getText('po.unitPrice')}
          </TextStyle>
        }
        quantity={
          <TextStyle textAlign='end' fontSize='12px' fontWeight='600'>
            {getText('po.quantity')}
          </TextStyle>
        }
        total={
          <TextStyle textAlign='end' fontSize='12px' fontWeight='600'>
            {getText('po.total')}
          </TextStyle>
        }
      />

      {purchaseOrderItems &&
        purchaseOrderItems.map((poItem, index) => {
          return (
            <div key={poItem.id}>
              <PurchaseOrderSingleItemRow
                no={<ItemIndexStyle>{index + 1}</ItemIndexStyle>}
                itemNumber={
                  <InputField
                    name={`itemNumber_${poItem.id}`}
                    value={poItem?.itemNumber || ''}
                    onChange={onChangePOItem}
                    helperText={getText('po.required')}
                    dataEl={`inputFieldItemNumber${poItem.id}`}
                  />
                }
                itemDescription={
                  <>
                    <InputField
                      name={`itemDescription_${poItem.id}`}
                      value={poItem?.itemDescription || ''}
                      onChange={onChangePOItem}
                      helperText={getText('po.required')}
                      required
                      dataEl={`inputFieldItemDescription${poItem.id}`}
                    />
                  </>
                }
                hmgGlCode={
                  <HmgGlCodeSelector
                    name={`hmgGlCode_${poItem.id}`}
                    value={poItem?.hmgGlCode || ''}
                    onChange={onChangePOItem}
                    helperText={getText('po.required')}
                    dataEl={`hmgGlCodeSelector${poItem.id}`}
                  />
                }
                unitOfMeasure={
                  <InputField
                    name={`unitOfMeasure_${poItem.id}`}
                    value={poItem?.unitOfMeasure || ''}
                    onChange={onChangePOItem}
                    dataEl={`inputFieldUnitOfMeasure${poItem.id}`}
                  />
                }
                unitPrice={
                  <InputField
                    name={`unitPrice_${poItem.id}`}
                    value={poItem?.unitPrice || ''}
                    onChange={onChangePOItem}
                    required
                    helperText={getText('po.required')}
                    inputProps={{ style: { textAlign: 'end' } }}
                    dataEl={`inputFieldUnitPrice${poItem.id}`}
                  />
                }
                quantity={
                  <InputField
                    name={`quantity_${poItem.id}`}
                    value={poItem?.quantity || ''}
                    onChange={onChangePOItem}
                    required
                    helperText={getText('po.required')}
                    inputProps={{ style: { textAlign: 'end' } }}
                    dataEl={`inputFieldQuantity${poItem.id}`}
                  />
                }
                total={
                  <InputField
                    name={`total_${poItem.id}`}
                    value={poItem?.total || ''}
                    inputProps={{ readOnly: true, style: { textAlign: 'end' } }}
                    dataEl={`inputFieldTotal${poItem.id}`}
                  />
                }
                deleteButton={
                  <Button
                    iconName='Delete'
                    variant='tertiary'
                    onClick={() => {
                      deletePOItem(poItem.id);
                    }}
                    dataEl={`buttonDelete${poItem.id}`}
                  />
                }
              />
            </div>
          );
        })}
    </>
  );
};
