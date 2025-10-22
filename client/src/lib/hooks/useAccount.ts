import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import agent from "../api/agent";
import { useLocation, useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  type LocationState = { from?: string } | null;

  // Login
  const loginUser = useMutation({
    mutationFn: async (creds: LoginSchema) => {
      // we assume the login endpoint sets auth cookie / token server-side
      await agent.post("/login?useCookies=true", creds);
    },
    onSuccess: async () => {
      // After login, explicitly fetch user-info and populate the cache,
      // then navigate. This avoids the problem where the ["user"] query
      // is disabled on /login so invalidation alone won't refetch.
      try {
        const response = await agent.get<User>("/account/user-info");
        queryClient.setQueryData(["user"], response.data);
      } catch (err) {
        // optional: handle or log - keep silent so we can still navigate
        console.error("Failed fetching user-info after login:", err);
      }

      // optionally refresh activities cache if you expect activities to
      // change after login:
      await queryClient.invalidateQueries({ queryKey: ["activities"] });

      // then navigate to saved location or activities
      const from = (location.state as LocationState)?.from ?? "/activities";
      navigate(from);
    },
  });

  // Register
  const registerUser = useMutation({
    mutationFn: async (creds: RegisterSchema) => {
      await agent.post("/account/register", creds);
    },
    onSuccess: () => {
      toast.success("Register successful - you can now login");
      navigate("/login");
    },
  });

  // Logout
  const logoutUser = useMutation({
    mutationFn: async () => {
      await agent.post("/account/logout");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["activities"] });
      navigate("/");
    },
  });

  // user-info query (keeps your enabled checks)
  const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/account/user-info");
      return response.data;
    },
    enabled:
      !queryClient.getQueryData(["user"]) &&
      location.pathname !== "/login" &&
      location.pathname !== "/register",
  });

  return { loginUser, currentUser, logoutUser, loadingUserInfo, registerUser };
};
