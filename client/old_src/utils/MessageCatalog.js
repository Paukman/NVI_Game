/* istanbul ignore file */ // << This is a string resource file, ignoring

import React, { Fragment } from "react";
import { formatCurrency } from "utils";

export const accountAndTransactionSummaryErrors = {
  MSG_REBAS_008:
    "We're experiencing some technical issues and can't display credit card information right now. Please try again later.",
  MSG_REBAS_014C:
    "It looks like you have no scheduled transactions. Would you like to set some up? Scheduled transactions are a convenient way to make regular transfers automatically.",
  MSG_REBAS_014C_Payments:
    "It looks like you have no scheduled transactions. Would you like to set some up? Scheduled transactions are a convenient way to make regular payments automatically."
};

export const SYSTEM_ERROR = "System Error";

export const transferErrors = {
  MSG_RBTR_004: toAccount =>
    `You've successfully created your transfer to ${toAccount}.`,
  MSG_RBTR_004_OLD: "You've successfully created your transfer.",
  MSG_RBTR_004_RECURRING: "You've successfully created your transfers.",
  MSG_RBTR_005B: "Non-sufficient funds. Enter a lower amount.",
  MSG_RBTR_008_TITLE: "Cancel transfer?",
  MSG_RBTR_008: (from, to, amount) => {
    return (
      <>
        <h4>Cancel transfer?</h4>
        <p>From account: {from}</p>
        <p>To account: {to}</p>
        <p>Amount: {formatCurrency(amount)}</p>
      </>
    );
  },
  MSG_RBTR_009: name =>
    `You’ve successfully cancelled your transfer to ${name}.`,
  MSG_RBTR_009B: toName =>
    `You’ve successfully cancelled your recurring transfer to ${toName}.`,
  MSG_RBTR_009C: toName =>
    `You’ve successfully cancelled your scheduled transfer to ${toName}.`,
  MSG_RBTR_005_TITLE: <Fragment>Transfer Failed</Fragment>,
  MSG_RBTR_005_OLD: (accountName, reason) => {
    if (reason === undefined) {
      return <>We couldn’t send your transfer to {accountName}.</>;
    }
    return (
      <>
        We couldn’t send your transfer to {accountName} because {reason}.{" "}
      </>
    );
  },
  MSG_RBTR_005: (accountName, reason) => {
    if (reason === undefined) {
      return (
        <>
          <h4>Transfer Failed</h4>
          <p>We couldn’t send your transfer to {accountName}.</p>
        </>
      );
    }
    return (
      <>
        <h4>Transfer Failed</h4>
        <p>
          We couldn’t send your transfer to {accountName} because {reason}.{" "}
        </p>
      </>
    );
  },

  MSG_RBTR_011: (fromAccount, toAccount, amount) => {
    return (
      <>
        <h4>Cancel transfer?</h4>
        <p>From account: {fromAccount}</p>
        <p>To account: {toAccount}</p>
        <p>Amount: {formatCurrency(amount)}</p>
      </>
    );
  },
  MSG_RBTR_012: toName => {
    return (
      <>
        <h4>Try again</h4>
        <p>We couldn’t cancel your transfer to {toName}. Please try again.</p>
      </>
    );
  },
  MSG_RBTR_015: () => {
    return (
      <>
        <h4>Future Dates Not Supported</h4>
        <p>
          Foreign Exchange (FX) transfers can&#39;t be set for future dates.
        </p>
      </>
    );
  },
  MSG_RBTR_015C: () => {
    return (
      <>
        <h4>Recurring Transfers Not Supported</h4>
        <p>
          Foreign Exchange (FX) transfers can&#39;t be set up as a recurring
          transaction. You can make an immediate FX transfer or set up a
          recurring transfer using accounts with the same currency.
        </p>
      </>
    );
  },
  MSG_RBTR_016: "Select an account.",
  MSG_RBTR_017: "Enter an amount.",
  // RBTR_018 has options to break out messages based on min/max/minRRSP
  MSG_RBTR_018_EXCHNAGE_MIN: "Enter an amount no lower than $1.00.",
  MSG_RBTR_018B_EXCHNAGE_MAX: "Enter an amount no greater than $3,000.00.",
  MSG_RBTR_018_MIN: "Enter an amount no lower than $0.01.",
  MSG_RBTR_018_MAX: "Enter an amount no greater than $99,999.99.",
  MSG_RBTR_018_MIN_RRSP: "Enter an amount no less than $25.00.",
  MSG_RBTR_019: "Select a transfer date.",
  MSG_RBTR_020: "Select a frequency.",
  MSG_RBTR_021: "Enter the number of recurring transfers.",
  MSG_RBTR_021B: "Enter a number between 1-999.",
  MSG_RBTR_026: "This account doesn’t support future-dated transfers.",
  MSG_RBTR_026_FDT: () => {
    return (
      <>
        <h4>Future transfers not supported</h4>
        <p>
          This account doesn’t support future-dated transfers. Select a
          different account or make an immediate transfer.
        </p>
      </>
    );
  },
  MSG_RBTR_026_MODAL: accountName => {
    return (
      <>
        <h4>Future Transfers Not Supported</h4>
        <p>
          {accountName} doesn’t support future-dated transfers. Select a
          different account or make an immediate transfer.
        </p>
      </>
    );
  },
  MSG_RBTR_027: "This account doesn’t support recurring transfers.",
  MSG_RBTR_034: "Choose a date within the next 12 months.",
  MSG_RBTR_034B: maxDate => {
    return `Enter a date before ${maxDate}`;
  },
  MSG_RBTR_035: "Choose the present or a future date.",
  MSG_RBTR_040: () => {
    return (
      <>
        <h4>Not enough eligible accounts</h4>
        <p>You need two eligible accounts to support transfers.</p>
      </>
    );
  },
  MSG_RBTR_042: "Choose a future date.",
  MSG_RBTR_042B: "Choose a date after the start date.",
  MSG_RBTR_042C: "Choose a date before the end date.",
  MSG_RBTR_044:
    "To avoid paying any penalties, be careful not to exceed your maximum contribution limit for the year. You can confirm your limit by reviewing your notice of assessment or by contacting the Canada Revenue Agency (CRA).",
  MSG_RBTR_044B:
    "To avoid paying any penalties, be careful not to exceed your maximum contribution limit for the year. Learn more about TFSA contribution limits at the Canada Revenue Agency (CRA).",
  MSG_RBTR_045:
    "Remember: the amount of any withdrawals (other than qualifying transfers) from your TFSA in a year will be added to your contribution room the following year. Also, withdrawing funds from your TFSA does not reduce the total amount of contributions you have already made for the year.",
  MSG_RBTR_046: () => {
    return (
      <>
        <h4>Transfer Failed</h4>
        <p>
          You&#39;re unable to transfer funds to a loan account with a $0
          balance owing. Select another account with a positive balance.
        </p>
      </>
    );
  },
  MSG_RBTR_047: () => {
    return (
      <>
        <h4>Transfer Failed</h4>
        <p>
          You&#39;re unable to transfer an amount higher than the principal
          balance owing on the selected loan account. Transfer a lower amount or
          select another account.
        </p>
      </>
    );
  },
  MSG_RBTR_052:
    "This account is not eligible for the current transaction. Select a different account.",
  MSG_RBTR_054: () => {
    return (
      <>
        <h4>{SYSTEM_ERROR}</h4>
        <p>
          {`We're having trouble retrieving the exchange rate for this transaction.`}
        </p>
      </>
    );
  },
  MSG_RBTR_001_UNK: "You have exceeded the 1 year/999 transfer limit."
};

export const requestETransferErrors = {
  MSG_RBET_002: "Select an account.",
  MSG_RBET_007B: "Select a contact.",
  MSG_RBET_007: "Select a recipient.",
  MSG_RBET_012C: "Enter an amount.",
  MSG_RBET_012: (min, max) => {
    return `Enter an amount between ${formatCurrency(min)} and ${formatCurrency(
      max
    )}.`;
  },
  MSG_RBET_013B: recipient => {
    return `${recipient} has accepted this transaction.`;
  },
  MSG_RBET_013C: (
    <>
      You&apos;ve successfully requested funds by <em>Interac</em> e-Transfer.
    </>
  ),
  MSG_RBET_014_TITLE: (
    <Fragment>
      <em>Interac</em> e-Transfer Failed
    </Fragment>
  ),
  MSG_RBET_014: (
    <Fragment>
      We couldn&#39;t process your <em>Interac</em> e-Transfer transaction.{" "}
      Please try again.
    </Fragment>
  ),
  MSG_RBET_016_TITLE: "Daily limit reached",
  MSG_RBET_016: recipientName => {
    return `Funds cannot be sent ${recipientName}because this would exceed your
    daily transfer limit.`;
  },
  MSG_RBET_016B_TITLE: "Weekly limit reached",
  MSG_RBET_016B: (recipientName, maxLimit) => {
    return (
      <Fragment>
        Funds cannot be sent ${recipientName}because this would exceed your
        weekly limit of ${maxLimit}
      </Fragment>
    );
  },
  MSG_RBET_016C_TITLE: "Monthly limit reached",
  MSG_RBET_016C: (recipientName, maxLimit) => {
    return (
      <Fragment>
        Funds cannot be sent ${recipientName}because this would exceed your
        monthly limit of ${maxLimit}
      </Fragment>
    );
  },
  MSG_RBET_016E: maxLimit => {
    return (
      <Fragment>You can send a maximum of {maxLimit} at this time.</Fragment>
    );
  },
  MSG_RBET_024: (
    <>
      <h4> Reminder Limit Exceeded</h4>
      <p>
        You&#39;ve reached your maximum number of manual reminders for this
        request.
      </p>
    </>
  ),
  MSG_RBET_037: (sender, recipient, amount) => (
    <>
      <h4>
        Cancel <em>Interac</em> e-Transfer?
      </h4>
      <p>From account: {sender}</p>
      <p>To recipient: {recipient}</p>
      <p>Amount: {amount}</p>
    </>
  ),
  MSG_RBET_037C:
    "This transaction has been cancelled. The funds have been returned to your account.",
  MSG_RBET_037F:
    "This transaction has been cancelled. Funds have not been deposited into your account.",
  MSG_RBET_041_TITLE: "No recipients",
  MSG_RBET_041: (
    <>
      <h4>No recipients</h4>
      <p>
        No recipients have been created. Create one or more recipients before
        sending funds by <em>Interac</em> e-Transfer.
      </p>
    </>
  ),
  MSG_RBET_052C: legalName => {
    return (
      <span className="bottom-message">
        <span>
          When you Request Money by <em>Interac</em> e-Transfer, for security
          purposes, the recipient will see your registered legal name:{" "}
          {legalName}.
        </span>
        <span>
          If you need to update your name in our records, call 1-800-332-8383
          and make sure to have any relevant legal documents ready.
        </span>
      </span>
    );
  },
  MSG_RBET_063: "Your funds will be returned to your account shortly.",
  MSG_RBET_066_TITLE: "No eligible accounts",
  MSG_RBET_066: (
    <>
      <h4>No eligible accounts</h4>
      <p>
        None of your existing accounts support <em>Interac</em> e-Transfer.
      </p>
    </>
  ),
  MSG_INTERAC_518: "placeholder",
  MSG_RBET_067_TITLE: (
    <Fragment>
      Cancel Request Money via <em>Interac</em> e-Transfer?
    </Fragment>
  ),
  MSG_RBET_067: (sender, amount) => {
    return (
      <>
        <h4>
          Cancel Request Money via <em>Interac</em> e-Transfer?
        </h4>
        <p>To contact: {sender}</p>
        <p>Amount: {amount}</p>
      </>
    );
  },
  MSG_RBET_070: (
    <>
      You’ve received a request to send money via <em>Interac</em> e-Transfer
      <sup>&#174;</sup>. Please review the details below before choosing to
      accept or decline this request. If the request is unexpected, or you find
      it suspicious, you should contact the requester to confirm before
      fulfilling the request.
    </>
  ),

  MSG_RBET_071: recipient => {
    if (recipient)
      return (
        <>
          You’ve successfully fulfilled a request for money by <em>Interac</em>{" "}
          e-Transfer from {recipient}.
        </>
      );
    return (
      <>
        You’ve successfully fulfilled a request for money by Interac e-Transfer.
      </>
    );
  },
  MSG_RBET_071B: recipient => {
    return `${recipient} has not yet fulfilled this request for money by Interac e-Transfer.`;
  },
  MSG_RBET_071C: recipient => {
    return `${recipient} has fulfilled this request for money by Interac e-Transfer.`;
  },
  MSG_RBET_044C: sender => {
    return `We will notify ${sender} that you've accepted their Interac e-Transfer deposit.`;
  },
  MSG_RBET_044: recipient => {
    return `We will notify ${recipient} that you've declined their Interac e-Transfer deposit.`;
  },
  MSG_RBET_067B: recipient => {
    return (
      <>
        You&apos;ve cancelled your request for money by <em>Interac</em>{" "}
        e-Transfer to {recipient}.
      </>
    );
  },
  MSG_RBET_067C: (
    <>
      <h4>{SYSTEM_ERROR}</h4>
      <p>We couldn’t cancel this request.</p>
    </>
  )
};

export const receiveETransferErrors = {
  MSG_RBET_006: (
    <>
      <h4>
        <em>Interac</em> e-Transfer Failed
      </h4>
      <p>
        The security answers you entered don&#39;t match our records and
        you&#39;ve reached the maximum number of attempts. <em>Interac</em> has
        cancelled this transfer and notified the sender.
      </p>
    </>
  ),
  MSG_RBET_006B: () => (
    <>
      <h4>INTERAC e-Transfer Failed</h4>
      <p>
        The funds sent by INTERAC e-Transfer have already been claimed by
        another user and can&#39;t be deposited. Please contact the sender.
      </p>
    </>
  ),
  MSG_RBET_014_TITLE: (
    <Fragment>
      <em>Interac</em> e-Transfer<sup>&#174;</sup> Failed
    </Fragment>
  ),
  MSG_RBET_014: (
    <>
      <h4>
        <em>Interac</em> e-Transfer Failed
      </h4>
      <p>
        We couldn&#39;t process your <em>Interac</em> e-Transfer transaction.
        Please try again.
      </p>
    </>
  ),
  MSG_RBET_016E: amount => {
    return (
      <>
        <h4>Transaction Limit Exceeded</h4>
        <p>You can receive a maximum of {amount} at this time.</p>
      </>
    );
  },
  MSG_RBET_017: () => {
    return (
      <>
        <p>Enter the correct answer or contact the sender.</p>
      </>
    );
  },
  MSG_RBET_017s: "Enter the correct answer or contact the sender.",
  MSG_RBET_017Bs: "Enter your security answer.",
  MSG_RBET_017B: <>Enter your security answer.</>,
  MSG_RBET_043: () => (
    <>
      <h4>INTERAC e-Transfer Failed</h4>
      <p>
        Funds sent by INTERAC e-Transfer couldn&#39;t be deposited as this
        transfer was previously declined. Please contact the sender.
      </p>
    </>
  ),
  MSG_RBET_044B: (senderName, amount) => {
    return (
      <>
        <h4>
          Decline <em>Interac</em> e-Transfer?
        </h4>
        <p>
          Are you sure you&#39;d like to decline the {amount} <em>Interac</em>{" "}
          e-Transfer from {senderName}?
        </p>
      </>
    );
  },
  MSG_RBET_065: (amount, senderName) => (
    <>
      <h4>Cancel deposit?</h4>
      <p>
        {`Are you sure you don't want to finish depositing your ${amount} from ${senderName}?`}
      </p>
    </>
  )
};

export const eTransferErrors = {
  eTransfer_Trademark: (
    <>
      <em>Interac</em> e-Transfer<sup>&#174;</sup>
    </>
  ),
  preferences_Trademark: (
    <p>
      <em>Interac</em>
      <sup>&#174;</sup> preferences
    </p>
  ),
  MSG_REBAS_000: (
    <>
      <h4>{SYSTEM_ERROR}</h4>
      <p>
        We’re experiencing some technical issues and couldn’t retrieve some of
        your account information. Please try again.
      </p>
    </>
  ),
  MSG_REBAS_000_CONTENT:
    "We’re experiencing some technical issues and couldn’t retrieve some of your account information. Please try again.",
  MSG_REBAS_000_INLINE:
    "We couldn't retrieve some of your account information.",
  MSG_REBAS_014B: "There are no more transaction records to display.",
  MSG_RBET_002: "Select an account.",
  MSG_RBET_007: "Select a recipient.",
  MSG_RBET_004: "Non-sufficient funds. Enter a lower amount.",
  MSG_RBET_012: (min, max) => {
    return `Enter an amount between ${formatCurrency(min)} and ${formatCurrency(
      max
    )}.`;
  },
  MSG_RBET_012C: "Enter an amount.",
  MSG_RBET_014_TITLE: (
    <Fragment>
      <em>Interac</em> e-Transfer Failed
    </Fragment>
  ),
  MSG_RBET_014: (
    <Fragment>
      We couldn’t process your <em>Interac</em> e-Transfer transaction. Please
      try again.
    </Fragment>
  ),
  MSG_RBET_013: (
    <>
      You&apos;ve successfully sent funds by <em>Interac</em> e-Transfer.
    </>
  ),
  MSG_RBET_016_TITLE: "Daily limit reached",
  MSG_RBET_016: recipientName =>
    `Funds cannot be sent${recipientName}because this would exceed your daily transfer limit.`,
  MSG_RBET_016B: (recipientName, maxLimit) =>
    `Funds cannot be sent${recipientName}because this would exceed your weekly transfer limit of ${maxLimit}.`,
  MSG_RBET_016C: (recipientName, maxLimit) =>
    `Funds cannot be sent${recipientName}because this would exceed your monthly transfer limit of ${maxLimit}.`,
  MSG_RBET_016E: maxLimit => {
    return (
      <Fragment>You can send a maximum of {maxLimit} at this time.</Fragment>
    );
  },
  MSG_RBET_016F: (action, frequency, amount) => {
    return (
      <Fragment>
        You cannot {action} funds by <em>INTERAC</em> e-Transfer because
        you&apos;ve reached your {frequency} transfer limit of {amount}.
      </Fragment>
    );
  },
  MSG_RBET_022_TITLE: "Request Limit Exceeded",
  MSG_RBET_022: (
    <>
      <h4>Request Limit Exceeded</h4>
      <p>
        You’ve reached your maximum number of outstanding requests. Cancel an
        existing request to send now.
      </p>
    </>
  ),
  MSG_RBET_025: "Enter an amount.",
  MSG_RBET_032: (
    <>
      <h4>
        No <em>Interac</em> profile
      </h4>
      <p>
        Create your <em>Interac</em> profile in order to send or receive funds
        by <em>Interac</em> e-Transfer.
      </p>
    </>
  ),
  MSG_RBET_036D: recipientName => {
    return `You’ve successfully updated recipient ${recipientName}.`;
  },
  MSG_RBET_037: (sender, recipient, recipientEmail, amount) => {
    return (
      <>
        <h4>
          Cancel <em>Interac</em> e-Transfer?
        </h4>
        <p>From account: {sender}</p>
        <p>
          To recipient:{" "}
          {recipientEmail ? `${recipient} (${recipientEmail})` : `${recipient}`}
        </p>
        <p>Amount: {amount}</p>
      </>
    );
  },
  MSG_RBET_037B: recipient => {
    return (
      <>
        <p>You&apos;ve cancelled your transfer to {recipient}.</p>
      </>
    );
  },
  MSG_RBET_037D: (
    <>
      <h4>{SYSTEM_ERROR}</h4>
      <p>We couldn’t cancel this transaction.</p>
    </>
  ),
  MSG_RBET_038: recipient => {
    return `We've sent a reminder email to ${recipient}.`;
  },
  MSG_RBET_062: recipient => {
    return (
      <>
        <h4>{SYSTEM_ERROR}</h4>
        <p>We couldn&apos;t send a reminder email to {recipient}.</p>
      </>
    );
  },
  MSG_RBET_041_TITLE: "No recipients",
  MSG_RBET_041: (
    <Fragment>
      No recipients have been created. Create one or more recipients before
      sending funds by <em>Interac</em> e-Transfer.
    </Fragment>
  ),
  MSG_RBET_060B:
    "This email address is no longer registered for Autodeposit, so you’ll need to create a security question and answer for this recipient.",
  MSG_RBET_001_UNK: "You need to update your question and answer.",
  MSG_RBET_002_UNK: "Please change the email address.",
  MSG_RBET_003_UNK: maxLimit => {
    return `You can send a maximum of ${maxLimit} at this time.`;
  },

  // TODO: confirm again if below text for <delivery, Interac requires...> is to be non-italicised
  MSG_RBET_053: (
    <>
      Your profile lets <em>Interac</em> and your recipients know who is sending
      or requesting funds by <em>Interac</em> e-Transfer<sup>&#174;</sup>.
    </>
  ),
  MSG_ET_060: (
    <Fragment>
      Your <em>Interac</em> e-Transfer recipients’ security prompts are
      out-of-date and they can’t receive funds at this time. To ensure
      uninterrupted delivery, Interac requires you to update the recipient’s
      security answer before attempting to send funds.
    </Fragment>
  ),
  MSG_RBET_061C: recipient => {
    return `${recipient} has not yet accepted this transaction.`;
  },
  MSG_RBET_066_TITLE: "No eligible accounts",
  MSG_RBET_066: (
    <Fragment>
      None of your existing accounts support <em>Interac</em> e-Transfer.
    </Fragment>
  ),
  MSG_RBET_066_NO_ACCOUNTS: () => {
    return (
      <>
        <h4>No eligible accounts</h4>
        <p>
          None of your existing accounts support <em>Interac</em> e-Transfer.
        </p>
      </>
    );
  },
  MSG_RBET_067_TITLE: (
    <Fragment>
      Cancel Request Money via <em>Interac</em> e-Transfer?
    </Fragment>
  ),
  MSG_RBET_067: (sender, amount) => {
    return (
      <>
        <h4>
          Cancel Request Money by <em>Interac</em> e-Transfer?
        </h4>
        <p>To contact: {sender}</p>
        <p>Amount: {amount}</p>
      </>
    );
  }
};

export const manageContactMessage = {
  MSG_RBET_033: "Enter a name.",
  MSG_RBET_036B: recipientName => {
    return `You’ve successfully deleted recipient ${recipientName}.`;
  },
  MSG_RBET_045C_AUTODEPOSIT: "Autodeposit",
  MSG_RBET_045C: (recipientName, recipientEmail) => {
    return (
      <>
        {recipientName} has registered for Autodeposit of funds sent by{" "}
        <em>Interac</em> e-Transfer, so a security question isn&apos;t required.
        Transfers sent to {recipientEmail} will be deposited automatically and
        can&apos;t be cancelled.
      </>
    );
  },
  MSG_RBET_045B: legalName => {
    return (
      <>
        {legalName} has registered for Autodeposit of funds sent by{" "}
        <em>Interac</em> e-Transfer, so a security question isn&apos;t required.
        This transaction can&apos;t be cancelled.
      </>
    );
  },
  MSG_RBET_041_TITLE: "No recipients",
  MSG_RBET_041:
    "No payees have been created. Create one or more payees prior to submitting your bill payment.",
  MSG_RBBP_019_TITLE: SYSTEM_ERROR,
  MSG_RBBP_019: name => {
    return `We couldn't add this payee ${name}. Please try again.`;
  },
  MSG_RBBP_037B: (
    <Fragment>
      No <em>Interac</em> e-transfer recipients have been added.
    </Fragment>
  ),
  MSG_RBBP_037C: (
    <>
      <h4>Non-existing Payee</h4>
      <p>Add this Mastercard to your payees to make a payment.</p>
    </>
  ),
  MSG_RBET_005: "Enter a single word, 3-25 characters (no specials).",
  MSG_RBET_005B: "Enter a valid question (40 char. max incl. specials).",
  MSG_RBET_005C: "Security question and answer can’t match.",
  MSG_RBET_008: "This recipient already exists. Enter a new name.",
  MSG_RBET_008B: "This recipient already exists. Enter a new email.",
  MSG_RBET_010: "Enter a valid email address.",
  MSG_RBET_026: "Enter a valid name (no special characters).",
  MSG_RBET_028: "Enter a security question.",
  MSG_RBET_036F_TITLE: SYSTEM_ERROR,
  MSG_RBET_036F: "We couldn’t save this recipient. Please try again.",
  MSG_RBET_036D: recipientName => {
    return `You’ve successfully updated recipient ${recipientName}.`;
  },
  MSG_RBET_036C: recipientName => {
    return `You've successfully added recipient ${recipientName}.`;
  },
  MSG_RBET_036E: recipientName => {
    return `You've successfully added recipient ${recipientName} and saved them to your contacts.`;
  },
  MSG_RBET_036_TITLE: "Delete recipient?",
  MSG_RBET_036: recipientName => {
    return `This will remove ${recipientName}.`;
  },
  MSG_RBET_020_TITLE: "Pending Transfers Detected",

  // BTW: not a lint formatting error, do not remove space after pending
  MSG_RBET_020: recipientName => {
    return (
      <>
        We couldn’t delete recipient {recipientName} because they have pending{" "}
        <em>Interac</em> e-Transfer transactions.
      </>
    );
  },
  MSG_RBET_020B_TITLE: SYSTEM_ERROR,
  MSG_RBET_020B: recipientName => {
    return `We couldn't delete recipient ${recipientName}. Please try again.`;
  },
  ADL_MSG_ET_060B_TITLE: "Security Prompts Out-of-Date",
  ADL_MSG_ET_060B: (
    <>
      This recipients&apos; security prompts are out-of-date and they can&apos;t
      receive funds by <em>Interac</em> e-Transfer at this time. To ensure
      uninterrupted delivery, you must first update the recipient&apos;s
      security answer.
    </>
  ),
  MSG_RBET_060B_TITLE: "Autodeposit Change",
  MSG_RBET_060B: `This email address is no longer registered for Autodeposit, so
  you'll need to create a security question and answer for this
  recipient.`,
  MSG_RBBP_018: name => {
    return <>You’ve successfully added payee {name}.</>;
  },
  MSG_RBBP_023: name => {
    return <>You’ve successfully updated payee {name}.</>;
  },
  MSG_RBBP_024: name => {
    return (
      <>We couldn’t update information for payee {name}. Please try again.</>
    );
  },
  MSG_RBBP_025B_TITLE: (payeeName, payeeNickname, billPayeeId) => {
    if (payeeNickname) {
      return `Delete payee ${payeeNickname} (${billPayeeId})?`;
    }
    return `Delete payee ${payeeName} (${billPayeeId})?`;
  },
  MSG_RBBP_025B: "We will also delete any scheduled payments for this payee.",
  MSG_RBBP_025C: (payeeName, payeeNickname) => {
    if (payeeNickname) {
      return `You’ve successfully deleted payee ${payeeNickname}.`;
    }
    return `You’ve successfully deleted payee ${payeeName}`;
  },
  MSG_RBBP_026_TITLE: "Pending Payments Detected",
  MSG_RBBP_026: (payeeName, payeeNickname) => {
    if (payeeNickname) {
      return `We couldn’t delete payee ${payeeNickname} because they have pending bill payments.`;
    }
    return `We couldn’t delete payee ${payeeName} because they have pending bill payments.`;
  },
  MSG_RBBP_027_TITLE: SYSTEM_ERROR,
  MSG_RBBP_027: (payeeName, payeeNickname) => {
    if (payeeNickname) {
      return `We couldn't delete payee ${payeeNickname}. Please try again.`;
    }
    return `We couldn't delete payee ${payeeName}. Please try again.`;
  },
  MSG_RBBP_044:
    "Please check your bill or statement for the relevant account number and enter it below.",
  MSG_RBBP_044C: "Confirm using your bill or statement",
  MSG_RBBP_044A: shortname => {
    return `Our system has provided a short name for this payee: ${shortname}. This short name will appear on statements, transactions and at ABMs unless you create a different nickname.`;
  },
  MSG_RBBP_017: "Enter a valid account number.",
  MSG_RBBP_017B: "Enter the payee account number.",
  MSG_RBBP_017_UNK: "Enter a valid nickname.",
  MSG_RBBP_025_UNK: "No creditors available."
};

export const billPaymentErrors = {
  MSG_RBBP_001_RECURRING: (payeeName, payeeNickname) => {
    if (payeeNickname)
      return `You've successfully created your bill payment(s) to ${payeeNickname}.`;
    return `You've successfully created your bill payment(s) to ${payeeName}.`;
  },
  MSG_RBBP_001: (payeeName, payeeNickname) => {
    if (payeeNickname)
      return `You've successfully created your bill payment to ${payeeNickname}.`;
    return `You've successfully created your bill payment to ${payeeName}.`;
  },
  MSG_RBBP_002_TITLE: "Payment failed",
  MSG_RBBP_002_OLD: (payee, reason) => {
    // ATTODO to be removed
    return (
      <>
        We couldn’t send your bill payment to {payee} because {reason}. Please
        try again or call 1-800-332-8383.
      </>
    );
  },

  MSG_RBBP_002: (payee, reason) => {
    return (
      <>
        <h4>Payment failed</h4>
        <p>
          We couldn’t send your bill payment to {payee} because {reason}. Please
          try again or call 1-800-332-8383.
        </p>
      </>
    );
  },

  MSG_RBBP_002B: "Non-sufficient funds. Enter a lower amount.",
  MSG_RBBP_003:
    "Bill payments submitted after 8pm MT will be processed the next business day. We recommend making bill payments at least 2-3 business days before a bill comes due.",
  MSG_RBBP_EXCHANGE_RATE_DISCLOSURE:
    "By verifying the transaction details, you confirm that you agree to both the exchange rate indicated and to the funds being transferred or to the payment being made.",
  MSG_RBBP_005: "Select an account.",
  MSG_RBBP_006: "Select a payee.",
  MSG_RBBP_007: "Enter an amount.",
  MSG_RBBP_008: "Select a date.",
  MSG_RBBP_009B: "Select a frequency.",
  MSG_RBBP_009C: "Enter a number of payments from 1-999.",
  MSG_RBBP_015: () => {
    return (
      <>
        <h4>Future Dates Not Supported</h4>
        <p>
          Foreign Exchange (FX) bill payments can&#39;t be set for future dates.
        </p>
      </>
    );
  },
  MSG_RBBP_015C: () => {
    return (
      <>
        <h4>Recurring Payments Not Supported</h4>
        <p>
          Foreign Exchange (FX) payments can&#39;t be set up as a recurring
          transaction. You can make an immediate FX payment or set up a
          recurring payment using accounts with the same currency.
        </p>
      </>
    );
  },
  MSG_RBBP_032: (from, payee, amount, isRecurringPayment) => {
    const MSG_RBBP_032_TITLE = "Cancel bill payment?";
    const MSG_RBBP_032B_TITLE = "Cancel these bill payments?";

    return (
      <>
        <h4>{isRecurringPayment ? MSG_RBBP_032B_TITLE : MSG_RBBP_032_TITLE}</h4>
        <p>From account: {from}</p>
        <p>To payee: {payee}</p>
        <p>Amount: {formatCurrency(amount)}</p>
      </>
    );
  },
  // TODO - DE - retire with useModal refactor
  MSG_RBBP_032_NEW: (paymentType, from, payee, number, currency) => {
    const title =
      paymentType !== "One Time Future Dated"
        ? "Cancel these bill payments?"
        : "Cancel bill payment?";

    return (
      <Fragment>
        <h4>{title}</h4>
        <p>From account: {from}</p>
        <p>To payee: {payee}</p>
        <p>Amount: {formatCurrency(number, currency)}</p>
      </Fragment>
    );
  },
  MSG_RBTR_054: () => {
    return (
      <>
        <h4>{SYSTEM_ERROR}</h4>
        <p>
          {`We're having trouble retrieving the exchange rate for this transaction.`}
        </p>
      </>
    );
  },

  MSG_RBBP_033: name => (
    <>You’ve successfully cancelled your bill payment to {name}</>
  ),
  MSG_RBBP_033B: name => (
    <>You’ve successfully cancelled your recurring bill payment to {name}</>
  ),
  MSG_RBBP_033C: name => (
    <>You’ve successfully cancelled your scheduled bill payment to {name}</>
  ),
  MSG_RBBP_034_TITLE: SYSTEM_ERROR,
  MSG_RBBP_034: name => {
    return `We couldn’t cancel your bill payment to ${name}. Please try again.`;
  },
  MSG_RBBP_035B: min => {
    return `Enter an amount no lower than ${formatCurrency(min)}.`;
  },
  MSG_RBBP_035C: max => {
    return `Enter an amount no greater than ${formatCurrency(max)}.`;
  },
  MSG_RBBP_036_MODAL: () => {
    return (
      <>
        <h4>Future Payments Not Supported</h4>
        <p>
          This account doesn’t support future-dated payments. Select a different
          different account or make an immediate payment.
        </p>
      </>
    );
  },
  MSG_RBBP_037B_TITLE: "To Payee",
  MSG_RBBP_037B: () => {
    return (
      <>
        <h4 data-testid="alert-no-payees">To Payee</h4>
        <p>
          No payees have been created. Create one or more payees prior to
          submitting your bill payment.
        </p>
      </>
    );
  },
  MSG_RBBP_040: "Choose a date within the next 12 months.",
  MSG_RBBP_040B: maxDate => {
    return `Enter a date before ${maxDate}`;
  },
  MSG_RBBP_041: "Choose a future date.",
  MSG_RBBP_041B: "Choose a date before the end date.",
  MSG_RBBP_041C: "Choose a date after the start date.",
  MSG_RBBP_042: (
    <>
      <h4>No eligible accounts</h4>
      <p>None of your existing accounts support bill payments.</p>
    </>
  ),
  MSG_RBBP_050: () => {
    return (
      <>
        <h4>Duplicate Payment Detected</h4>
        <p>
          This payment appears to be the same as one you made recently. Do you
          want to continue?
        </p>
      </>
    );
  },
  CREDIT_CARD_WARNING: () => {
    return (
      <>
        <h4>Cash Advance</h4>
        <p>
          This transfer is a cash advance from your credit card. There is no
          interest free grace period. Interest rates for cash advances are
          higher than those for purchases.
        </p>
      </>
    );
  }
};

export const interacPreferences = {
  NO_PROFILE_Error: () => (
    <>
      <h4 data-testid="no-interac-profile">
        {" "}
        No <em>Interac</em> profile
      </h4>
      <p>
        Create your <em>Interac</em> profile in order to send or receive funds
        by <em>Interac</em> e-Transfer.
      </p>
    </>
  ),
  MSG_RBET_040: createOrUpdate => {
    return (
      <>
        {`You've successfully ${createOrUpdate} your`} <i> Interac</i>{" "}
        {"profile."}
      </>
    );
  },
  ERR_SYSTEM_SAVE_AUTODEPOSIT: () => (
    <>
      <h4> {SYSTEM_ERROR}</h4>
      <p>
        We couldn’t save changes to your Autodeposit profile. Please try again.
      </p>
    </>
  ),
  ERR_SYSTEM_DUPLICATE_AUTODEPOSIT: () => (
    <>
      <h4 data-testid="autodeposit-duplicate"> Autodeposit Duplicate Email</h4>
      <p>
        That email address is already registered for Autodeposit. Enter a new
        email.
      </p>
    </>
  ),
  ERR_SYSTEM_MAXIMUM_AUTODEPOSIT: () => (
    <>
      <h4>Autodeposit Registrations Exceeded</h4>
      <p>
        You&apos;ve reached the maxiumum number of Autodeposit registrations. To
        add a new email address, delete an existing one.
      </p>
    </>
  ),
  MSG_RBET_052B: () => (
    <>
      <h4>Profile Update Required</h4>
      <p>
        For security purposes relating to the processing of Autodeposits,
        Interac requires us to display your registered legal name. There is no
        legal name associated with your profile. To update your name in our
        records, call 1-800-332-8383 and make sure to have any relevant legal
        documents ready.
      </p>
    </>
  ),
  MSG_RBET_058: email => (
    <>
      <h4>Delete email?</h4>
      <p className="wrapped-text">
        This will remove {email} from your Autodeposit profile.
      </p>
    </>
  ),
  SUCCESS_AUTODEPOSIT: () => (
    <>
      <h4 data-testid="autodeposit-confirm">Almost done!</h4>
      <p>
        You&apos;ll receive a confirmation email from <i>Interac</i> at the
        address you entered. Click the activation link in that email within next
        24 hours to complete your Autodeposit registration.
      </p>
    </>
  ),
  MSG_RBET_051B: "You've successfully updated your Autodeposit profile.",
  MSG_RBET_051C: () => (
    <p>
      You&apos;ve successfully disabled your email address for Autodeposit of
      funds sent by <em>Interac</em> e-Transfer.
    </p>
  ),
  ERR_MANDATORY_NAME: "Enter your name (special characters not supported).",
  ERR_MANDATORY_EMAIL: "Enter an email.",
  ERR_NO_ACCOUNT: "Select an account.",
  ERR_INCORRECT_FORMAT_EMAIL: "Enter a valid email address.",
  ERR_SYSTEM_SAVE_PROFILE: () => (
    <>
      <h4> {SYSTEM_ERROR}</h4>
      <p>
        We couldn’t save your <i>Interac</i> user profile. Please try again.
      </p>
    </>
  )
};

export const autoLogout = {
  MSG_RB_AUTH_035: seconds => {
    const formattedSeconds =
      seconds < 10 && seconds > 0 ? `0${seconds}` : seconds;
    return (
      <>
        <h4>Inactivity Warning</h4>
        <p>
          {`
          You've been inactive for 8 minutes. For security purposes, your online
          banking session will expire in ${formattedSeconds} seconds.
        `}
        </p>
      </>
    );
  }
};

export const mfaSecurityMessages = {
  MSG_RB_AUTH_022: "Enter the correct code or request a new code.",
  MSG_RB_AUTH_023: "The code you entered has expired. Request a new code.",
  MSG_RB_AUTH_038: (phone, method) =>
    `We've sent the code to ${phone} by ${method}.`,
  MSG_RB_AUTH_040: "Enter your six-digit code.",
  MSG_RB_AUTH_042:
    "We're experiencing some technical issues and were unable to retrieve your enhanced security information.",
  MSG_RB_AUTH_043:
    "We're experiencing some technical issues and were unable to send your code.",
  MSG_RB_AUTH_044:
    "We're experiencing some technical issues and were unable to verify your code.",
  MSG_RB_AUTH_050B:
    "For security reasons, you can't log in without verifying your identity.",
  MSG_RB_AUTH_050B_TITLE: "Confirm Authenticated User"
};

export const rsaSecurityMessage = {
  MSG_RBAUTH_008: "Please enter your answer.",
  MSG_RBAUTH_011: "The security answer you entered doesn't match our records."
};

export const fulfillRequestErrors = {
  MSG_RBET_072: (amount, name) => {
    return (
      <>
        <h4>Cancel fulfill money request?</h4>
        <p>
          {`
          Are you sure you don't want to finish transferring ${amount} to ${name}?
          `}
        </p>
      </>
    );
  }
};

export const authenticationErrors = {
  MSG_RBAUTH_012: "The passwords you entered don’t match.",
  MSG_RBAUTH_004: "Enter your password.",
  MSG_RBAUTH_001C: "Enter your current password.",
  MSG_RBAUTH_001B: "Enter your correct password.",
  MSG_RBAUTH_006:
    "Enter valid special characters (!@#$%^&*-_+={}[]|/:;'”.,<>?)",
  MSG_RBAUTH_004B: "You've reached the max character limit.",
  MSG_RBAUTH_011B: "Enter a password different from the one above.",
  MSG_RB_AUTH_025: () => {
    return (
      <>
        <h4>Password Not Changed</h4>
        <p>
          The temporary password you were given hasn&apos;t been changed. Are
          you sure you want to log out?
        </p>
      </>
    );
  },
  MSG_RB_AUTH_052: () => {
    return (
      <>
        <h4>{SYSTEM_ERROR}</h4>
        <p>
          We&apos;re experiencing some technical issues and were unable to
          change your password.
        </p>
      </>
    );
  },
  MSG_RB_AUTH_047: () => {
    return (
      <>
        <h4>{SYSTEM_ERROR}</h4>
        <p>
          We&apos;re experiencing some technical issues and were unable to
          retrieve information used to verify your identity.
        </p>
      </>
    );
  },
  MSG_RB_AUTH_024_TITLE: "You've successfully changed your password.",
  MSG_RBAUTH_011: "The security answer you entered doesn't match our records.",
  MSG_RBAUTH_008: "Please enter your answer.",
  MSG_RB_AUTH_047_CONTENT: () => {
    return (
      <p>
        We&apos;re experiencing some technical issues and were unable to
        retrieve information used to verify your identity.
      </p>
    );
  }
};

export const receiveEtransfer = {
  MSG_RBET_044C: senderName =>
    `We will notify ${senderName} that you've accepted their Interac e-Transfer deposit.`
};

export const failedTransactionMessages = {
  COMMON_TITLE: "Failed Transaction",
  MSG_RBFTA_000: unreadCount => `You have ${unreadCount} failed transactions.`,
  MSG_RBFTA_001: (amount, reason) =>
    `A scheduled transfer of ${amount} failed due to ${reason}.`,
  MSG_RBFTA_001B: amount => `A scheduled transfer of ${amount} failed.`,
  MSG_RBFTA_002: (amount, payeeName, reason) =>
    `A scheduled payment of ${amount} to ${payeeName} failed due to ${reason}.`,
  MSG_RBFTA_002B: (amount, payeeName) =>
    `A scheduled payment of ${amount} to ${payeeName} failed.`,
  MSG_RBFTA_004: (amount, payeeName, accountStatus) =>
    `A scheduled payment of ${amount} to ${payeeName} failed due to your account being ${accountStatus}.`,
  MSG_RBFTA_004B: (amount, accountStatus) =>
    `A scheduled transfer of ${amount} failed due to your account being ${accountStatus}.`,
  MSG_RBFTA_004C: (accountName, accountStatus) =>
    `Your account, ${accountName}, is ${accountStatus}. Please call us to regain access to this account.`,
  MSG_RBFTA_006_TITLE:
    "Good news! It looks like you have no failed transactions.",
  MSG_RBFTA_006:
    "You’ll be notified if a scheduled transaction fails and you can check back here to review your notification history at any time."
};

export const globalTransfersMessage = {
  MSG_GTA_PHONE: "1-866-282-4932"
};
