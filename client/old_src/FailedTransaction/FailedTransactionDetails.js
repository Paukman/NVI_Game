import React from "react";
import { Row, Col, Typography } from "antd";
import errorIcon from "assets/icons/error.svg";
import accountIcon from "assets/icons/Account/account.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import questionIcon from "assets/icons/questionMark.svg";
import downArrow from "assets/icons/downArrow.svg";
import { contactSupport } from "globalConstants";
import { shape, string } from "prop-types";

const { Link } = Typography;

const FailedTransactionDetails = ({
  transaction: {
    amount,
    associatedFees,
    failureDate,
    failureReason,
    from,
    accountStatusDesc,
    to
  }
}) => {
  FailedTransactionDetails.propTypes = {
    transaction: shape({
      from: string.isRequired,
      to: string.isRequired,
      amount: string.isRequired,
      failureDate: string.isRequired,
      failureReason: string.isRequired,
      associatedFees: string.isRequired,
      accountStatusDesc: string
    }).isRequired
  };

  const transactionDetails = {
    From: {
      icon: (
        <div className="icon-container">
          <img alt="From account icon" src={accountIcon} />
          <img alt="Arrow" className="icon-down-arrow" src={downArrow} />
        </div>
      ),
      value: from
    },
    To: {
      icon: <img alt="To account icon" src={accountIcon} />,
      value: to
    },
    Amount: {
      icon: <img alt="Amount icon" src={moneyIcon} />,
      value: amount
    },
    "Failure date": {
      icon: <img alt="Failure date icon" src={calendarIcon} />,
      value: failureDate
    },
    "Failure reason": {
      icon: <img alt="Failure reason icon" src={questionIcon} />,
      value: failureReason
    },
    "Associated fees": {
      icon: <img alt="Associated fees icon" src={moneyIcon} />,
      value: associatedFees
    }
  };

  return (
    <>
      <Row>
        <Col offset={3} span={1} className="text-align-center">
          <img alt="Error icon" src={errorIcon} />
        </Col>
        <Col offset={2} span={18}>
          <span className="details-title">Failed Transaction</span>
        </Col>
      </Row>

      {Object.keys(transactionDetails).map(label => (
        <Row key={label} align="middle" className="margin-top-24">
          <Col offset={3} span={1} className="text-align-center">
            {transactionDetails[label].icon}
          </Col>
          <Col offset={2} span={17}>
            <div className="font-size-12">{label}</div>
            <div>{transactionDetails[label].value}</div>
          </Col>
        </Row>
      ))}

      {accountStatusDesc && (
        <Row>
          <Col offset={3} span={19} className="margin-top-24">
            <div>{accountStatusDesc}</div>
          </Col>
          <Col offset={3} span={19} className="margin-top-12">
            <Link href={`tel:${contactSupport.PHONE_NUMBER}`}>
              {contactSupport.PHONE_NUMBER}
            </Link>
          </Col>
        </Row>
      )}
    </>
  );
};

export default FailedTransactionDetails;
