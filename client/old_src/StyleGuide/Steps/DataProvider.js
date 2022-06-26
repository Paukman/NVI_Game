/* eslint-disable */
import React, { createContext } from "react";
import useData from "./useData";

export const DataContext = createContext();

const DataProvider = ({ children }) => {
    const {
        data,
        submitFormOne,
        submitFormTwo,
        blockLocation,
        blockClosingBrowser,
        onCommit,
        promptState,
        onCancel,
        goToPage } = useData();

    return (
        <DataContext.Provider
            value={{
                data,
                submitFormOne,
                submitFormTwo,
                blockLocation,
                blockClosingBrowser,
                onCommit,
                promptState,
                onCancel,
                goToPage
            }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
