import { act, renderHook } from "@testing-library/react-hooks";
import { mockApiData } from "utils/TestUtils";

import useQuestionChallenge, {
  challengesAnswersURL,
  challengesQuestionsURL
} from "./useQuestionChallenge";

jest.mock("antd");

const rsaHeaders = { a: 1 };

describe("useQuestionChallenge hook", () => {
  it(">> can fetch challengeQuestions with success ", async () => {
    mockApiData([
      {
        url: challengesQuestionsURL,
        results: {
          challengeQuestions: [{ id: 123, challengeQuestion: "What is this?" }]
        },
        method: "GET"
      }
    ]);
    const hook = renderHook(() =>
      useQuestionChallenge({ rsaHeaders, onSuccess: () => null })
    );
    const { result, waitForNextUpdate } = hook;
    expect(result.current.questionChallenge).toEqual({
      loading: true,
      question: {},
      verifyingAnswer: false,
      error: null
    });
    await waitForNextUpdate();
    expect(result.current.questionChallenge).toEqual({
      loading: false,
      question: { id: 123, challengeQuestion: "What is this?" },
      verifyingAnswer: false,
      error: null
    });
  });
  it(">> can fetch challengeQuestions with failure ", async () => {
    mockApiData([
      {
        url: challengesQuestionsURL,
        results: [],
        status: 500,
        method: "get",
        error: "ServerError"
      }
    ]);
    const hook = renderHook(() =>
      useQuestionChallenge({ rsaHeaders, onSuccess: () => null })
    );
    const { result, waitForNextUpdate } = hook;
    expect(result.current.questionChallenge).toEqual({
      loading: true,
      question: {},
      verifyingAnswer: false,
      error: null
    });
    await waitForNextUpdate();
    expect(result.current.questionChallenge).toEqual({
      loading: false,
      question: {},
      verifyingAnswer: false,
      error: "ServerError"
    });
  });
  describe("verify ", () => {
    it(">> verify with success ", async () => {
      const onSuccess = jest.fn();
      mockApiData([
        {
          url: challengesAnswersURL,
          method: "POST",
          results: { challengeAnswer: "PASS" }
        }
      ]);
      let hook;
      await act(async () => {
        hook = renderHook(() =>
          useQuestionChallenge({ rsaHeaders, onSuccess })
        );
      });
      const { result } = hook;
      expect(result.current.questionChallenge).toEqual({
        loading: false,
        question: {},
        verifyingAnswer: false,
        error: null
      });
      await act(async () => {
        const verified = await result.current.verifyAnswer({});
        expect(verified).toEqual(true);
        expect(result.current.questionChallenge).toEqual({
          loading: false,
          question: {},
          verifyingAnswer: false,
          error: null
        });
        expect(onSuccess).toBeCalled();
      });
    });
    it(">> verify with error ", async () => {
      mockApiData([
        {
          url: challengesAnswersURL,
          results: [],
          status: 500,
          method: "POST",
          error: "ServerError"
        }
      ]);
      let hook;
      await act(async () => {
        hook = renderHook(() =>
          useQuestionChallenge({ rsaHeaders, onSuccess: () => null })
        );
      });
      const { result } = hook;
      await act(async () => {
        const verified = await result.current.verifyAnswer({});
        expect(verified).toEqual(false);
        expect(result.current.questionChallenge).toEqual({
          loading: false,
          question: {},
          verifyingAnswer: false,
          error: "ServerError"
        });
      });
    });
  });
});
