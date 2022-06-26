import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Tab } from "semantic-ui-react";
import PropTypes from "prop-types";

import "./styles.scss";

import ProgressStatus from "Common/ProgressStatus/ProgressStatus";

const Stepper = ({ id, tabs, onEdit, className }) => {
  Stepper.propTypes = {
    id: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onEdit: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  Stepper.defaultProps = {
    className: ""
  };

  const stepperId = `${id}-stepper`;

  const [activeIndex, setActiveIndex] = useState(0);
  const [panes, setPanes] = useState([{}]);

  const history = useHistory();
  const location = useLocation();

  // disabled - enable to easily debug tabs
  // const handleTabChange = (e, { activeIndex: index }) => setActiveIndex(index);

  const setUrl = index => {
    const {
      location: { pathname }
    } = history;
    switch (index) {
      case 0: {
        history.push(`${pathname}#create`);
        break;
      }
      case 1: {
        history.push(`${pathname}#review`);
        break;
      }
      case 2: {
        history.push(`${pathname}#send`);
        break;
      }
      default:
        break;
    }
  };

  const setIndex = hash => {
    if (hash === "#create" && activeIndex !== 0) {
      setActiveIndex(0);
    }
    if (hash === "#review" && activeIndex !== 1) {
      setActiveIndex(1);
    }
    if (hash === "#send" && activeIndex !== 2) {
      setActiveIndex(2);
    }
  };

  const nextTab = () => {
    setUrl(activeIndex + 1);
    setActiveIndex(activeIndex + 1);
  };

  const prevTab = isCancel => {
    if (isCancel) {
      history.goBack();
    } else {
      setUrl(activeIndex - 1);
    }

    setActiveIndex(activeIndex - 1);
  };

  const editForm = () => {
    onEdit();
    history.goBack();
  };

  useEffect(() => {
    window.onpopstate = () => {
      setUrl(0);
      setActiveIndex(0);
    };
    // need to remove the listener when leaving the stepper
    return () => {
      window.onpopstate = () => {};
    };
  }, []);

  const renderTab = content => (
    <Tab.Pane>{content(prevTab, nextTab, editForm)}</Tab.Pane>
  );

  const renderTabs = tabProps => {
    const newPanes = [];

    // logic here could be improved - could instead render each tab per map, instead of pushing to state
    tabProps.map(tab => {
      const { title, render } = tab;

      return newPanes.push({
        menuItem: title,
        render: () => renderTab(render)
      });
    });

    setPanes(newPanes);
  };

  useEffect(() => {
    setIndex(location.hash);
    renderTabs(tabs);
    // routes the user back to #create on refresh
    // this case is necessary until we have data persistence in the forms
  }, [tabs, activeIndex]);

  return (
    <div id={stepperId} className="stepper">
      <ProgressStatus
        status={activeIndex}
        id={stepperId}
        className={className}
      />
      <Tab
        panes={panes}
        activeIndex={activeIndex}
        // disabled - enable to easily debug tabs onTabChange={handleTabChange}
      />
    </div>
  );
};

export default Stepper;
