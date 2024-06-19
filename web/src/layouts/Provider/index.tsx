import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { selectUser, setUser } from '@/redux/slice/user.slice';
import { useDispatch, useSelector } from 'react-redux';

interface WrapperProps {
    children: React.ReactNode;
  }

const  UserProvider : React.FC<WrapperProps> = ({ children }) => {
    const userId = useSelector(selectUser);
    console.log(userId)
    const dispatch = useDispatch();
    const fpPromise = FingerprintJS.load();
    (async () => {
        const fp = await fpPromise
        const result = await fp.get()
        dispatch(setUser(result.visitorId))
        // console.log(result.visitorId)
      })()

    return <>{children}</>

}

export default UserProvider;