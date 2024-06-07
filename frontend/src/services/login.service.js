const api_url = import.meta.env.VITE_REACT_APP_API_URL;

// function to send post request to create new employe
const logIn = async (formData) => {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData),
	};
	// console.log("API URL:", api_URL);
	console.log("about to sennd request");
	console.log(requestOptions.body);
	const response = await fetch(`${api_url}/api/employee/login`, requestOptions);

	return response;
};

// A function to log out the user
const logOut = () => {
	localStorage.removeItem("employee");
};
const loginService = {
	logIn,
	logOut,
};

export default loginService;
