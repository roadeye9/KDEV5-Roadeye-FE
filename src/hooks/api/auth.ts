import { getMy, signIn } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useSignInMutation = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: signIn,
    });
};


