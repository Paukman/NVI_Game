import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "utils";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import foreignExchange from "assets/icons/ForeignExchange/foreign-exchange-pictogram.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import foreignExchangeIcon from "assets/icons/ForeignExchange/foreign-exchange.svg";
import "./CrossCurrencyDetails.scss";

const formatEXRate = exRateNet => {
  const [, cents] = exRateNet.split(".");
  return cents?.length > 4 ? (+exRateNet).toFixed(4) : exRateNet;
};

const mapLabelData = ({ exRateNet, transactionAmount, netAmount }) => ({
  AmountTo: {
    visible: true,
    imageIcon: moneyIcon,
    title: "Converted amount",
    label: `${formatCurrency(
      parseFloat(transactionAmount?.value ?? 0).toFixed(2)
    )} ${transactionAmount?.currency ?? ""}`
  },
  ExchangeRate: {
    visible: true,
    imageIcon: foreignExchangeIcon,
    title: "Foreign exchange rate",
    label: `$1 ${netAmount?.currency ?? ""} = $${formatEXRate(
      exRateNet
    )} ${transactionAmount?.currency ?? ""}`
  }
});

const CrossCurrencyDetails = ({ transactionDetails }) => {
  CrossCurrencyDetails.propTypes = {
    transactionDetails: PropTypes.shape({}).isRequired
  };

  return (
    <div className="cross-currency-details">
      <div className="cross-currency-image-wrapper">
        <img
          className="foreign-exchange-image"
          alt="Foreign exchange rate"
          src={foreignExchange}
        />
        <p className="foreign-exchange-text">FX Transfer</p>
      </div>
      <div className="cross-currency-label-wrapper">
        <LabelDetails id="tcd" labelData={mapLabelData(transactionDetails)} />
      </div>
    </div>
  );
};

export default CrossCurrencyDetails;
