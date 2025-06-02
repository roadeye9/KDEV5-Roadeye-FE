import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";
import { Bell, Settings, User, LayoutDashboard, Truck, Inbox, ShoppingBag, Users, HelpCircle, Settings as SettingsIcon } from "lucide-react";
import { Button, Card, CardBody } from "@nextui-org/react";

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Truck, label: "Tracking" },
    { icon: Inbox, label: "Inbox", badge: 3 },
    { icon: ShoppingBag, label: "Orders" },
    { icon: Users, label: "Customers" },
    { icon: HelpCircle, label: "Help & Support" },
    { icon: SettingsIcon, label: "Settings" },
];

const PlatformLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* 왼쪽 사이드바 */}
            <div className="w-[240px] p-4 flex flex-col">
                {/* 로고 영역 */}
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <span className="text-pink-500 font-bold">R</span>
                    </div>
                    <div className="flex-1">
                        <h1 className="font-semibold">Route</h1>
                        <p className="text-xs text-gray-500">route@gmail.com</p>
                    </div>
                </div>

                {/* 검색바 */}
                <div className="relative mt-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm"
                    />
                </div>

                {/* 메뉴 아이템 */}
                <nav className="flex-1">
                    {MENU_ITEMS.map((item, index) => (
                        <Button
                            key={index}
                            variant="light"
                            className="w-full justify-start gap-3 mb-1 px-2 h-11"
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto bg-gray-100 px-2 rounded-full text-xs">
                                    {item.badge}
                                </span>
                            )}
                        </Button>
                    ))}
                </nav>

                {/* Free Trial 섹션 */}
                <div className="mt-auto p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Free trial</span>
                        <span className="text-xs text-gray-500">7 days left</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-blue-500"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Get better experience and boost your workflow!
                    </p>
                    <Button className="w-full mt-3" color="primary" size="sm">
                        Upgrade now
                    </Button>
                </div>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <Card className="flex-1 p-4 m-5 bg-gray-100" shadow="sm">
                <CardBody>
                    <Outlet />
                    <Toaster />
                </CardBody>
            </Card>
        </div>
    );
}

export default PlatformLayout;