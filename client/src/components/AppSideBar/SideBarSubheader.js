import React from 'react';
import { Image, ListSubheader } from 'mdo-react-components';

import { SubHeaderWrapper } from './styled';

const SideBarSubheader = () => {
  return (
    <ListSubheader disableGutters={true}>
      <SubHeaderWrapper>
        <Image src='/myp2_logo_white.svg' height={30} />
      </SubHeaderWrapper>
    </ListSubheader>
  );
};

export { SideBarSubheader };
