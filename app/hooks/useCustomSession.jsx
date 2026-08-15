import { useSession } from "next-auth/react";

 const useCustomSession = () => {
    const { data: session, status } = useSession();
    const tokenExpiry = session?.expires
    const token = session?.user?.accessToken
    const userInfo = session?.user
    return {userInfo,token,tokenExpiry,status}

}
export default useCustomSession;