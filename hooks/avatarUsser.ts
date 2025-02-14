import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { UserAvatar } from "@/types";

export const useFetchUserData = () => {
  const [loading, setLoading] = useState(false);
  const [userDataHook, setUserData] = useState<UserAvatar | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDataHook = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/auth/users-avatar/${id}/`);
      if (!response.data) {
        throw new Error(`Lỗi: ${response.status}`);
      }
      setUserData(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return { loading, userDataHook, error, fetchUserDataHook };
};
