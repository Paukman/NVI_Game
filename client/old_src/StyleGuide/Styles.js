/* eslint-disable */
import React from "react";

import { useRouteMatch } from "react-router-dom";
import LayoutPage from "./LayoutPage"
import Buttons from "./Buttons"
import InputComponent from "./Input";
import DatePicker from "./DatePicker";
import Forms from "./Forms"
import Messages from "./Messages"
import { MessageProvider } from "./Components"
import Typography from "./Typography"
import Select from "./Select";
import ReadOnly from "./ReadOnly";
import Skeleton from "./Skeleton";
import TextAreas from "./TextAreas";
import Modals from "./Modals";
import Checkboxes from "./Checkboxes";

import DataProvider from "./Steps/DataProvider"
import Steps from "./Steps"
import FormPageProvider from "./Steps/FormPageProvider"
import PromptProvider from "Common/PromptProvider";

const SubView = ({
    match
}

) => {
    if (!match) return null;

    switch (match.params.sectionName) {
        case "buttons":
            return (<Buttons />);
        case "input":
            return (<InputComponent />);
        case "forms":
            return (<Forms />);
        case "message":
            return (<MessageProvider><Messages /></MessageProvider>);
        case "typography":
            return (<Typography />);
        case "datepicker":
            return (<DatePicker />);
        case "select":
            return (<Select />);
        case "readonly":
            return (<ReadOnly />);
        case "skeleton":
            return (<Skeleton />);
        case "textareas":
            return (<TextAreas />);
        case "modals":
            return (<Modals />);
        case "form-steps":
            return (
                <PromptProvider>
                    <DataProvider>
                        <Steps />
                    </DataProvider>
                </PromptProvider>);
        case "form-pages":
            return (
                <PromptProvider>
                    <DataProvider>
                        <FormPageProvider />
                    </DataProvider>
                </PromptProvider>);
        case "checkboxes":
            return (<Checkboxes />);
        default: {
            return null;
        }
    }
}



const Styles = () => {
    const match = useRouteMatch(`/styles/:sectionName`);

    return (<> <LayoutPage> <SubView match={
        match
    }

    /> </LayoutPage> </>)
}



export default Styles;