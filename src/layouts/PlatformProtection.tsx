import { getMy } from "@/api/auth";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import React, { useLayoutEffect } from "react";
import { PropsWithChildren } from "react";

const PlatformProtection = ({children}: PropsWithChildren) => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    useLayoutEffect(() => {
        getMy()
            .then((user) => {
                setUser(user);
            })
            .catch((error) => {
                console.error('인증 실패:', error);
                navigate('/login');
            });
    }, [navigate, setUser]);

    return children;
};

export default PlatformProtection;