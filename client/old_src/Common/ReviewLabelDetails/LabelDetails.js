import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import MaskedQuestion from "InteracETransfer/SendETransfer/SendETransferForm/MaskedQuestion/MaskedQuestion";
import "./styles.scss";

// TODO - make a standalone from review and complete to display LabelDetails
const LabelDetails = ({ id, labelData }) => {
  LabelDetails.propTypes = {
    id: PropTypes.string,
    labelData: PropTypes.objectOf(
      PropTypes.shape({
        visible: PropTypes.bool.isRequired,
        imageIcon: PropTypes.string,
        // TODO - rename title to label and label to text
        title: PropTypes.string,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        spanAttributes: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.string
        ]),
        textOnly: PropTypes.string
      }).isRequired
    ).isRequired
  };

  LabelDetails.defaultProps = {
    id: ""
  };

  // TODO - could be improved by mapping through an array of objects, object key unecessary
  // TODO - retire semantic-ui-react
  const renderItems = data => {
    return Object.keys(data).map((key, index) => {
      if (data[key].visible) {
        return (
          <Grid key={key} className="label-card" id={`${id}-${index}-card`}>
            {data[key].textOnly ? (
              <>
                <Grid.Column
                  className="icon-grid"
                  mobile={4}
                  tablet={2}
                  computer={2}
                />
                <Grid.Column
                  className="label-text-only"
                  mobile={12}
                  tablet={14}
                  computer={14}
                >
                  {data[key].textOnly}
                </Grid.Column>
              </>
            ) : (
              <>
                <Grid.Column
                  className="icon-grid"
                  mobile={4}
                  tablet={2}
                  computer={2}
                >
                  <img
                    id={`${id}-${index}-icon`}
                    alt={data[key].title}
                    src={data[key].imageIcon}
                    className="label-img-icon"
                  />
                </Grid.Column>
                <Grid.Column
                  className="label-grid"
                  mobile={12}
                  tablet={14}
                  computer={14}
                >
                  {/* TODO - question for koyel - why are these not input / labels? */}
                  <p className="label-title" id={`${id}-${index}-title`}>
                    {data[key].title}
                  </p>
                  {data[key].title !== "Security answer" ? (
                    <span
                      className="label-text"
                      {...data[key].spanAttributes}
                      id={`${id}-${index}-text`}
                    >
                      {data[key].label}
                    </span>
                  ) : (
                    <MaskedQuestion />
                  )}
                </Grid.Column>
              </>
            )}
          </Grid>
        );
      }
      return null;
    });
  };

  return (
    <div className="label-details" id={`${id}`}>
      {renderItems(labelData)}
      {labelData?.Message?.visible && (
        <p className="review-details-message">{labelData.Message.message}</p>
      )}
      {labelData?.SecondMessage?.visible && (
        <p className="review-details-message">
          {labelData.SecondMessage.message}
        </p>
      )}
    </div>
  );
};

export default LabelDetails;
