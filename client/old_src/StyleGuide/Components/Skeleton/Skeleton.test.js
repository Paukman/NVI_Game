import React from "react";
import { render } from "@testing-library/react";
import { getNodeText } from "@testing-library/dom";
import Skeleton, {
  largeParagraph,
  mediumParagraph,
  smallParagraph
} from "./Skeleton";

describe("Skeleton", () => {
  it("should render children large when not loading", () => {
    const { getByText } = render(
      <Skeleton sizeLarge>Skeleton not loading large</Skeleton>
    );
    const skeleton = getByText("Skeleton not loading large");
    expect(skeleton.hasChildNodes()).toBe(true);
    const text = getNodeText(skeleton);
    expect(text).toBe("Skeleton not loading large");
  });
  it("should render skeleton large", () => {
    const { getByTestId } = render(
      <Skeleton sizeLarge loading data-testid="skeletonid">
        Skeleton loading large
      </Skeleton>
    );
    const skeleton = getByTestId("skeletonid");
    const hasTitleParagrah = skeleton.children[0].children[0].childNodes.length;
    // validate 2 children nodes due to title and paragraph objects
    expect(hasTitleParagrah).toEqual(2);
    const paragraphLength =
      skeleton.children[0].children[0].children[1].childNodes.length;
    expect(paragraphLength).toEqual(largeParagraph.width.length);
  });
  it("should render skeleton medium", () => {
    const { getByTestId } = render(
      <Skeleton sizeMedium loading data-testid="skeletonid">
        Skeleton loading medium
      </Skeleton>
    );
    const skeleton = getByTestId("skeletonid");
    const paragraphLength =
      skeleton.children[0].children[0].children[0].childNodes.length;
    expect(paragraphLength).toEqual(mediumParagraph.width.length);
  });
  it("should render skeleton small", () => {
    const { getByTestId } = render(
      <Skeleton sizeSmall loading data-testid="skeletonid">
        Skeleton loading small
      </Skeleton>
    );
    const skeleton = getByTestId("skeletonid");
    const paragraphLength =
      skeleton.children[0].children[0].children[0].childNodes.length;
    expect(paragraphLength).toEqual(smallParagraph.width.length);
  });
  it("should render skeleton default", () => {
    const { getByTestId } = render(
      <Skeleton loading data-testid="skeletonid">
        Skeleton loading large
      </Skeleton>
    );
    const skeleton = getByTestId("skeletonid");
    const paragraphLength =
      skeleton.children[0].children[0].children[0].childNodes.length;
    expect(paragraphLength).toEqual(4);
  });

  it("should render skeleton custom paragraph size", () => {
    const { getByTestId } = render(
      <Skeleton
        paragraph={{
          rows: 20
        }}
        loading
        data-testid="skeletonid"
      >
        Skeleton loading large
      </Skeleton>
    );
    const skeleton = getByTestId("skeletonid");
    const paragraphLength =
      skeleton.children[0].children[0].children[0].childNodes.length;
    expect(paragraphLength).toEqual(20);
  });

  it("should render children default when not loading", () => {
    const { getByText } = render(
      <Skeleton>Skeleton not loading default</Skeleton>
    );
    const skeleton = getByText("Skeleton not loading default");
    expect(skeleton.hasChildNodes()).toBe(true);
    const text = getNodeText(skeleton);
    expect(text).toBe("Skeleton not loading default");
  });

  it("should render skeleton default no children", () => {
    const { queryByText } = render(
      <Skeleton loading>Skeleton loading default</Skeleton>
    );
    const skeleton = queryByText("Skeleton loading default");
    expect(skeleton).toBeNull();
  });

  it("can add custom class", () => {
    const { getByTestId } = render(
      <Skeleton
        className="some custom class"
        loading
        data-testid="skeletonid"
      />
    );
    // Skeleton component form antd does not take attributes so stuff like `id`, `data-testid` are not passed
    const skeleton = getByTestId("skeletonid");
    expect(skeleton.children[0]).toHaveClass(
      "ant-skeleton ant-skeleton-active ant-skeleton-round some custom class"
    );
  });
});
