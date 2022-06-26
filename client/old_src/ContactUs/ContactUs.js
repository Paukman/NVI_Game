import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { contactSupport, qualtricsIDs } from "globalConstants";
import { Space, Grid, Row, Col, Card, Divider, Typography } from "antd";
import ContactUsIcon from "assets/icons/ContactUs";
import { Container } from "StyleGuide/Components";
import { isSM, isXS, isMD, isLG } from "StyleGuide/Components/utils";
import useContactUsAnalytics, {
  contactType
} from "utils/analytics/useContactUsAnalytics";
import "./styles.less";

const { Title, Paragraph, Link } = Typography;
const { useBreakpoint } = Grid;
const contactUsAnalytics = useContactUsAnalytics();

// TO-DO need to remove explicit style from Divider
// once style guide is updated
const MainContainer = props => {
  const { children } = props;
  MainContainer.propTypes = {
    children: PropTypes.element.isRequired
  };
  return (
    <Row className="margin-top-10">
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
        <Title level={3} className={extraClass}>
          Contact us
        </Title>
        <Divider style={{ borderTopColor: "#d8d9da" }} />
      </Col>
    </Row>
  );
};

const Feedback = () => {
  return (
    <>
      <Row>
        <Col lg={{ span: 24 }}>
          <Title level={4}>Give us your feedback</Title>
          <Paragraph>
            We’re listening. Help us keep improving your online banking
            experience by providing valuable feedback.{" "}
          </Paragraph>
        </Col>
      </Row>
      <Row justify="end">
        <Col>
          <Link
            href={null}
            id={qualtricsIDs.getStarted}
            onClick={() =>
              contactUsAnalytics.contactInitiated(contactType.FEEDBACK)
            }
          >
            Get started
          </Link>
        </Col>
      </Row>
    </>
  );
};

const CallUs = () => {
  return (
    <>
      <Row>
        <Col lg={{ span: 24 }}>
          <Title level={4}>Call us toll free</Title>
          <Paragraph>
            Our Client Care team is available 24/7 every day except Christmas
            Day.
          </Paragraph>
        </Col>
      </Row>
      <Row justify="end">
        <Col>
          <Link
            href={`tel:${contactSupport.PHONE_NUMBER}`}
            onClick={() =>
              contactUsAnalytics.contactInitiated(contactType.CALL)
            }
          >
            {contactSupport.PHONE_NUMBER}
          </Link>
        </Col>
      </Row>
    </>
  );
};

const EmailUs = () => {
  return (
    <>
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <Title level={4}>Email us anytime</Title>
          <Paragraph>
            You should hear back from us within 1-3 business days.
          </Paragraph>
        </Col>
      </Row>
      <Row justify="end">
        <Col>
          <Link
            href={`mailto:${contactSupport.EMAIL}`}
            target="_blank"
            onClick={() =>
              contactUsAnalytics.contactInitiated(contactType.EMAIL)
            }
          >
            {contactSupport.EMAIL}
          </Link>
        </Col>
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

const ContactUs = () => {
  const screens = useBreakpoint();

  useEffect(() => {
    if (window.QSI && window.QSI.API) {
      window.QSI.API.unload();
      window.QSI.API.load();
      window.QSI.API.run();
    }
  }, []);

  const iconSize = imageSize(screens);
  return (
    <MainContainer>
      <Card bordered={false}>
        <Container>
          <TitleContent screens={screens} />
          <Row>
            <Col md={{ span: 12 }} lg={{ span: 12 }}>
              <Space direction="vertical" size={24}>
                <Feedback />
                <CallUs />
                <EmailUs />
              </Space>
            </Col>
            <Col xs={0} md={{ span: 12 }} lg={{ span: 12 }}>
              <ContactUsIcon width={iconSize.width} height={iconSize.height} />
            </Col>
          </Row>
        </Container>
      </Card>
    </MainContainer>
  );
};

export default ContactUs;
