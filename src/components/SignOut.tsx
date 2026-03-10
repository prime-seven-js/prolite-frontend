import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

const SignOut = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Button onClick={handleSignOut}>Logout</Button>
  )
}

export default SignOut