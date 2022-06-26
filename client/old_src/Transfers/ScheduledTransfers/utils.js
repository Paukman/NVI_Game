import React from "react";
import trashIcon from "assets/icons/TrashCan/trashcan.svg";
import chevronIcon from "assets/icons/ChevronRight/chevron-right.svg";
import { formatCurrency } from "utils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const transformTransferData = (
  transferData,
  handleClick,
  handleDeleteClick
) => {
  const sortedPayments = transferData.sort((a, b) => {
    const keyA = new Date(a.paymentDate);
    const keyB = new Date(b.paymentDate);

    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  const data = [];

  // This is the data structure needed for the ColumnList.js component, I used width to change the header based on desktop/mobile
  sortedPayments.forEach(transfer => {
    data.push([
      {
        data: (
          <>
            <span className="acct-name">
              {transfer.targetAccountProductName}
            </span>
            ({transfer.targetAccountNumber})
          </>
        ),
        header: "to",
        width: {
          widescreen: "four",
          desktop: "five",
          tablet: "four",
          mobile: "sixteen"
        }
      },
      {
        data: formatCurrency(transfer.amount.value),
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
              {transfer.sourceAccountProductName}
            </span>
            ({transfer.sourceAccountNumber})
          </>
        ),
        header: "From",
        width: {
          widescreen: "five",
          desktop: "four",
          tablet: "five",
          mobile: "nine"
        }
      },
      {
        data: dayjs(transfer.paymentDate, "YYYY-MM-DD").format("MMM DD, YYYY"),
        header: "Next scheduled",
        width: {
          widescreen: "three",
          desktop: "three",
          tablet: "three",
          mobile: "six"
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
              handleDeleteClick(transfer.transferId);
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
            onClick={e => {
              e.stopPropagation();
              handleClick(transfer.transferId);
            }}
          >
            <img alt="Select Transaction" src={chevronIcon} />
          </a>
        ),
        id: transfer.transferId,
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
