import React from "react";
import PropTypes from "prop-types";
import { Space, Grid, Row, Col, Card, Divider, Typography } from "antd";
import PrivacyAndSecurityIcon from "assets/icons/PrivacyAndSecurity";
import ExternalLinkIcon from "assets/icons/ExternalLink";
import { Container } from "StyleGuide/Components";
import { isSM, isXS, isMD, isLG } from "StyleGuide/Components/utils";
import usePrivacyAndSecurityAnalytics, {
  disclaimerType
} from "utils/analytics/usePrivacyAndSecurityAnalytics";
import "./styles.less";

const { Title, Paragraph, Link } = Typography;
const { useBreakpoint } = Grid;
const privacyAndSecurityAnalytics = usePrivacyAndSecurityAnalytics();

// TO-DO need to remove explicit style from Divider
// once style guide is updated
const MainContainer = props => {
  const { children } = props;
  MainContainer.propTypes = {
    children: PropTypes.element.isRequired
  };
  return (
    <Row className="margin-top-10 privacy-and-security-container">
      <Col lg={{ span: 24 }}>{children}</Col>
    </Row>
  );
};

const TitleContent = ({ screens }) => {
  TitleContent.propTypes = {
    screens: PropTypes.objectOf(PropTypes.bool).isRequired
  };
  const extraClass = isSM(screens) || isXS(screens) ? "small-h3-headings" : "";
  return (
    <Row>
      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
        <Title level={2} className={extraClass}>
          Privacy & security
        </Title>
        <Divider style={{ borderTopColor: "#d8d9da" }} />
      </Col>
    </Row>
  );
};

const PrivacyCode = () => {
  return (
    <>
      <Row>
        <Col lg={{ span: 24 }}>
          <Title level={4}>Privacy code</Title>
          <Paragraph>
            ATB is committed to protecting the privacy, confidentiality, and
            security of your personal information.{" "}
          </Paragraph>
        </Col>
      </Row>
      <Row style={{ height: "44px" }}>
        <Link
          href="https://www.atb.com/company/privacy-and-security"
          target="_blank"
          onClick={() =>
            privacyAndSecurityAnalytics.disclaimerOpened(disclaimerType.PRIVACY)
          }
        >
          <ExternalLinkIcon style={{ paddingRight: "5px" }} />
          Read our privacy code
        </Link>
      </Row>
    </>
  );
};

const Guarantee = () => {
  return (
    <>
      <Row>
        <Col lg={{ span: 24 }}>
          <Title level={4}>Online banking security guarantee</Title>
          <Paragraph>
            {
              "We take security seriously. Beyond our extensive security features, we're putting our money where our mouth is."
            }
          </Paragraph>
        </Col>
      </Row>
      <Row style={{ height: "44px" }}>
        <Link
          href="https://www.atb.com/company/privacy-and-security/online-guarantee"
          target="_blank"
          onClick={() =>
            privacyAndSecurityAnalytics.disclaimerOpened(
              disclaimerType.SECURITY
            )
          }
        >
          <ExternalLinkIcon style={{ paddingRight: "5px" }} />
          Read our guarantee
        </Link>
      </Row>
    </>
  );
};

const imageSize = screens => {
  if (isLG(screens) || isMD(screens)) {
    return {
      width: 375,
      height: 262
    };
  }
  return {
    width: 490,
    height: 343
  };
};

const PrivacyAndSecurity = () => {
  const screens = useBreakpoint();

  const iconSize = imageSize(screens);
  return (
    <MainContainer>
      <Card bordered={false}>
        <Container>
          <TitleContent screens={screens} />
          <Row>
            <Col md={{ span: 12 }} lg={{ span: 12 }}>
              <Space direction="vertical" size={15}>
                <PrivacyCode />
                <Guarantee />
              </Space>
            </Col>
            <Col xs={0} md={{ span: 12 }} lg={{ span: 12 }}>
              <PrivacyAndSecurityIcon
                width={iconSize.width}
                height={iconSize.height}
              />
            </Col>
          </Row>
        </Container>
      </Card>
    </MainContainer>
  );
};

export default PrivacyAndSecurity;
