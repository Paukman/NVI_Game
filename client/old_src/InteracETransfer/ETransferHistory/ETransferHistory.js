import React, { useState, useEffect, useContext } from "react";
import api, { etransfersBaseUrl } from "api";
import dayjs from "dayjs";
import { isXS, isSM, isMD } from "StyleGuide/Components/utils";
import { Button } from "StyleGuide/Components";

import {
  Col,
  Divider,
  Row,
  Table,
  Typography,
  Skeleton,
  List,
  Grid
} from "antd";
import { formatCurrency } from "utils";
import { ModalContext, systemErrorAlert } from "Common/ModalProvider";

import { eTransferErrors } from "utils/MessageCatalog";
import chevron from "assets/icons/ChevronRight/chevron-right.svg";
import showMore from "assets/icons/ShowMore/show-more.svg";
import Details from "./Details";
import Status from "./Status";
import "./styles.less";
import useScrollPosition from "./useScrollPosition";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ETransferHistory = () => {
  const [pendingHistory, setPendingHistory] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);

  const [postedHistory, setPostedHistory] = useState([]);
  const [loadingPosted, setLoadingPosted] = useState(true);

  const [showEndOfResultsMessage, setShowEndOfResultsMessage] = useState(false);
  const [pageFrom, setPageFrom] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [rememberScrollPosition, restoreScrollPosition] = useScrollPosition();

  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const [isClicked, setIsClicked] = useState(false);
  const [etransferDetails, setetransferDetails] = useState({
    eTransferId: "",
    type: ""
  });
  const [isDataChanged, setIsDataChanged] = useState(false);
  const screens = useBreakpoint();

  const showSystemError = () => {
    showModal(systemErrorAlert(null, hideModal));
  };

  useEffect(() => {
    let isMounted = true;
    if (!loadingPending) setLoadingPending(true);
    if (!loadingPosted) setLoadingPosted(true);
    const fetchPending = async () => {
      try {
        const results = await api.get(`${etransfersBaseUrl}/pending`);
        if (isMounted) {
          setPendingHistory(results.data);
          setLoadingPending(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoadingPending(false);
          throw error;
        }
      }
    };

    const fetchPosted = async () => {
      try {
        const results = await api.get(
          `${etransfersBaseUrl}/posted?paging=true`
        );
        if (isMounted) {
          setPostedHistory(results.data.transfers);
          setLoadingPosted(false);
          setHasMore(results.data.hasMore);
          setPageFrom(results.data.pageFrom);
        }
      } catch (error) {
        if (isMounted) {
          setLoadingPosted(false);
          throw error;
        }
      }
    };

    Promise.all([fetchPending(), fetchPosted()]).catch(() => {
      showSystemError();
    });
    return () => {
      isMounted = false;
    };
  }, [isDataChanged]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const results = await api.get(
        `${etransfersBaseUrl}/posted?paging=true&pageFrom=${pageFrom}`
      );
      setPostedHistory([...postedHistory, ...results.data.transfers]);
      setHasMore(results.data.hasMore);
      setPageFrom(results.data.pageFrom);

      if (!results.data.hasMore) {
        setShowEndOfResultsMessage(true);
      }
    } catch (e) {
      showSystemError();
    }
    setLoadingMore(false);
  };

  const handleClick = row => {
    if (isDataChanged) setIsDataChanged(false);
    setIsClicked(true);

    rememberScrollPosition();
    setetransferDetails({ eTransferId: row.id, type: row.type });
  };

  const getColumns = type => [
    {
      title: "Date",
      dataIndex: "requestDate",
      key: "date",
      ellipsis: {
        showTitle: false
      },
      width: isMD(screens) ? "26%" : "28%",
      render: date =>
        date ? (
          <span
            data-testid={`${type.toLowerCase()}-date-${dayjs(date).format(
              "MMM DD, YYYY"
            )}`}
          >
            {dayjs(date).format("MMM DD, YYYY")}
          </span>
        ) : (
          ""
        )
    },
    {
      title: "Name",
      dataIndex: "recipient",
      ellipsis: {
        showTitle: false
      },
      width: isMD(screens) ? "32%" : "29%",
      key: "recipient",
      render: name => <span data-testid="recipient-name">{name}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: isMD(screens) ? "22%" : "21%",
      render: status => <Status status={status} />
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: isMD(screens) ? "20%" : "22%",
      render: amount => (
        <span
          data-testid={`${type.toLowerCase()}-amount-${amount.replace(
            ".",
            ""
          )}`}
        >
          {formatCurrency(amount)}
        </span>
      )
    }
  ];

  const locale = (type, loading, loadingRows) => ({
    emptyText: (
      <Row>
        <Col xs={{ offset: 1, span: 22 }} sm={{ offset: 0, span: 24 }}>
          {loading && (
            <Skeleton
              active
              title={false}
              round
              paragraph={{ rows: loadingRows, width: "100%" }}
            />
          )}
          {!loading && (
            <Text
              className="no-data"
              data-testid={`${type.toLowerCase()}-nodata`}
            >
              There are no transaction records to display.
            </Text>
          )}
        </Col>
      </Row>
    )
  });

  const renderTable = (type, loading, loadingRows, data) => {
    return (
      <>
        <Title
          className="margin-top-32 margin-bottom-16"
          data-testid={`${type.toLowerCase()}-label`}
          level={5}
        >
          {type} transfers
        </Title>

        <Table
          data-testid={`${type.toLowerCase()}-table`}
          dataSource={data}
          columns={getColumns(type)}
          pagination={false}
          loading={false}
          rowKey="id"
          rowClassName="cursor-pointer"
          onRow={row => ({
            onClick: () => {
              handleClick(row);
            }
          })}
          locale={locale(type, loading, loadingRows)}
        />
      </>
    );
  };

  const renderList = (type, loading, loadingRows, data) => {
    const header = (
      <Row>
        <Col offset={1}>
          <Title
            className="margin-top-32"
            data-testid={`${type.toLowerCase()}-label`}
            level={5}
          >
            {type} transfers
          </Title>
        </Col>
      </Row>
    );
    return (
      <>
        <List
          itemLayout="vertical"
          header={header}
          dataSource={data}
          locale={locale(type, loading, loadingRows)}
          renderItem={item => (
            <List.Item key={item.id}>
              <Row align="middle" onClick={() => handleClick(item)}>
                <Col offset={1} span={14} className="description">
                  <Text className="title">{formatCurrency(item.amount)}</Text>
                  <Row>
                    <Col>{item.recipient}</Col>
                  </Row>
                  <Row>
                    <Col>{dayjs(item.requestDate).format("MMM DD, YYYY")}</Col>
                  </Row>
                </Col>
                <Col span={6} className="status">
                  <Status status={item.status} />
                </Col>
                <Col span={2}>
                  <img
                    alt="Right Arrow"
                    className="right arrow"
                    src={chevron}
                  />
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </>
    );
  };

  return isClicked === false ? (
    <div className="etransfer-history">
      <Row>
        <Col xs={24} md={{ offset: 1, span: 22 }}>
          {!(isXS(screens) || isSM(screens)) && (
            <>
              <Title className="margin-top-32" level={2}>
                Transfer history
              </Title>
              <Divider className="light" />
              {renderTable("Pending", loadingPending, 4, pendingHistory)}
              {renderTable("Posted", loadingPosted, 8, postedHistory)}
            </>
          )}
          {(isXS(screens) || isSM(screens)) && (
            <>
              {renderList("Pending", loadingPending, 4, pendingHistory)}
              {renderList("Posted", loadingPosted, 8, postedHistory)}
            </>
          )}
          {hasMore && !loadingMore && (
            <div className="text-align-center margin-top-16 show-more">
              <Button link onClick={handleLoadMore}>
                <img alt="Show more" src={showMore} />
                Show more
              </Button>
            </div>
          )}
          {loadingMore && (
            <div className="ant-table-placeholder padding-left-16 padding-right-16">
              <Skeleton
                active
                title={false}
                round
                paragraph={{ rows: 4, width: "100%" }}
              />
            </div>
          )}
          {showEndOfResultsMessage && (
            <Text className="no-moredata" data-testid="posted-no-moredata">
              {eTransferErrors.MSG_REBAS_014B}
            </Text>
          )}
        </Col>
      </Row>
    </div>
  ) : (
    <Details
      etransferDetails={etransferDetails}
      onClose={isCancelled => {
        setIsClicked(false);
        if (isCancelled) {
          setIsDataChanged(true);
        }

        restoreScrollPosition();
      }}
    />
  );
};

export default ETransferHistory;
