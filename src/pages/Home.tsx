import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-3xs gap-3 m-3">
      <Button onClick={() => navigate("/login")}>Login</Button>
      <Button onClick={() => navigate("/signup")}>Sign Up</Button>
    </div>
  );
};

export default Home;
