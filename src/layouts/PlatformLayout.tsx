import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";
import { Card, CardBody } from "@nextui-org/react";
import PlatformProtection from "./PlatformProtection";
import { UserProvider } from "@/contexts/UserContext";
import Sidebar from "./Sidebar";


const PlatformLayout = () => {
    return (
        <UserProvider>
            <PlatformProtection>
                <div className="flex min-h-screen bg-gray-50">
                    <Sidebar />
                    {/* 메인 콘텐츠 영역 */}
                    <Card className="flex-1 bg-gray-100" shadow="sm" radius="none">
                        <CardBody className="p-0">
                            <Outlet />
                        </CardBody>
                    </Card>
                    <Toaster />
                </div>
            </PlatformProtection>
        </UserProvider>
    );
}

export default PlatformLayout;