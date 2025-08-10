import axios from "./axios";

const signup = async (data) => {
    const res = await axios.post("/signup", data);
    return res.data;
}
const login = async (email, password) => {
    const res = await axios.post("/login", { email, password });
    return res.data;
}
const refreshToken = async () => {
    const res = await axios.get("/refresh-token");
    return res.data;
}
export { signup, login, refreshToken }