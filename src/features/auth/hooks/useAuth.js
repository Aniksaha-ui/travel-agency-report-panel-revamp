import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_ROUTES } from "../../../constants/routes";
import {
  clearMenu,
  clearPersistedMenuState,
  fetchMenu,
  selectMenu,
} from "../../menu/store/menuSlice";
import { login } from "../services/authService";
import {
  clearCredentials,
  clearPersistedAuthSession,
  persistAuthSession,
  selectAuth,
  setCredentials,
} from "../store/authSlice";

export default function useAuth() {
  const auth = useSelector(selectAuth);
  const menu = useSelector(selectMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated || menu.status !== "idle") {
      return;
    }

    dispatch(fetchMenu()).unwrap().catch((errorMessage) => {
      toast.error(errorMessage || "Unable to load menu items.");
    });
  }, [auth.isAuthenticated, dispatch, menu.status]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      persistAuthSession(session);
      dispatch(setCredentials(session));
      dispatch(clearMenu());
      dispatch(fetchMenu()).unwrap().catch((errorMessage) => {
        toast.error(errorMessage || "Unable to load menu items.");
      });
      navigate(APP_ROUTES.dashboard, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to sign in.");
    },
  });

  const logout = () => {
    clearPersistedAuthSession();
    clearPersistedMenuState();
    dispatch(clearCredentials());
    dispatch(clearMenu());
    navigate(APP_ROUTES.login, { replace: true });
  };

  return {
    auth,
    loginMutation,
    logout,
  };
}
