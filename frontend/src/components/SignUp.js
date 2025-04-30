import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await axios.post("http://localhost:3001/user/sign-up", formData);

            // No need to call response.json() with Axios, just use response.data
            if (response.status === 201) {
                alert("Sign Up successful");
                navigate("/sign-in");
            }
        } catch (error) {
            // Handle server response errors
            if (error.response) {
                setError(error.response.data.error || "Something went wrong");
            } else {
                setError("Failed to connect to the server");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <a href="/sign-in" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
