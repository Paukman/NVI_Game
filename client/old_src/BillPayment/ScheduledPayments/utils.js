import React from "react";
import trashIcon from "assets/icons/TrashCan/trashcan.svg";
import chevronIcon from "assets/icons/ChevronRight/chevron-right.svg";
import { formatCurrency } from "utils";
import dayjs from "dayjs";

export const transformTransactionList = (
  paymentsData,
  handleClick,
  handleDeleteClick,
  width
) => {
  const sortedPayments = paymentsData.sort((a, b) => {
    const keyA = new Date(a.paymentDate);
    const keyB = new Date(b.paymentDate);

    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  const data = [];

  // This is the data structure needed for the ColumnList.js component, I used width to change the header based on desktop/mobile
  sortedPayments.forEach((payment, index) => {
    data.push([
      {
        data: (
          <>
            <span className="acct-name" data-testid={`item-payments-${index}`}>
              {payment.payeeNickname
                ? payment.payeeNickname
                : payment.payeeName}
            </span>
          </>
        ),
        header: width < 768 ? "to" : "Payee",
        width: {
          widescreen: "four",
          desktop: "five",
          tablet: "four",
          mobile: "sixteen"
        }
      },
      {
        data: (
          <span
            data-testid={`item-payments-amount-${payment.amount.value
              .toString()
              .replace(".", "")}`}
          >
            {formatCurrency(payment.amount.value)}
          </span>
        ),
        header: "Amount",
        width: {
          widescreen: "two",
          desktop: "two",
          tablet: "two",
          mobile: "sixteen"
        }
      },
      {
        data: (
          <>
            <span className="acct-name">
              {payment.sourceAccountNickname
                ? payment.sourceAccountNickname
                : payment.sourceAccountProductName}
            </span>
            ({payment.sourceAccountNumber})
          </>
        ),
        header: "From",
        width: {
          widescreen: "five",
          desktop: "four",
          tablet: "five",
          mobile: "eight"
        }
      },
      {
        data: dayjs(payment.paymentDate, "YYYY-MM-DD").format("MMM DD, YYYY"),
        id: payment.paymentId,
        header: "Next scheduled",
        width: {
          widescreen: "three",
          desktop: "three",
          tablet: "three",
          mobile: "eight"
        }
      },
      {
        data: (
          <a
            role="button"
            href={null}
            className="trash-can"
            onClick={e => {
              e.stopPropagation();
              handleDeleteClick(payment.paymentId);
            }}
          >
            <img alt="Delete" src={trashIcon} />
          </a>
        ),
        width: {
          widescreen: "one",
          desktop: "one",
          tablet: "one",
          mobile: "one"
        }
      },
      {
        data: (
          <a
            role="button"
            href={null}
            className="column-list-chevron"
            onClick={() => {}}
          >
            <img alt="Select Transaction" src={chevronIcon} />
          </a>
        ),
        id: payment.paymentId,
        width: {
          widescreen: "one",
          desktop: "one",
          tablet: "one",
          mobile: "one"
        }
      }
    ]);
  });
  return {
    className: "collapsed-move-money",
    columns: data,
    handleClick
  };
};
