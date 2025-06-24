import { getMy, signIn } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useSignInMutation = () => {
    return useMutation({
        mutationFn: signIn,
    });
};

export const useMyMutation = () => {
    return useMutation({
        mutationFn: getMy,
        onSuccess: (data) => {
            console.log(data);
        },
    });
};
