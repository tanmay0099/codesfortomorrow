import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:3001/user/sign-in", formData);

            // Axios already parses response data, no need for response.json()
            if (response.status === 200) {
                alert("Sign In successful");
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
            }
        } catch (error) {
            // Handle server response errors
            if (error.response) {
                setError(error.response.data.message || "Invalid credentials");
            } else {
                setError("Failed to connect to the server");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign In</button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <a href="/" className="text-blue-500">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
