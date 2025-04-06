import axios from "axios";
import { THREATS_API } from "../lib/const/api";

export const fetchThreats = async ({ setLoading, setThreats, setTotalCount, currentPage = 1 }) => {
    try {
        setLoading(true);
        const response = await axios.get(`${THREATS_API}?page=${currentPage}`);
        setThreats(response?.data?.data);
        setTotalCount(response.data?.meta?.total);
    } catch (error) {
        console.error('Error fetching threats:', error);
    } finally {
        setLoading(false);
    }
};