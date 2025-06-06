import React from "react";
import {
    User,
    Chip,
    ChipProps,
    Button,
} from "@nextui-org/react";
import { Star } from "lucide-react";

type StatusColorMap = {
    [key: string]: ChipProps["color"];
};

const statusColorMap: StatusColorMap = {
    "In Negotiation": "warning",
    "Rejected": "danger",
    "Under Review": "secondary",
    "Accepted": "success",
    "Prospective": "primary",
};

interface TableCellProps {
    user: any;
    columnKey: React.Key;
}

export const CustomTableCell: React.FC<TableCellProps> = ({ user, columnKey }) => {
    const cellValue = user[columnKey as keyof typeof user];

    switch (columnKey) {
        case "clientName":
            return (
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="light" className="text-default-400 min-w-unit-8 w-8 h-8">
                        <Star size={16} />
                    </Button>
                    <User
                        avatarProps={{ radius: "full", size: "sm", src: user.avatar }}
                        name={cellValue}
                        className="justify-start"
                    />
                </div>
            );
        case "company":
            return (
                <div className="flex items-center">
                    <span>{cellValue}</span>
                </div>
            );
        case "status":
            return (
                <Chip
                    className="capitalize"
                    color={statusColorMap[user.status]}
                    size="sm"
                    variant="flat"
                    radius="sm"
                >
                    {cellValue}
                </Chip>
            );
        case "categories":
            return (
                <div className="flex gap-2">
                    {user.categories.map((category: string) => (
                        <Chip
                            key={category}
                            className="capitalize"
                            size="sm"
                            variant="flat"
                            radius="sm"
                        >
                            {category}
                        </Chip>
                    ))}
                </div>
            );
        default:
            return cellValue;
    }
}; 