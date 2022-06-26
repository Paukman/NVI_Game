import { useAuth0 } from "utils/auth0/Auth0Wrapper";

const Expired = () => {
  const { logout } = useAuth0();

  logout({
    returnTo: `${window.location.origin}/logout?loggedOutMessage=inactive`
  });

  return null;
};

export default Expired;
