import { setUser } from "@/redux/slice/user.slice";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useDispatch } from "react-redux";

interface WrapperProps {
  children: React.ReactNode;
}

const UserProvider: React.FC<WrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const fpPromise = FingerprintJS.load();
  (async () => {
    const fp = await fpPromise;
    const result = await fp.get();
    dispatch(setUser(result.visitorId));
  })();

  return <>{children}</>;
};

export default UserProvider;
