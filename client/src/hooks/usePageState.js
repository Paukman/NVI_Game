import { useState } from 'react';

const usePageState = (states) => {
  const [pageState] = useState(states);

  const updatePageState = (updatedPageState, message = null) => {
    const pageStateMap = {};
    const messageToUse = message || updatedPageState?.message;
    const pageStateToCheck = updatedPageState?.state || null;
    if (pageState != null && typeof pageState == 'object') {
      for (const key of Object.keys(pageState)) {
        const mapState = pageState[key]?.state;
        if (mapState) {
          pageStateMap[mapState] = pageStateToCheck === pageState[key]?.state ? messageToUse || true : false;
        }
      }
    }
    return pageStateMap;
  };

  return { updatePageState };
};

export default usePageState;
