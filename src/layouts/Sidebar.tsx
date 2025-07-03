import { useNavigate, NavLink } from "react-router-dom";
import { LayoutDashboard, Truck, UserCog, MapPin, FileText, Car, LogOut, type LucideIcon } from "lucide-react";
import { Button, Avatar } from "@nextui-org/react";
import { useEmployeeMyQuery } from "@/hooks/api/employee";
import { Suspense } from "react";

const MENU_ITEMS = [
    {
        icon: LayoutDashboard,
        label: "대시보드",
        url: "/manage/dashboard"
    },
    {
        icon: UserCog,
        label: "직원 관리",
        url: "/manage/employee"
    },
    {
        icon:
            Truck,
        label: "차량 관리",
        url: "/manage/vehicle"
    },
    {
        icon: MapPin,
        label: "차량 관제",
        url: "/manage/vehicle-control"
    },
    {
        icon: FileText,
        label: "운행 일지",
        url: "/manage/driving-log"
    },
] as const;

const Sidebar = () => {
    return (
        <div className="w-[240px] h-screen flex flex-col bg-white border-r border-gray-200">
            <Header />
            <div className="flex-1 px-4 py-4 gap-2">
                {MENU_ITEMS.map((item) => (
                    <MenuItem key={item.url} item={item} />
                ))}
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <UserInfo />
            </Suspense>
        </div>
    )
}

function Header() {
    return (
        <div className="flex items-center gap-3 px-6 py-6 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="font-bold text-xl text-gray-800">RoadEye</h1>
                <p className="text-xs text-gray-500">Fleet Management</p>
            </div>
        </div>
    )
}

function MenuItem({ item }: { item: typeof MENU_ITEMS[number] }) {
    return (
        <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 h-12 text-gray-700 rounded-lg transition-colors ${isActive
                    ? "bg-blue-100 text-blue-600 font-bold"
                    : "hover:text-blue-600 hover:bg-blue-50"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <item.icon size={20} className={isActive ? "text-blue-600" : ""} />
                    <span className="font-medium">{item.label}</span>
                </>
            )}
        </NavLink>
    )
}

function UserInfo() {
    const navigate = useNavigate();

    const { data: userInfo } = useEmployeeMyQuery();

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
                <Avatar
                    className="w-10 h-10 bg-blue-100 text-blue-600 font-semibold"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{userInfo.name}</p>
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
    )
}

export default Sidebar; 