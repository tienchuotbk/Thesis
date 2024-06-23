import { setUser } from "@/redux/slice/user.slice";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useDispatch } from "react-redux";

import { useEffect, useState } from "react";

interface WrapperProps {
  children: React.ReactNode;
}

const UserProvider: React.FC<WrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const fpPromise = FingerprintJS.load();
  async function getUid() {
    const fp = await fpPromise;
    const result = await fp.get();
    dispatch(setUser(result.visitorId));
    setLoading(false);
  }

  useEffect(() => {
    getUid();
  }, []);

  return <>{!loading ? children : null}</>;
};

export default UserProvider;
