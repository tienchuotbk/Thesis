import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { selectUser, setUser } from '@/redux/slice/user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

interface WrapperProps {
    children: React.ReactNode;
  }

const  UserProvider : React.FC<WrapperProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const fpPromise = FingerprintJS.load();
    async function getUid() {
      console.log("Chay get uid")
        const fp = await fpPromise
        const result = await fp.get()
        dispatch(setUser(result.visitorId))
        setLoading(false);
        // console.log(result.visitorId)
    }

    useEffect(()=> {
      getUid();
    }, []);

    return <>{!loading ? children : null}</>

}

export default UserProvider;