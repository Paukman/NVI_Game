import { formatDate } from "./formatDate";

describe("formatDate", () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  it(">> Should Render MMM DD, YYYY", () => {
    let i = 1;

    while (i < 13) {
      const numMonth = i < 10 ? String(`0${i}`).slice(-2) : i;
      const stringMonth = months[i - 1];
      const argumentDate = `2019-${numMonth}-01`;

      const testCall = formatDate(argumentDate);

      expect(testCall).toEqual(`${stringMonth} 01, 2019`);
      i += 1;
    }
  });

  it(">> Should render empty string", () => {
    const testCall = formatDate(null);
    expect(testCall).toEqual("Invalid Date");
  });
});
