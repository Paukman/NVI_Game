import React, { memo } from 'react';
import PropTypes from 'prop-types';

import useGenericForm from './useGenericForm';
import { FormContainer, TextStyle } from './styled';
import { ButtonsGroup, Content, Grid, GridItem, Button } from 'mdo-react-components';
import { calcPxSize } from 'utils';
import logger from 'utils/logger';

export const GenericForm = memo((props) => {
  const { formConfig, data, errors } = props;
  const { onChange, formState: state, onHandleFormButtons } = useGenericForm(formConfig, data, errors);
  if (!formConfig) {
    return null;
  }

  const { displayConfig } = formConfig;
  const {
    formTitle,
    onXCancelButton,
    formPlacement,
    buttonsPlacement,
    fieldMargin,
    width = 380, // default if not set
    buttonsSize,
    aroundSpacing = 20, // left right and bottom
    titleFont = 20,
    topSpacing = 20, // extra maring on top if needed
    buttonPadding = 40,
  } = displayConfig || {};

  GenericForm.propTypes = {
    formConfig: PropTypes.shape({
      buttons: PropTypes.arrayOf(
        PropTypes.shape({
          clickId: PropTypes.oneOf(['cancel', 'submit']), // this is mandatory for cancel button
          text: PropTypes.string,
          variant: PropTypes.string,
          onHandleClick: PropTypes.func,
        }),
      ),
      displayConfig: PropTypes.shape({
        formTitle: PropTypes.string,
        onXCancelButton: PropTypes.func, //could be same fucntion as cancel button, or different
        formPlacement: PropTypes.string,
        buttonsPlacement: PropTypes.string,
        fieldMargin: PropTypes.number,
        width: PropTypes.number,
        buttonsSize: PropTypes.string,
        aroundSpacing: PropTypes.number,
        titleFont: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
        topSpacing: PropTypes.number,
        buttonPadding: PropTypes.number,
      }),
      onChange: PropTypes.func,
    }),
    data: PropTypes.object,
    errors: PropTypes.any,
  };

  const isConfigAvailable = Array.isArray(state?.formConfig) && state?.formConfig.length > 0;

  logger.debug('Generic form data:', { state, formConfig, data, errors });

  return (
    <>
      {isConfigAvailable && (
        <FormContainer formPlacement={formPlacement} width={width} formMargin={() => calcPxSize(formMargin)}>
          <Content mt={topSpacing} mb={aroundSpacing} ml={aroundSpacing} mr={aroundSpacing}>
            <Grid container spacing={2} justify='space-between' alignItems='flex-end' direction='row'>
              <GridItem xs={11} />
              <GridItem xs={1}>
                {onXCancelButton && (
                  <Button dataEl='buttonXCancel' iconName='Close' variant='tertiary' onClick={onXCancelButton} />
                )}
              </GridItem>
            </Grid>
            <Grid container alignItems='flex-start' direction='row'>
              <GridItem xs={11} style={{ whiteSpace: 'normal' }}>
                <TextStyle fontSize={() => calcPxSize(titleFont)} fontWeight='600'>
                  {formTitle}
                </TextStyle>
              </GridItem>
            </Grid>
            {state?.formConfig?.map((element, index) => {
              if (!Array.isArray(element)) {
                const Component = element.component?.type || null;
                const formElement = state?.data[element.name];
                return (
                  <div key={index}>
                    {formElement?.show && (
                      <>
                        {element.fieldMargin ? (
                          <Content mt={element.fieldMargin} />
                        ) : (
                          fieldMargin && <Content mt={fieldMargin} />
                        )}
                        {element.fieldPlacement === 'end' && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Component
                              {...element.attrs}
                              value={formElement.allowNullValue ? formElement.value : formElement.value ?? ''}
                              onChange={onChange}
                            />
                          </div>
                        )}
                        {!element.fieldPlacement && (
                          <Component
                            {...element.attrs}
                            value={formElement.allowNullValue ? formElement.value : formElement.value ?? ''}
                            onChange={onChange}
                          />
                        )}
                      </>
                    )}
                  </div>
                );
              } else {
                return (
                  <>
                    {/** use margin from the first element */}
                    {element?.[0]?.fieldMargin ? (
                      <Content mt={element?.[0]?.fieldMargin} />
                    ) : (
                      fieldMargin && <Content mt={fieldMargin} />
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {element.map((obj, rowIndex) => {
                        const Component = obj.component?.type || null;
                        const formElement = state?.data[obj.name];
                        const singleColumnWidth =
                          width - aroundSpacing * 4 === 0
                            ? (width - aroundSpacing) / 2
                            : (width - aroundSpacing * 2) / 2 - 8; // making 16px between 2 inputs in a row
                        return (
                          <div key={`${index}-${rowIndex}`} style={{ width: singleColumnWidth }}>
                            {formElement?.show && (
                              <Component
                                {...obj.attrs}
                                value={formElement.allowNullValue ? formElement.value : formElement.value ?? ''}
                                onChange={onChange}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              }
            })}
            <Content mt={buttonPadding} />
            {state?.formButtons && (
              <ButtonsGroup
                items={state?.formButtons}
                onClick={onHandleFormButtons}
                placement={buttonsPlacement}
                size={buttonsSize}
              />
            )}
          </Content>
        </FormContainer>
      )}
    </>
  );
});

GenericForm.displayName = 'GenericForm';
