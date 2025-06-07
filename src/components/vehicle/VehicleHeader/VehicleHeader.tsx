import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";


export const VehicleHeader = () => {

    return (
        <div className="flex items-center justify-between py-3 px-2">
            <h1 className="text-xl font-semibold">차량 관리</h1>
            <Input
                classNames={{
                    input: "text-sm",
                    inputWrapper: "h-10 border-1",
                }}
                placeholder="차량 이름"
                startContent={<Search size={18} className="text-gray-400" />}
                variant="bordered"
                radius="sm"
                className="w-80"
            />
        </div>
    );
}