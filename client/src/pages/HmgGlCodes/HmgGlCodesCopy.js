import React, { memo, useContext, useEffect, useState, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, GridItem, FormState, Content, Select, TagsSelector } from 'mdo-react-components';
import { GlobalFilterContext, HotelContext, AppContext } from 'contexts';
import { useHmgGlCodes } from '../../graphql/useHmgGlCodes';
import {
  HotelSelector,
  FormContainer,
  Form,
  FormBlock,
  DisplayApiErrors,
  SuccessMessage,
  ButtonsCancelSave,
} from 'components';
import logger from 'utils/logger';
import { getText, isKeyPresent, strReplace } from 'utils';
import { RightBorder } from './styled';
import { APP_KEYS } from 'config/appSettings';

const STATUSES = {
  IDLE: 1,
  SAVING: 2,
  SAVED: 3,
};

const HmgGlCodesCopy = memo(() => {
  const { hmgGlCodeCopyMapping, hmgGlCodeCopyingMapping, lastOperationResult } = useHmgGlCodes();
  const { appPages } = useContext(AppContext);
  const { hotels } = useContext(HotelContext);
  const { hotelId, selectHotelId } = useContext(GlobalFilterContext);
  const [status, setStatus] = useState(STATUSES.IDLE);
  const history = useHistory();
  const params = useParams();
  const [state, setState] = useState({
    copyTo: [],
  });

  const pageKey = location?.state?.key ?? null; // just in case its undefined

  const goBack = () => {
    if (!pageKey && isKeyPresent(appPages, APP_KEYS.GL_MAPPING)) {
      // just return to mapping if this page is reloaded...
      history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING].url}`));
    } else if (pageKey && isKeyPresent(appPages, pageKey)) {
      history.push(strReplace(`${appPages.keys[pageKey]?.url}`));
    }
  };

  const handleSubmit = (formData) => {
    logger.debug('Submit form:', { formData });

    setStatus(STATUSES.SAVING);

    hmgGlCodeCopyMapping({
      fromHotelId: Number(hotelId),
      toHotelIds: formData.copyTo.map((item) => Number(item)),
      copyStatuses: true,
    });
  };

  useEffect(() => {
    if (status === STATUSES.SAVING && hmgGlCodeCopyingMapping === false) {
      setStatus(STATUSES.SAVED);
      setTimeout(() => {
        if (lastOperationResult.errors.length === 0) {
          goBack();
        } else {
          setStatus(STATUSES.IDLE);
        }
      }, 1000);
    }
  }, [lastOperationResult]);

  useEffect(() => {
    if (params.hotelId) {
      selectHotelId(Number(params.hotelId));
    }
  }, [params]);

  const hotels2use = useMemo(() => {
    return hotels.filter((hotel) => hotel.id != hotelId);
  }, [hotels, hotelId]);

  return (
    <FormState data={state} onSubmit={handleSubmit}>
      {({ data, handleChange, submit }) => {
        return (
          <FormContainer>
            <Form fullHeight>
              <FormBlock>
                <Content pt={30} />
                <Grid spacing={2}>
                  <GridItem xs={12} md={6}>
                    <HotelSelector
                      label={getText('generic.copyFrom')}
                      value={hotelId}
                      onChange={(name, value) => {
                        selectHotelId(Number(value));
                      }}
                      disableClearable
                    />
                  </GridItem>
                </Grid>
              </FormBlock>
              <FormBlock stretch>
                <Grid spacing={0}>
                  <GridItem xs={12} md={6}>
                    <RightBorder>
                      <Content pr={16} pb={16}>
                        <Select
                          height='100%'
                          items={hotels2use}
                          value={data.copyTo}
                          name='copyTo'
                          labelText={getText('generic.selectProperties')}
                          itemLabelName='hotelName'
                          itemValueName='id'
                          canselectall
                          selectAllLabel={getText('generic.selectAll')}
                          disabled={false}
                          errorMsg=''
                          buttonVariant='tertiary'
                          multiple
                          onChange={handleChange}
                        />
                      </Content>
                    </RightBorder>
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <Content pl={16} pb={16}>
                      <TagsSelector
                        name='copyTo'
                        value={data.copyTo}
                        items={hotels2use}
                        onChange={handleChange}
                        itemLabelName='hotelName'
                        itemValueName='id'
                      />
                    </Content>
                  </GridItem>
                </Grid>
              </FormBlock>
              <FormBlock>
                <Grid spacing={2}>
                  {lastOperationResult.errors.length > 0 && (
                    <GridItem lg={12}>
                      <DisplayApiErrors errors={lastOperationResult.errors} genericOnlyErrors />
                    </GridItem>
                  )}
                  {lastOperationResult.errors.length === 0 && status === STATUSES.SAVED && (
                    <SuccessMessage>{getText('hmgglcodemapping.copiedSuccessfully')}</SuccessMessage>
                  )}
                  <GridItem xs={12}>
                    <ButtonsCancelSave
                      onCancel={() => {
                        goBack();
                      }}
                      onSave={() => submit()}
                      inProgress={hmgGlCodeCopyingMapping}
                      canSave={data.copyTo.length > 0}
                    />
                  </GridItem>
                </Grid>
              </FormBlock>
            </Form>
          </FormContainer>
        );
      }}
    </FormState>
  );
});

HmgGlCodesCopy.displayName = 'HmgGlCodesCopy';

export { HmgGlCodesCopy };
