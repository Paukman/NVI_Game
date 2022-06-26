import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Space, Typography } from "antd";
import {
  CircleLight,
  CheckMarkCircle,
  FailCircle
} from "StyleGuide/Components/Icons";
import { ErrorTypes, ERROR } from "../constants";

const { Text } = Typography;
export const ErrorMark = ({
  type,
  errorTypes,
  lostFocus,
  isValidPassword,
  isEmptyPassword
}) => {
  ErrorMark.propTypes = {
    type: PropTypes.string.isRequired,
    errorTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    lostFocus: PropTypes.bool.isRequired,
    isValidPassword: PropTypes.bool,
    isEmptyPassword: PropTypes.bool.isRequired
  };
  ErrorMark.defaultProps = {
    isValidPassword: true
  };

  if (lostFocus) {
    if (errorTypes.includes(type)) {
      if (isEmptyPassword)
        return <CircleLight className="margin-top-4" data-testid={type} />;
      return !isValidPassword ? (
        <FailCircle className="margin-top-4" data-testid={type} />
      ) : (
        <CircleLight className="margin-top-4" data-testid={type} />
      );
    }
    return <CheckMarkCircle className="margin-top-4" />;
  }
  return errorTypes.includes(type) ? (
    <CircleLight className="margin-top-4" data-testid={type} />
  ) : (
    <CheckMarkCircle className="margin-top-4" />
  );
};

const ValidationContent = ({
  passwordStatus,
  lostFocus,
  isValidPassword,
  isEmptyPassword
}) => {
  ValidationContent.propTypes = {
    passwordStatus: PropTypes.shape({
      validateStatus: PropTypes.string,
      errorMsg: PropTypes.string
    }).isRequired,
    lostFocus: PropTypes.bool.isRequired,
    isValidPassword: PropTypes.bool,
    isEmptyPassword: PropTypes.bool.isRequired
  };
  ValidationContent.defaultProps = {
    isValidPassword: true
  };
  return (
    <>
      <Space direction="vertical" size={12}>
        <Row>
          <Col span={24}>
            <Space direction="horizontal" align="start">
              {passwordStatus.validateStatus === ERROR
                ? passwordStatus.errorMsg
                : ""}
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space direction="horizontal" align="start">
              <ErrorMark
                type={ErrorTypes.LengthError}
                errorTypes={passwordStatus.types}
                lostFocus={lostFocus}
                isValidPassword={isValidPassword}
                isEmptyPassword={isEmptyPassword}
              />
              <Text className="font-size-14">
                Must be 8-32 characters long (no spaces)
              </Text>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space direction="horizontal" align="start">
              <Text className="font-size-14">
                Must contain at least<strong> 3 of these 4 </strong>character
                types:{" "}
              </Text>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space direction="horizontal" align="start">
              <ErrorMark
                type={ErrorTypes.UppercaseError}
                errorTypes={passwordStatus.types}
                lostFocus={lostFocus}
                isValidPassword={isValidPassword}
                isEmptyPassword={isEmptyPassword}
              />
              <Text className="font-size-14">Uppercase letter (A-Z)</Text>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space direction="horizontal" align="start">
              <ErrorMark
                type={ErrorTypes.LowercaseError}
                errorTypes={passwordStatus.types}
                lostFocus={lostFocus}
                isValidPassword={isValidPassword}
                isEmptyPassword={isEmptyPassword}
              />
              <Text className="font-size-14">Lowercase letter (a-z)</Text>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space direction="horizontal" align="start">
              <ErrorMark
                type={ErrorTypes.DigitError}
                errorTypes={passwordStatus.types}
                lostFocus={lostFocus}
                isValidPassword={isValidPassword}
                isEmptyPassword={isEmptyPassword}
              />
              <Text className="font-size-14">Digit (0-9)</Text>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space direction="horizontal" align="start">
              <ErrorMark
                type={ErrorTypes.SpecialCharacterError}
                errorTypes={passwordStatus.types}
                lostFocus={lostFocus}
                isValidPassword={isValidPassword}
                isEmptyPassword={isEmptyPassword}
              />
              <Text className="font-size-14">Special character</Text>
            </Space>
          </Col>
        </Row>
      </Space>
    </>
  );
};
export default ValidationContent;
