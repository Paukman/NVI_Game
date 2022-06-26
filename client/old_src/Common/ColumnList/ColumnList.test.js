import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import trashIcon from "assets/icons/TrashCan/trashcan.svg";
import chevronIcon from "assets/icons/ChevronRight/chevron-right.svg";
import ColumnList from ".";

const defaultHeaders = [
  {
    header: "Payee",
    width: {
      desktop: "four",
      tablet: "four"
    }
  },
  {
    header: "Amount",
    width: {
      desktop: "three",
      tablet: "three"
    }
  },
  {
    header: "From",
    width: {
      desktop: "five",
      tablet: "four"
    }
  },
  {
    header: "Next scheduled date",
    width: {
      desktop: "four",
      tablet: "five"
    }
  }
];

// An object is passed down that contains all of the data per column, header (used for mobile) and a width to control the grid
// The transformer for this data sits in ScheduledPayments/utils.js
describe("ColumnList", () => {
  let props;
  const genericClick = jest.fn();
  beforeEach(() => {
    props = {
      columns: [
        [
          {
            data: "first column data",
            header: "Payee",
            width: {
              desktop: "four",
              tablet: "four",
              mobile: "four"
            }
          },
          {
            data: "second column data",
            header: "Amount",
            hasIcon: true,
            width: {
              desktop: "four"
            }
          },
          {
            data: (
              <a
                role="button"
                href={null}
                className="trash-can"
                onClick={genericClick}
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
            id: "123456",
            width: {
              widescreen: "one",
              desktop: "one",
              tablet: "one",
              mobile: "one"
            }
          }
        ]
      ],
      handleClick: () => {}
    };
  });

  describe("> renders", () => {
    describe("> default", () => {
      it(">> first row renders data", () => {
        const { getByText } = render(
          <ColumnList
            columnData={props}
            defaultHeaders={defaultHeaders}
            loading={false}
          />
        );

        expect(getByText(props.columns[0][0].data));
      });

      it(">> second column renders data, tests className", () => {
        const { getByText, container } = render(
          <ColumnList
            columnData={props}
            defaultHeaders={defaultHeaders}
            loading={false}
          />
        );
        expect(getByText(props.columns[0][1].data));
        expect(
          container.getElementsByClassName("four wide column")
        ).toBeTruthy();
      });

      it(">> trash can, tests className", () => {
        const { getByAltText, container } = render(
          <ColumnList
            columnData={props}
            defaultHeaders={defaultHeaders}
            loading={false}
          />
        );
        expect(getByAltText("Select Transaction"));
        expect(
          container.getElementsByClassName(
            "four wide computer four wide tablet column four wide mobile"
          )
        ).toBeTruthy();
      });
      it(">> Delete Icon", () => {
        const { getByAltText } = render(
          <ColumnList
            columnData={props}
            defaultHeaders={defaultHeaders}
            loading={false}
          />
        );
        expect(getByAltText("Delete"));
      });
    });
  });

  describe("> user actions", () => {
    it(">> trash click", () => {
      const { getByAltText } = render(
        <ColumnList
          columnData={props}
          defaultHeaders={defaultHeaders}
          loading={false}
        />
      );

      act(() => {
        fireEvent.click(getByAltText("Delete"));
      });
      expect(genericClick).toHaveBeenCalledTimes(1);
    });
    it(">> chevron click", () => {
      const { getByAltText } = render(
        <ColumnList
          columnData={props}
          defaultHeaders={defaultHeaders}
          loading={false}
        />
      );
      act(() => {
        fireEvent.click(getByAltText("Select Transaction"));
      });
      expect(genericClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("> Skeleton State", () => {
    it(">> Skeleton presence", () => {
      const { queryByTestId } = render(
        <ColumnList
          columnData={props}
          defaultHeaders={defaultHeaders}
          loading
        />
      );

      expect(queryByTestId(/column-list-skeleton/)).toBeTruthy();
    });
  });
});
