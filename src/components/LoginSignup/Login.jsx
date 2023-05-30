import { FaAmazon } from "react-icons/fa";

export default function Login() {
  return (
    <form className="p-4">
      <input type="email" id="email" required placeholder="Your Email ID" />
      <input type="password" required placeholder="Your Password" />
      <FaAmazon className="" />

      <button>Login</button>
    </form>
  );
}
