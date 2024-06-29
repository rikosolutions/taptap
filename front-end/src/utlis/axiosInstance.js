import axios from "axios";

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
    (config) => {
        const auth_token = localStorage.getItem("auth_token");
        const score = localStorage.getItem("score");
        if (auth_token) config.headers["Authorization"] = `Bearer ${auth_token}`;
        if (score) config.headers["score"] = score;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { status } = error.response;
        if (status === 401) {
            window.location.href = "/game";
        } else {
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;