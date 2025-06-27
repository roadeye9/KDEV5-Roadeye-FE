import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bell, Settings, User, LayoutDashboard, Truck, Inbox, ShoppingBag, Users, HelpCircle, Settings as SettingsIcon, UserCog, Calendar, ClipboardList, MapPin, FileText, Car, LogOut } from "lucide-react";
import { Button, Card, CardBody, Avatar } from "@nextui-org/react";
import { useMyMutation } from "@/hooks/api/auth";
import { useEmployeeMyQuery, useEmployeeQuery } from "@/hooks/api/employee";

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "대시보드", url: "/manage/dashboard", activeURLs: ["/manage/dashboard"] },
    { icon: UserCog, label: "직원 관리", url: "/manage/employee" },
    { icon: Truck, label: "차량 관리", url: "/manage/vehicle" },
    { icon: MapPin, label: "차량 관제", url: "/manage/vehicle-control" },
    { icon: FileText, label: "운행 일지", url: "/manage/driving-log", activeURLs: ["/manage/driving-log", "/manage/driving-log-detail"] },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 위치 정보를 가져옴
    const { data: userInfo } = useEmployeeMyQuery();

    const handleLogout = () => {
        // 로그아웃 로직
        console.log("로그아웃");
        navigate("/login");
    };

    return (
        <>
            {/* 왼쪽 사이드바 */}
            <div className="w-[240px] h-screen flex flex-col bg-white border-r border-gray-200">
                {/* 로고 영역 */}
                <div 
                    className="flex items-center gap-3 px-6 py-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => navigate("/manage/dashboard")}
                >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-gray-800">RoadEye</h1>
                        <p className="text-xs text-gray-500">Fleet Management</p>
                    </div>
                </div>

                {/* 메뉴 아이템 */}
                <nav className="flex-1 px-4 py-4">
                    <div className="space-y-2">
                        {MENU_ITEMS.map((item, index) => {
                            // 현재 경로와 메뉴의 URL이 정확히 일치하거나, 하위 경로(/로 시작)인지 확인
                            const isActive = (item.activeURLs || [item.url]).some(url => 
                                location.pathname === url || location.pathname.startsWith(url + '/')
                            );

                            return (
                                <Button
                                    key={index}
                                    variant={isActive ? "flat" : "light"}
                                    color={isActive ? "primary" : "default"}
                                    className={`w-full justify-start gap-3 px-3 h-12 text-gray-700 ${
                                        isActive 
                                            ? "bg-blue-100 text-blue-600 font-bold" 
                                            : "hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                                    onClick={() => navigate(item.url)}
                                >
                                    <item.icon size={20} className={isActive ? "text-blue-600" : ""} />
                                    <span className="font-medium">{item.label}</span>
                                </Button>
                            )
                        })}
                    </div>
                </nav>

                {/* 사용자 정보 영역 */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar 
                            // name={userInfo?.name} 
                            className="w-10 h-10 bg-blue-100 text-blue-600 font-semibold"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{userInfo?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{userInfo?.loginId}</p>
                            <p className="text-xs text-blue-600 font-medium">{userInfo?.position === 'Administrator' ? '관리자' : '일반'}</p>
                        </div>
                    </div>
                    
                    <Button
                        variant="light"
                        color="danger"
                        size="sm"
                        className="w-full justify-start gap-2 text-gray-600 hover:text-red-600"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Sidebar; 