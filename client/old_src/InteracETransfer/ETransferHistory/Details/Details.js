import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import api, { etransfersBaseUrl } from "api";
import dayjs from "dayjs";
import {
  Row,
  Col,
  Divider,
  Form,
  Typography,
  Skeleton,
  Grid,
  Input,
  Space
} from "antd";
import { Button, MessageContext } from "StyleGuide/Components";
import { ModalContext } from "Common/ModalProvider";
import accountIcon from "assets/icons/FromAccount/account.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import personIcon from "assets/icons/Person/person.svg";
import statusIcon from "assets/icons/Status/status.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import expiryDateIcon from "assets/icons/End Date/end-date.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import crossIcon from "assets/icons/Cross/cross.svg";
import { formatCurrency } from "utils";

import { eTransferErrors } from "utils/MessageCatalog";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { isXS, isSM, isMD } from "StyleGuide/Components/utils";

import {
  cancelTransaction,
  transformData,
  IsPendingTransaction,
  getMemo,
  resendNotification,
  mapStatus,
  getLabelFromOrAccount,
  getLabelToOrRequestedFrom,
  getTitle
} from "./utils";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { TextArea } = Input;
const Details = ({ etransferDetails, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const modal = useContext(ModalContext);
  const { show: showModal, hide: hideModal } = modal;
  const { show: showMessage, close: closeMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();

  const [transferDetails, setTransferDetails] = useState({});
  const screens = useBreakpoint();

  const colLayout = {
    wrapperCol: {
      xs: { span: 24 }
    }
  };
  const xsProp = {
    offset: 1,
    span: 22
  };
  const smProp = {
    offset: 1,
    span: 22
  };
  const mdProp = {
    offset: 2,
    span: 20
  };

  const titleProps = {
    xs: { offset: 1, span: 20 },
    md: { offset: 2, span: 20 }
  };

  const [form] = Form.useForm();

  useEffect(() => {
    const fetch = async () => {
      const isMounted = true;
      if (!loading) setLoading(true);
      try {
        let detailsEndPoint = null;
        if (etransferDetails.type === "transfer") {
          detailsEndPoint = `${etransfersBaseUrl}/${etransferDetails.eTransferId}`;
        }
        if (etransferDetails.type === "request") {
          detailsEndPoint = `${etransfersBaseUrl}/outgoingmoneyrequest/${etransferDetails.eTransferId}`;
        }
        if (etransferDetails.type === "received") {
          detailsEndPoint = `${etransfersBaseUrl}/receivedetransfers/${etransferDetails.eTransferId}`;
        }

        const results = await api.get(detailsEndPoint);
        if (isMounted && results.status === 200) {
          const transformedData = transformData(
            results.data,
            etransferDetails.type
          );

          setTransferDetails(transformedData);
          form.setFieldsValue({
            bankAccount: transformedData.bankAccount,
            emailAccount: transformedData.emailAccount,
            status: `${mapStatus(transformedData.eTransferStatus).status}`,
            amount: `${formatCurrency(transformedData.amount.value)}`,
            dateSent: `${dayjs(transformedData.requestedExecutionDate).format(
              "MMM DD, YYYY"
            )}`,
            expiryDate: `${dayjs(transformedData.expiryDate).format(
              "MMM DD, YYYY"
            )}`
          });
          setLoading(false);
        } else {
          throw new Error("Failed to fetch details");
        }
      } catch (e) {
        if (isMounted) {
          showModal({
            title: "System Error",
            content: <div>{eTransferErrors.MSG_REBAS_000}</div>,
            actions: (
              <button
                type="button"
                className="ui button basic"
                onClick={() => {
                  hideModal();
                  onClose(isCancelled);
                }}
              >
                OK
              </button>
            )
          });
        }
      }
    };
    fetch();
  }, [isCancelled]);

  const handleCancel = () => {
    cancelTransaction(
      transferDetails,
      modal,
      showMessage,
      setIsCancelling,
      setIsCancelled,
      snackbarTop
    );
  };

  const handleResendNotification = () => {
    resendNotification(
      transferDetails,
      modal,
      showMessage,
      snackbarTop,
      closeMessage,
      setIsSendingNotification
    );
  };

  const renderSkeletons = (rowCount, widthVal, isAvatar, isTitle) => {
    if (loading) {
      const skeletons = [];
      let className = "margin-top-38";
      if (isTitle) {
        if (isXS(screens) || isSM(screens)) {
          className = "margin-top-24 margin-bottom-10";
        } else if (isMD(screens)) {
          className = "margin-top-26 margin-bottom-12";
        } else {
          className = "margin-top-32 margin-bottom-12";
        }
      }
      for (let i = 0; i < rowCount; i += 1) {
        skeletons.push(
          <Skeleton
            key={i}
            className={className}
            active
            avatar={isAvatar ? { shape: "circle", size: "small" } : false}
            round
            paragraph={false}
            title={{ width: widthVal }}
          />
        );
      }

      return skeletons;
    }
    return null;
  };

  const renderLoading = () => {
    return (
      <>
        {isXS(screens) || isSM(screens)
          ? renderSkeletons(2, "100%", true, false)
          : renderSkeletons(2, "50%", true, false)}
        {isXS(screens) || isSM(screens)
          ? renderSkeletons(4, "55%", true, false)
          : renderSkeletons(4, "20%", true, false)}
        {isXS(screens) || isSM(screens)
          ? renderSkeletons(1, "100%", false, false)
          : renderSkeletons(1, "52%", false, false)}
      </>
    );
  };

  const renderBankAccount = () => {
    if (
      transferDetails.type === "received" &&
      transferDetails.eTransferStatus === "Cancelled"
    )
      return null;

    return (
      <Form.Item
        label={getLabelFromOrAccount(transferDetails.type)}
        htmlFor="bankAccount"
        className="input-group margin-bottom-6"
        {...colLayout}
      >
        <img
          className="input-group-icon-readonly"
          src={accountIcon}
          alt="account"
        />
        <Form.Item name="bankAccount" noStyle>
          <TextArea
            readOnly
            autoSize={{ minRows: 1, maxRows: 10 }}
            bordered={false}
            className="input-group-readonly-text-area"
          />
        </Form.Item>
      </Form.Item>
    );
  };

  const renderEmailAccount = () => {
    return (
      <Form.Item
        label={getLabelToOrRequestedFrom(transferDetails.type)}
        htmlFor="emailAccount"
        className="input-group margin-bottom-6"
        {...colLayout}
      >
        <img
          className="input-group-icon-readonly"
          src={personIcon}
          alt="person"
        />
        <Form.Item name="emailAccount" noStyle>
          <TextArea
            readOnly
            autoSize={{ minRows: 1, maxRows: 10 }}
            bordered={false}
            className="input-group-readonly-text-area"
          />
        </Form.Item>
      </Form.Item>
    );
  };

  let adjustForMobileStyle = {};
  if (isXS(screens) || isSM(screens)) {
    adjustForMobileStyle = {
      background: "white",
      position: "relative",
      top: -100
    };
  }
  return (
    <>
      <Row style={adjustForMobileStyle}>
        {loading ? (
          <Col {...titleProps}>
            {isXS(screens) || isSM(screens)
              ? renderSkeletons(1, "90%", false, true)
              : renderSkeletons(1, "30%", false, true)}
          </Col>
        ) : (
          <Col {...titleProps}>
            <Title level={2} className="margin-top-32">
              {getTitle(transferDetails.type)}
            </Title>
          </Col>
        )}
        <Col span={2} className="text-align-center">
          <Button
            className="form-close-button"
            size="md-link"
            onClick={() => onClose(isCancelled)}
            link
          >
            <img className="form-icon cross-icon" src={crossIcon} alt="close" />
          </Button>
        </Col>
        <Col xs={xsProp} sm={smProp} md={mdProp}>
          <Divider className="light margin-top-10 margin-bottom-0" />
          <Form
            className="margin-top-30 max-width-600 form-bottom-space"
            layout="vertical"
            form={form}
            hideRequiredMark
          >
            {renderLoading()}
            {!loading && (
              <>
                {transferDetails.type === "transfer"
                  ? renderBankAccount()
                  : renderEmailAccount()}
                {transferDetails.type === "received" &&
                transferDetails.eTransferStatus === "Cancelled" ? null : (
                  <img
                    className="input-group-icon-arrow"
                    src={downArrowIcon}
                    alt="downArrow"
                  />
                )}
                {transferDetails.type === "transfer"
                  ? renderEmailAccount()
                  : renderBankAccount()}
                <Form.Item
                  label="Status"
                  htmlFor="status"
                  className="input-group margin-bottom-6"
                  {...colLayout}
                >
                  <img
                    className="input-group-icon-readonly"
                    src={statusIcon}
                    alt="status"
                  />
                  <Form.Item name="status" noStyle>
                    <Input
                      readOnly
                      bordered={false}
                      className="input-group-readonly-input"
                    />
                  </Form.Item>
                </Form.Item>
                <Form.Item
                  label="Amount"
                  htmlFor="amount"
                  className="input-group margin-bottom-6"
                  {...colLayout}
                >
                  <img
                    className="input-group-icon-readonly"
                    src={moneyIcon}
                    alt="amount"
                  />
                  <Form.Item name="amount" noStyle>
                    <Input
                      readOnly
                      bordered={false}
                      className="input-group-readonly-input"
                    />
                  </Form.Item>
                </Form.Item>
                <Form.Item
                  label="Date sent"
                  htmlFor="dateSent"
                  className="input-group margin-bottom-6"
                  {...colLayout}
                >
                  <img
                    className="input-group-icon-readonly"
                    src={calendarIcon}
                    alt="calendar"
                  />
                  <Form.Item name="dateSent" noStyle>
                    <Input
                      readOnly
                      bordered={false}
                      className="input-group-readonly-input"
                    />
                  </Form.Item>
                </Form.Item>
                {IsPendingTransaction(transferDetails.eTransferStatus) && (
                  <Form.Item
                    label="Expiry date"
                    htmlFor="expiryDate"
                    className="input-group margin-bottom-6"
                    {...colLayout}
                  >
                    <img
                      className="input-group-icon-readonly"
                      src={expiryDateIcon}
                      alt="expiryDate"
                    />
                    <Form.Item name="expiryDate" noStyle>
                      <Input
                        readOnly
                        bordered={false}
                        className="input-group-readonly-input"
                      />
                    </Form.Item>
                  </Form.Item>
                )}
                <Text>
                  <span data-testid="on-screen-message">
                    {getMemo(
                      transferDetails.eTransferStatus,
                      transferDetails.aliasName,
                      isCancelled,
                      transferDetails.type,
                      transferDetails.eTransferType
                    )}
                  </span>
                </Text>
                {(screens.lg || screens.xl || screens.xxl) && (
                  <Row style={{ paddingTop: "32px" }}>
                    {IsPendingTransaction(transferDetails.eTransferStatus) && (
                      <Col>
                        <Space>
                          <Button
                            primary
                            block
                            loading={isSendingNotification}
                            onClick={handleResendNotification}
                            style={{ width: 214 }}
                          >
                            {isSendingNotification ? null : (
                              <span data-testid="resend-notification">
                                Resend notification
                              </span>
                            )}
                          </Button>
                          <Button
                            style={{ marginLeft: "12px", width: 208 }}
                            loading={isCancelling}
                            secondary
                            block
                            onClick={handleCancel}
                          >
                            {isCancelling ? null : (
                              <span data-testid="pending-cancel-transaction">
                                Cancel transaction
                              </span>
                            )}
                          </Button>
                        </Space>
                      </Col>
                    )}
                  </Row>
                )}
                {!(screens.lg || screens.xl || screens.xxl) && (
                  <Row style={{ paddingTop: "24px" }}>
                    {IsPendingTransaction(transferDetails.eTransferStatus) && (
                      <>
                        <Col style={{ width: "100%" }}>
                          <Button
                            primary
                            block
                            loading={isSendingNotification}
                            onClick={handleResendNotification}
                          >
                            {isSendingNotification ? null : (
                              <span data-testid="resend-notification">
                                Resend notification
                              </span>
                            )}
                          </Button>
                          <Button
                            loading={isCancelling}
                            secondary
                            block
                            onClick={handleCancel}
                            style={{ marginTop: "20px" }}
                          >
                            {isCancelling ? null : (
                              <span data-testid="pending-cancel-transaction">
                                Cancel transaction
                              </span>
                            )}
                          </Button>
                        </Col>
                      </>
                    )}
                  </Row>
                )}
              </>
            )}
          </Form>
        </Col>
      </Row>
    </>
  );
};

Details.propTypes = {
  onClose: PropTypes.func.isRequired,
  etransferDetails: PropTypes.shape({}).isRequired
};

export default Details;
