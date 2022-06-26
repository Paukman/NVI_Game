// TODO - replace after 8149, 8201
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import dayjs from "dayjs";
import { formatCurrency } from "utils";
import * as formUtils from "utils/formUtils";
import Details from ".";

// these tests are for validating business logic, functional logic validated in containers/Shared/ReviewAndComplete
describe("Details", () => {
  let props = {
    handleDetailsClose: jest.fn(),
    handleDeleteModal: jest.fn()
  };

  // following approach in containers/Pages/MoveMoney/InteracETransfer/SendETransfer/transformETransfer.js

  // following response here: https://atbfinancial.atlassian.net/browse/REB-3120?focusedCommentId=324572
  const oneTime = {
    paymentId:
      "eSdgfrizwCT6kT8GTGitwZbigBZ5XZR3uqnlxQOgJppE3LDOT70Y1p_3Z0-3vowjDI2KlXuEo5CXOwjHWfsI7LH52hV2LcxBEFAxc1IUAFmUFueN1i40clcV08XSlA6A",
    paymentDate: "2020-05-03",
    sourceAccountProductName: "Basic Account",
    // does the nickname exist for every account?
    sourceAccountNickname: "Basic Account",
    sourceAccountNumber: "6679",
    payeeName: "WESTBURNE WEST",
    payeeNickname: "WESTBURNE WEST",
    payeeCustomerReference: "123368",
    amount: {
      currency: "CAD",
      value: 0.01
    },
    // probably won't use these properties for details
    remainingPayments: "1",
    paymentType: "One Time Future Dated",
    // TODO - check if note is created + returned on legacy scheduled transfer
    note: "some note"
  };

  const scheduledNoEndDate = {
    paymentId:
      "m2aPQIKm1A4hwb3dkRwxAlob0JltZkUeSlYNxEkWyxLw-VWEpTFI1AWAIHiu3x3bXfaGX3hoG7A2-6okKpgwcIT8PIL6PDUM5dAtJ2Lbi2c",
    paymentDate: "2020-05-08",
    sourceAccountProductName: "No-Fee All-In Account",
    sourceAccountNumber: "7679",
    payeeName: "STARLAND COUNTY",
    payeeNickname: "STARLAND COUNTY",
    payeeCustomerReference: "123456",
    amount: {
      currency: "CAD",
      value: 1
    },
    paymentExecutionCycle: {
      periodFrequency: 1,
      periodUnit: "Week",
      dayWithinPeriod: 5,
      nextExecutionDate: "2020-05-08",
      lastExecutionDate: null
    },
    remainingPayments: "unlimited",
    paymentType: "Recurring No End Date"
  };

  const scheduledWithEndDate = {
    paymentId:
      "E3uyYvgi754HHSbLh6-Ck1ob0JltZkUeSlYNxEkWyxLVPruM1hY1r02ttX61V8Hd0ewboPtDU9S5u0MLNyWUs4T8PIL6PDUM5dAtJ2Lbi2c",
    paymentDate: "2020-05-08",
    sourceAccountProductName: "Springboard Savings Account",
    sourceAccountNumber: "8879",
    payeeName: "ENMAX",
    payeeNickname: "ENMAX",
    payeeCustomerReference: "12345678910",
    amount: {
      currency: "CAD",
      value: 12
    },
    paymentExecutionCycle: {
      periodFrequency: 1,
      periodUnit: "Week",
      dayWithinPeriod: 3,
      nextExecutionDate: "2020-05-08",
      lastExecutionDate: "2020-07-17"
    },
    remainingPayments: "11",
    paymentType: "Recurring With End Date"
  };

  // TODO - move all render tests under /components/ReviewLabelDetails
  describe("> renders", () => {
    describe("> one time (base)", () => {
      beforeEach(() => {
        props = {
          ...props,
          data: oneTime
        };
      });

      it(">> title", () => {
        const { getByText } = render(<Details {...props} />);

        expect(getByText("Scheduled payment details"));
      });
      it(">> cross", () => {
        const { getByAltText } = render(<Details {...props} />);

        // this validates existence of both label + icon
        expect(getByAltText("Close scheduled payment"));
      });
      it(">> from", () => {
        const { getByText, getByAltText } = render(<Details {...props} />);

        const from = `${props.data.sourceAccountNickname ||
          props.data.sourceAccountProductName} (${
          props.data.sourceAccountNumber
        })`;

        expect(getByAltText("From"));
        expect(getByText(from));
      });
      it(">> to", () => {
        const { getByText, getByAltText } = render(<Details {...props} />);

        const to = `${props.data.payeeNickname || props.data.payeeName} (${
          props.data.payeeCustomerReference
        })`;

        expect(getByAltText("To"));
        expect(getByText(to));
      });
      it(">> amount", () => {
        const { getByText, getByAltText } = render(<Details {...props} />);

        const amount = formatCurrency(
          props.data.amount.value,
          props.data.amount.currency
        );

        expect(getByAltText("Amount"));

        // TODO - will likely have to format this amount first
        expect(getByText(amount));
      });
      it(">> when", () => {
        const { getByText, getByAltText } = render(<Details {...props} />);

        expect(getByAltText("When"));

        const paymentDate = dayjs(props.data.paymentDate).format(
          "MMM DD, YYYY"
        );
        // TODO - will likely have to format this amount first
        expect(getByText(paymentDate));
      });
      it(">> note if note exists", () => {
        const { getByText, getByAltText } = render(<Details {...props} />);

        expect(getByAltText("Note to self"));
        expect(getByText(props.data.note));
      });

      it(">> delete button", () => {
        const { getByLabelText } = render(<Details {...props} />);

        expect(getByLabelText("Delete"));
      });
    });
    describe("> recurring", () => {
      describe("> no end date", () => {
        beforeEach(() => {
          props = {
            ...props,
            data: scheduledNoEndDate
          };
        });

        it(">> frequency", () => {
          jest.spyOn(formUtils, "getFrequencyText");
          const { getByText, getByAltText } = render(<Details {...props} />);
          const frequency = `${props.data.paymentExecutionCycle.periodUnit}ly`;

          expect(getByAltText("Frequency"));
          expect(getByText(frequency));
          expect(formUtils.getFrequencyText).toBeCalledWith(1, "Week");

          jest.resetAllMocks();
        });
        it(">> next scheduled", () => {
          const { getByText, getByAltText } = render(<Details {...props} />);

          const frequencyDate = dayjs(
            props.data.paymentExecutionCycle.nextExecutionDate
          ).format("MMM DD, YYYY");

          expect(getByAltText("Next scheduled"));
          expect(getByText(frequencyDate));
        });
        it(">> ending", () => {
          const { getByText, getByAltText } = render(<Details {...props} />);

          expect(getByAltText("Ending"));
          expect(getByText("Never"));
        });
      });
      describe("> end date", () => {
        beforeEach(() => {
          props = {
            ...props,
            data: scheduledWithEndDate
          };
        });
        it(">> ending", () => {
          const { getByText, getByAltText } = render(<Details {...props} />);

          const ending = dayjs(
            props.data.paymentExecutionCycle.lastExecutionDate
          ).format("MMM DD, YYYY");

          expect(getByAltText("Ending"));
          expect(getByText(ending));
        });
        it(">> number of payments", () => {
          const { getByText, getByAltText } = render(<Details {...props} />);

          const remainingPayments = `${props.data.remainingPayments} payments`;

          expect(getByAltText("Number of payments remaining"));
          expect(getByText(remainingPayments));
        });
      });
    });
  });
  describe("> user actions", () => {
    it(">> onClose called when cross is clicked", () => {
      const { getByAltText } = render(<Details {...props} />);
      act(() => {
        fireEvent.click(getByAltText("Close scheduled payment"));
      });
      expect(props.handleDetailsClose).toHaveBeenCalledTimes(1);
    });
    it(">> onDelete called when delete is clicked", () => {
      const { getByLabelText } = render(<Details {...props} />);

      act(() => {
        fireEvent.click(getByLabelText("Delete"));
      });
      expect(props.handleDeleteModal).toHaveBeenCalledTimes(1);
    });
  });
});
