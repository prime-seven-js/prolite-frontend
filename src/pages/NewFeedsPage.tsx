import SignOut from '@/components/SignOut'
import { useAuthStore } from '@/stores/useAuthStore'

const NewFeedsPage = () => {
    const { user } = useAuthStore();

    return (
        <>
            Welcome back, {`${user?.username}`}
            <SignOut />
        </>
    )
}

export default NewFeedsPage