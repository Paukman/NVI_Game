import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Select } from "antd";

import {
  Skeleton,
  Select as SelectComponent,
  Input
} from "StyleGuide/Components";
import { User, Account, CircledDollarSign } from "StyleGuide/Components/Icons";
import downArrow from "assets/icons/DownArrow/arrow_down.svg";
import { globalTransfersMessage } from "utils/MessageCatalog";
import { numberFilter } from "utils/formUtils";
import useGetGlobalTransfersInfo from "./hooks/useGetGlobalTransferData";
import useGetExchangeRate from "./hooks/useGetExchangeRate";

const colLayout = {
  wrapperCol: {
    xs: { span: 24 }
  }
};

const renderCurrencyType = (currencyType, testId) => (
  <div className="global-transfers-input-currency" data-testid={testId}>
    {currencyType}
  </div>
);

const Create = ({ form }) => {
  Create.propTypes = {
    form: PropTypes.instanceOf(Object).isRequired
  };

  const onExchangeRateSuccess = data => {
    form.setFieldsValue({
      toAmount: data.buyAmount
    });
  };

  const { Option } = Select;

  const [fromCurrencyType, setFromCurrencyType] = useState();
  const [toCurrencyType, setToCurrencyType] = useState();

  const {
    recipientList,
    accountList,
    accountListCurrencies,
    userAddress,
    isLoading
  } = useGetGlobalTransfersInfo();
  const { exchangeRateRequest } = useGetExchangeRate({
    onSuccess: onExchangeRateSuccess
  });

  return (
    <Form
      name="selectionForm"
      layout="vertical"
      form={form}
      className="rebank-form create-global-transfer-form"
    >
      <Skeleton
        sizeMedium
        loading={isLoading}
        className="form-skeleton form-skeleton-align-stepper"
        data-testid="global-transfers-create-skeleton"
      >
        <div
          className="user-address-message"
          data-testid="user-address-message"
        >
          Your address is <b>{userAddress}</b>.<br />
          If this address isn&apos;t correct, please update or call ATB at&nbsp;
          {globalTransfersMessage.MSG_GTA_PHONE} so we can help.
        </div>
        <Form.Item
          label="From"
          htmlFor="from"
          className="input-group"
          {...colLayout}
        >
          <Account className="input-group-icon" />
          <Form.Item name="from" className="input-group" noStyle>
            <SelectComponent
              placeholder="Select account"
              name="fromAccount"
              id="global-transfers-from-account"
              onChange={(_, option) => {
                setFromCurrencyType(accountListCurrencies[option.value]);
              }}
            >
              {accountList.map(account => (
                <Option
                  key={account.value}
                  currency={account.currency}
                  data-testid="global-transfer-from"
                >
                  {account.text}
                </Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </Form.Item>
        <div className="secondary-icon">
          <img src={downArrow} alt="Down Arrow" />
        </div>
        <Form.Item
          label="To"
          htmlFor="to"
          className="input-group form-second-field-margin"
          {...colLayout}
        >
          <User className="input-group-icon" />
          <Form.Item name="to" noStyle>
            <SelectComponent
              placeholder="Select recipient"
              name="recipient"
              id="global-transfers-to-recipient"
              onChange={(_, option) => {
                setToCurrencyType(option.currency);
              }}
            >
              {recipientList.map(recipient => (
                <Option
                  key={recipient.id}
                  data-testid="global-transfer-recipient"
                  currency={recipient.currencyCode}
                >
                  {recipient.name}
                </Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="From amount"
          htmlFor="fromAmount"
          className="input-group form-second-field-margin currency-input"
          {...colLayout}
        >
          <CircledDollarSign className="input-group-icon" />
          <Form.Item name="fromAmount" noStyle>
            <Input
              disabled={!fromCurrencyType || !toCurrencyType}
              name="fromAmount"
              id="fromAmount"
              onChange={() => {
                form.setFieldsValue({
                  fromAmount: numberFilter(form.getFieldValue("fromAmount"))
                });
              }}
              onBlur={() => {
                if (form.getFieldValue("fromAmount")) {
                  form.setFieldsValue({
                    toAmount: "Calculating..."
                  });

                  exchangeRateRequest.mutate({
                    recipientAccountId: parseFloat(form.getFieldValue("to")),
                    sellCurrency: fromCurrencyType,
                    buyCurrency: toCurrencyType,
                    sellAmount: parseFloat(form.getFieldValue("fromAmount"))
                  });
                }
              }}
              suffix={renderCurrencyType(
                fromCurrencyType,
                "global-transfers-from-currency-type"
              )}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="To amount"
          htmlFor="toAmount"
          className="input-group form-second-field-margin currency-input"
          {...colLayout}
        >
          <CircledDollarSign className="input-group-icon" />
          <Form.Item name="toAmount" noStyle>
            <Input
              id="toAmount"
              disabled
              // disabled={!fromCurrencyType || !toCurrencyType}
              name="toAmount"
              suffix={renderCurrencyType(
                toCurrencyType,
                "global-transfers-to-currency-type"
              )}
            />
          </Form.Item>
        </Form.Item>
      </Skeleton>
    </Form>
  );
};

export default Create;
