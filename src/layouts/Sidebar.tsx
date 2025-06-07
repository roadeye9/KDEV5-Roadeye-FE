import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Settings, User, LayoutDashboard, Truck, Inbox, ShoppingBag, Users, HelpCircle, Settings as SettingsIcon, UserCog } from "lucide-react";
import { Button, Card, CardBody } from "@nextui-org/react";

const MENU_ITEMS = [
    // { icon: LayoutDashboard, label: "Dashboard", url: "/manage" },
    // { icon: Truck, label: "Tracking", url: "/manage/tracking" },
    // { icon: Inbox, label: "Inbox", badge: 3, url: "/manage/inbox" },
    // { icon: ShoppingBag, label: "Orders", url: "/manage/orders" },
    // { icon: Users, label: "Customers", url: "/manage/customers" },
    { icon: UserCog, label: "직원 관리", url: "/manage/employee" },
    { icon: Truck, label: "차량 관리", url: "/manage/vehicle" },
    ];
const Sidebar = () => {
    const navigate = useNavigate();
    return (
        <>
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
                            onClick={() => navigate(item.url)}
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
            </div>
</>
    )
}


export default Sidebar; 