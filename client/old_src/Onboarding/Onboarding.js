import { Carousel, Row, Col, Typography } from "antd";
import React, { Fragment } from "react";
import useResponsive from "utils/hooks/useResponsive";

import closeIcon from "assets/icons/Cross/cross.svg";
import onboardingSlide1Icon from "assets/icons/Onboarding/onboarding-slide1.svg";
import onboardingSlide2Icon from "assets/icons/Onboarding/onboarding-slide2.svg";
import onboardingSlide3Icon from "assets/icons/Onboarding/onboarding-slide3.svg";
import onboardingSlide4Icon from "assets/icons/Onboarding/onboarding-slide4.svg";

import "./Onboarding.less";
import useToggleOnboarding from "./useToggleOnboarding";

const { Title, Text } = Typography;

const carouselItems = [
  {
    title: "Faster, more reliable banking.",
    message:
      "The new ATB Personal has been totally redesigned for improved performance and ease of use. Quick access to all your account balances and transaction details keeps you up to date and in control.",
    icon: onboardingSlide1Icon
  },
  {
    title: "Manage your money, your way.",
    message: (
      <Fragment>
        Smart design makes it simple to navigate, view and transact so you get
        your banking done faster. Pay bills, transfer funds and send or receive
        money by <em>Interac</em> e-Transfer® quickly and easily.
      </Fragment>
    ),

    icon: onboardingSlide2Icon
  },
  {
    title: "Highly secure. Always private.",
    message:
      "Two-factor authentication offers an extra layer of protection designed to verify your identity and prevent unauthorized account access. Banking with ATB Personal is safe and private–guaranteed.",
    icon: onboardingSlide3Icon
  },
  {
    title: "A great start. Much more to come.",
    message:
      "We're working hard to build all our existing features into the new ATB Personal, as well as exciting new additions. Can't find what you're looking for? You can still access it on ATB Online.",
    icon: onboardingSlide4Icon
  }
];

const carouselAutoplaySpeed = 20 * 1000;

const Onboarding = () => {
  const { showOnboarding, hideOnboarding } = useToggleOnboarding();
  const { screenIsAtMost } = useResponsive();

  return (
    showOnboarding && (
      <div className="onboarding">
        <button type="button" onClick={hideOnboarding} className="close">
          <img src={closeIcon} alt="Close icon" />
        </button>
        <Carousel
          className="carousel"
          autoplay
          autoplaySpeed={carouselAutoplaySpeed}
        >
          {carouselItems.map(item => (
            <div key={item.title}>
              <Row className="row">
                <Col
                  xs={{ offset: 2, span: 20, order: 2 }}
                  sm={{ offset: 2, span: 20, order: 2 }}
                  md={{ offset: 2, span: 12, order: 1 }}
                  className={screenIsAtMost("sm") ? "text-align-center" : ""}
                >
                  <Title className="title">{item.title}</Title>
                  <Text className="desc">{item.message}</Text>
                </Col>
                <Col
                  xs={{ offset: 1, span: 22, order: 1 }}
                  sm={{ offset: 2, span: 20, order: 1 }}
                  md={{ offset: 2, span: 6, order: 2 }}
                >
                  <img src={item.icon} alt="icon" className="icon" />
                </Col>
              </Row>
            </div>
          ))}
        </Carousel>
      </div>
    )
  );
};

export default Onboarding;
