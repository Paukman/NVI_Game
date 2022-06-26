import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import {
  mockApiData,
  RenderWithProviders,
  windowMatchMediaMock
} from "utils/TestUtils";
import accountIcon from "assets/icons/FromAccount/account.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import personIcon from "assets/icons/Person/person.svg";
import questionIcon from "assets/icons/Question/question.svg";
import answerIcon from "assets/icons/Answer/answer.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import feeIcon from "assets/icons/Fee/fee.svg";
import frequencyIcon from "assets/icons/Frequency/frequency.svg";
import messageIcon from "assets/icons/Message/message.svg";
import mockApi from "api";
import ReviewAndComplete from "Common/ReviewAndComplete/index";
import MockDate from "mockdate";
import { requestETransferErrors } from "utils/MessageCatalog";

describe("Review And Complete Tests", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  const id = "etransfer";
  const data = {
    From: {
      visible: true,
      imageIcon: accountIcon,
      title: "From",
      label: "Basic Savings"
    },
    DownArrow: {
      visible: true,
      imageIcon: downArrowIcon
    },
    To: {
      visible: true,
      imageIcon: personIcon,
      title: "To",
      label: "Aaaron Ash"
    },
    SecurityQuestion: {
      visible: true,
      imageIcon: questionIcon,
      title: "Security question",
      label: "What is your favorite ice cream?"
    },
    SecurityAnswer: {
      visible: true,
      imageIcon: answerIcon,
      title: "Security answer"
    },
    Amount: {
      visible: true,
      imageIcon: moneyIcon,
      title: "Amount",
      label: "$100.00"
    },
    Fee: {
      visible: true,
      imageIcon: feeIcon,
      title: "Transaction fee",
      label: "$1.50"
    },
    CreatedTime: {
      visible: true,
      imageIcon: frequencyIcon,
      title: "When",
      label: "Jan 25, 2020"
    },
    Message: {
      visible: true,
      imageIcon: messageIcon,
      title: "Message",
      label: "None"
    }
  };
  const dataToPost = {
    eTransferType: "Regular eTransfer",
    fromAccount: {
      name: "Basic Account",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    recipient: {
      recipientId: "CAuTRu9eXMwp",
      aliasName: "Aaaron A Ash"
    },
    amount: {
      value: 10,
      currency: "CAD"
    },
    memo: "This is a test"
  };

  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> it should send etransfer with isRSA false and get a confirmation ID and etransfer send success", async () => {
    const config = {
      data: {
        headers: {
          devicePrint: "mockDevicePrint",
          geoLocation: "mockGeoLocation",
          "requester-user-agent":
            "Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0",
          "rsa-device":
            "eyJIYXJkd2FyZUlEIjoiV0VCIiwiR2VvTG9jYXRpb25JbmZvIjoiIn0="
        }
      },
      // TODO: move to the URL constants???
      url: "/api/atb-rebank-api-etransfers/outgoingmoneyrequest/create/",
      isRSA: false,
      renderMessage: requestETransferErrors.MSG_RBET_013C
    };

    mockApiData([
      {
        url: config.url,
        method: "POST",
        results: {
          data: {
            confirmationID: "12345"
          }
        }
      }
    ]);

    const prevTab = jest.fn();
    const editButton = jest.fn();
    const handleSubmit = jest.fn();

    const { container, rerender } = render(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <ReviewAndComplete
          id={id}
          type="review"
          dataToPost={dataToPost}
          labelData={data}
          prevTab={prevTab}
          editButton={editButton}
          nextTab={handleSubmit}
          config={config}
          errorCrossReference={() => {}}
          failureAlert={() => {}}
          onConfirmAnalytics={() => {}}
          onSuccessAnalytics={() => {}}
          onFailureAnalytics={() => {}}
        />
      </RenderWithProviders>
    );

    const sendButton = container.querySelector(".primary-button button span");

    await act(async () => {
      fireEvent.click(sendButton);
    });
    expect(mockApi.post).toHaveBeenCalledWith(
      config.url,
      dataToPost,
      config.data
    );
    rerender(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <ReviewAndComplete
          id={id}
          type="complete"
          prevTab={prevTab}
          labelData={data}
        />
      </RenderWithProviders>
    );

    expect(
      container.querySelector("#etransfer-buttons-send-another-transfer")
        .textContent
    ).toEqual("Send another transfer");
  });

  it(">> it should send etransfer with isRSA false and get a confirmation ID and etransfer request success", async () => {
    const config = {
      data: {
        headers: {
          devicePrint: "mockDevicePrint",
          geoLocation: "mockGeoLocation",
          "requester-user-agent":
            "Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0",
          "rsa-device":
            "eyJIYXJkd2FyZUlEIjoiV0VCIiwiR2VvTG9jYXRpb25JbmZvIjoiIn0="
        }
      },
      // TODO: move to the URL constants???
      url: "/api/atb-rebank-api-etransfers/outgoingmoneyrequest/create/",
      isRSA: false,
      renderMessage: requestETransferErrors.MSG_RBET_013C
    };

    mockApiData([
      {
        url: config.url,
        method: "POST",
        results: {
          data: {
            confirmationID: "12345"
          }
        }
      }
    ]);

    const prevTab = jest.fn();
    const editButton = jest.fn();
    const handleSubmit = jest.fn();

    const { container, rerender } = render(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <ReviewAndComplete
          id={id}
          type="review"
          dataToPost={dataToPost}
          labelData={data}
          prevTab={prevTab}
          editButton={editButton}
          nextTab={handleSubmit}
          config={config}
          errorCrossReference={() => {}}
          failureAlert={() => {}}
          onConfirmAnalytics={() => {}}
          onSuccessAnalytics={() => {}}
          onFailureAnalytics={() => {}}
        />
      </RenderWithProviders>
    );

    const sendButton = container.querySelector(".primary-button button span");

    await act(async () => {
      fireEvent.click(sendButton);
    });
    expect(mockApi.post).toHaveBeenCalledWith(
      config.url,
      dataToPost,
      config.data
    );
    rerender(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <ReviewAndComplete
          id={id}
          type="complete"
          prevTab={prevTab}
          labelData={data}
        />
      </RenderWithProviders>
    );

    expect(
      container.querySelector("#etransfer-buttons-send-another-transfer")
        .textContent
    ).toEqual("Send another transfer");
  });

  it(">> it should fail send etransfer with isRSA false and get error message on etransfer send", async () => {
    const alertMessage = {
      title: "Request Limit Exceeded",
      errorMessage:
        "You've exceeded your maximum number of outstanding requests. Cancel an existing request to send now.",
      buttons: [{ buttonName: "OK" }]
    };

    const config = {
      data: {
        headers: {
          devicePrint: "mockDevicePrint",
          geoLocation: "mockGeoLocation",
          "requester-user-agent":
            "Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0",
          "rsa-device":
            "eyJIYXJkd2FyZUlEIjoiV0VCIiwiR2VvTG9jYXRpb25JbmZvIjoiIn0="
        }
      },
      // TODO: move to the URL constants???
      url: "/api/atb-rebank-api-etransfers/outgoingmoneyrequest/create/",
      isRSA: false,
      renderMessage: requestETransferErrors.MSG_RBET_013C
    };

    mockApiData([
      {
        url: config.url,
        method: "POST",
        result: [],
        error: {
          config: {
            url: config.url
          },
          message:
            "You've exceeded your maximum number of outstanding requests. Cancel an existing request to send now."
        }
      }
    ]);

    const prevTab = jest.fn();
    const editButton = jest.fn();
    const handleSubmit = jest.fn();

    const { container, rerender } = render(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <ReviewAndComplete
          id={id}
          type="review"
          dataToPost={dataToPost}
          alertMessage={alertMessage}
          labelData={data}
          prevTab={prevTab}
          editButton={editButton}
          nextTab={handleSubmit}
          config={config}
          errorCrossReference={() => {}}
          failureAlert={() => {
            return alertMessage;
          }}
          onConfirmAnalytics={() => {}}
          onSuccessAnalytics={() => {}}
          onFailureAnalytics={() => {}}
        />
      </RenderWithProviders>
    );

    const sendButton = container.querySelector(".primary-button button span");

    await act(async () => {
      fireEvent.click(sendButton);
    });

    expect(mockApi.post).toHaveBeenCalledWith(
      config.url,
      dataToPost,
      config.data
    );

    rerender(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <ReviewAndComplete
          id={id}
          type="complete"
          prevTab={prevTab}
          labelData={data}
        />
      </RenderWithProviders>
    );

    expect(
      container.querySelector("#etransfer-buttons-send-another-transfer")
        .textContent
    ).toEqual("Send another transfer");
  });

  it(">> it should fail send etransfer with isRSA false and get error message on etransfer request", async () => {
    const alertMessage = {
      title: "Request Limit Exceeded",
      errorMessage:
        "You've exceeded your maximum number of outstanding requests. Cancel an existing request to send now.",
      buttons: [{ buttonName: "OK" }]
    };

    const config = {
      data: {
        headers: {
          devicePrint: "mockDevicePrint",
          geoLocation: "mockGeoLocation",
          "requester-user-agent":
            "Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0",
          "rsa-device":
            "eyJIYXJkd2FyZUlEIjoiV0VCIiwiR2VvTG9jYXRpb25JbmZvIjoiIn0="
        }
      },
      // TODO: move to the URL constants???
      url: "/api/atb-rebank-api-etransfers/outgoingmoneyrequest/create/",
      isRSA: false,
      renderMessage: requestETransferErrors.MSG_RBET_013C
    };

    mockApiData([
      {
        url: config.url,
        method: "POST",
        result: [],
        error: {
          config: {
            url: config.url
          },
          message:
            "You've exceeded your maximum number of outstanding requests. Cancel an existing request to send now."
        }
      }
    ]);

    const prevTab = jest.fn();
    const editButton = jest.fn();
    const handleSubmit = jest.fn();

    const { container, rerender } = render(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <ReviewAndComplete
          id={id}
          type="review"
          dataToPost={dataToPost}
          alertMessage={alertMessage}
          labelData={data}
          prevTab={prevTab}
          editButton={editButton}
          nextTab={handleSubmit}
          config={config}
          errorCrossReference={() => {}}
          failureAlert={() => {
            return alertMessage;
          }}
          onConfirmAnalytics={() => {}}
          onSuccessAnalytics={() => {}}
          onFailureAnalytics={() => {}}
        />
      </RenderWithProviders>
    );

    const sendButton = container.querySelector(".primary-button button span");

    await act(async () => {
      fireEvent.click(sendButton);
    });

    expect(mockApi.post).toHaveBeenCalledWith(
      config.url,
      dataToPost,
      config.data
    );

    rerender(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <ReviewAndComplete
          id={id}
          type="complete"
          prevTab={prevTab}
          labelData={data}
        />
      </RenderWithProviders>
    );

    expect(
      container.querySelector("#etransfer-buttons-send-another-transfer")
        .textContent
    ).toEqual("Send another transfer");
  });
});
