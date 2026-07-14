import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";

import Swal from "sweetalert2";
import { saveOrUpdateUser } from "../../../utils";

const SocialLogin = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleGoogleSignIn = async () => {
    try {                               
      const result = await googleSignIn();
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL,
      };
      const savedUser = await saveOrUpdateUser(userData);
      console.log(savedUser);
      if (savedUser?.insertedId || savedUser?.modifiedCount) {
        console.log("User saved or updated successfully");
        Swal.fire({
            icon: "success",
            title: savedUser.insertedId
              ? "Registration Successful!"
              : "Login Successful!",
            text: savedUser.insertedId
              ? "Your account has been created successfully."
              : "You have logged in successfully.",
          });
        }
        navigate(location.state || "/");
      } catch (error) {
        console.log("Google sign-in error:", error);
      }
    
    
  };

  return (
    <div>
      {/* Google */}
      <button
        onClick={handleGoogleSignIn}
        className="btn w-full bg-white text-black border-[#e5e5e5]"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
