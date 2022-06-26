import { useState } from "react";
import useIsMounted from "utils/hooks/useIsMounted";

const useMask = (
  maskFunction = value => value,
  unmaskFuntion = value => value
) => {
  const [maskedValue, setMaskedValue] = useState();
  const [unmaskedValue, setUnmaskedValue] = useState();
  const isMounted = useIsMounted();

  const onChange = value => {
    if (isMounted()) {
      const unmasked = unmaskFuntion(value);
      const newValue = maskFunction(unmasked);
      setMaskedValue(newValue);
      setUnmaskedValue(unmasked);
    }
  };

  return [maskedValue, unmaskedValue, onChange];
};

export default useMask;
