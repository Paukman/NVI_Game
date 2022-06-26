# MDO Components Node module boilerplate

A boilerplate for all the mdo react components

## Instructions for sending repository 

All operations is to publish mdo-react-components
1. git checkout develop in local
2. git pull (updated develop)
3. git checkout -b <new-branch>
4. git checkout master
5. git pull (updated master)
7. git checkout <new-branch>
8. git rebase master <new-branch> (merged master to <new-branch>)
9. if there is conflict, solve it
10. increase one version patch(third number) number in package.json
11. git push
12. compare <new-branch> with develop in remote(github web page)
13. After approval, merge <new-branch> to develop in remote
14. create new pr to compare master with develop in remote. This step shouldn't have any conflict because we already solved it.
15. After two approvals, merge develop to master.
 

## Requirements

- [Node.js](http://nodejs.org),
- [Yarn](http://yarnpkg.com)
- [CircleCI](https://circleci.com)

## Quickstart

```
> yarn install
```

### Build

After each change to this repository, please rebuild the boilerplate to make the changes effective using below command

```
> yarn build
```

### Development

https://github.com/whitecolor/yalc

```
> yalc publish
> cd example && yalc add mdo-react-components
```

### Unit tests

```
> yarn test
```

### Component folder structure

Here is the default folder and files structure for each component:

- components
  -- Example
  --- Example.js - this is component implementation
  --- styled.js - styles are here, we are using `styled-components` library
  --- index.js - import Example.js and maybe other components in this folder and then export them
  --- _tests_ - folder with tests
  ---- Example.spec.js - tests for the component

### Example component

When developing components follow the guideliens outlined here:

- https://docs.google.com/document/d/1vs0f9hTi0FQxebNZmcGE6bM4SgQcSUvr4yff-kCnWjM/edit?usp=sharing
- https://docs.google.com/document/d/1OeltaBvGRRV5f7z9Oe_rQt65NMqS3TYSfzAO3aDgIF4/edit?usp=sharing

Quick component example is below.

#### Example.jsx

```jsx
import React, { memo } from "react";
import PropTypes from 'prop-types';

const Example = memo((props) => {
  const { prop1, prop2 } = props;
  return (
    <div>
      Something Here
    </div>
  )
});

Example.displayName = 'Example';

Example.propTypes = {
  prop1: PropTypes.number.isRequired, // try to limit the number of required props
  prop2: PropTypes.string
  ...
};

Example.defaultProps = {
  prop2: 'Default', // Default props only for not required props
}
```

#### index.js

```
import Example from 'Example';

export default Example;
```

## Usage of the mdo-react-components library on other apps

In your application just import the components:

```
import { DataTable, CheckBox, /* other components */ } from "mdo-react-components";
```

## Branching

Follow the guidelines outlined here: https://docs.google.com/document/d/1xZEeuOBfb6nFdhGzNyCuOPrT2CLTZiskRSKaIbD71ys/edit?usp=sharing

## Pull Requests

As soon as you Each pull request must pass a review from another contributor and also pass the automated tests.

## Useful links

- [NPM Modules](https://nodejs.org/api/modules.html)
- [Yarn](https://classic.yarnpkg.com/en/docs/getting-started)
- [Yalc](https://github.com/whitecolor/yalc)
- [React](https://reactjs.org/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Styled-Components](https://styled-components.com/docs/basics)
- [Styled-System](https://styled-system.com/getting-started)
- [Material UI](https://material-ui.com/getting-started/usage/)
- [CircleCI](https://circleci.com)

## License

This repository is protected under the [MIT License](https://choosealicense.com/licenses/mit/)

## am-charts

- [Column-Chart](https://www.amcharts.com/demos/simple-column-chart/)
- [Bar-Chart](https://www.amcharts.com/demos/clustered-bar-chart/)
