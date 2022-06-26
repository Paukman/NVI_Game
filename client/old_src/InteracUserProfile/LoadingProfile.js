import React from "react";
import { Row, Col, Skeleton, Divider } from "antd";

const LoadingProfile = () => {
  return (
    <>
      <Row className="padding-top-30" data-testid="profile-loading">
        <Col span={20} offset={2}>
          <Skeleton active round paragraph={false} title={{ width: "40%" }} />
          <Divider className="light" />
        </Col>
      </Row>
      <Row className="margin-top-20">
        <Col span={20} offset={2}>
          <Skeleton
            active
            avatar={{ shape: "circle", size: "small" }}
            round
            paragraph={false}
            title={{ width: "52%" }}
          />
        </Col>
      </Row>
      <Row className="margin-top-38 form-bottom-space">
        <Col span={20} offset={2}>
          <Skeleton
            active
            avatar={{ shape: "circle", size: "small" }}
            round
            paragraph={false}
            title={{ width: "52%" }}
          />
        </Col>
      </Row>
    </>
  );
};

export default LoadingProfile;
