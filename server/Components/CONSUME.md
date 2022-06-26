# Consume mdo-react-components in a react application

## Prerequisites

- install aws-sdk / aws-cli globally
- have access to repository / domain / domain-owner credentials

## Quick start

### install aws-cli globally

`npm install -g aws-cli` OR `npm install -g aws-sdk`

## login with aws 

`aws codeartifact login --tool npm --repository mdo-react-components --domain mdo-react-components --domain-owner 936341724687`

## install mdo-react-components

`npm install --save mdo-react-components`

## Downgrade react-scripts 

 - After installing mdo-react-components, make sure to login to AWS and downgrade the react-scripts version to 4.0.3 as the components library does not support latest version. Please execute the following.

 `npm install --save react-scripts@4.0.3`