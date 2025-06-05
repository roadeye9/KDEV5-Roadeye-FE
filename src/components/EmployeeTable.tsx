import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
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

const columns = [
    { name: "CLIENT NAME", uid: "clientName" },
    { name: "COMPANY", uid: "company" },
    { name: "LISTING PRICE", uid: "listingPrice" },
    { name: "ADDRESS", uid: "address" },
    { name: "STATUS", uid: "status" },
    { name: "DATE", uid: "date" },
    { name: "CATEGORIES", uid: "categories" },
];

const users = [
    {
        id: 1,
        clientName: "Nisha Kumari",
        company: "Hyperlink",
        listingPrice: "$15,900,000",
        address: "987 Teck way, Seattle WA",
        status: "In Negotiation",
        date: "12/03/20247",
        categories: ["B2B", "Tech"],
        avatar: "https://i.pravatar.cc/150?u=nk",
    },
    {
        id: 2,
        clientName: "Sophia",
        company: "Kritrim",
        listingPrice: "$15,900,000",
        address: "987 Teck way, Seattle WA",
        status: "Rejected",
        date: "12/03/20247",
        categories: ["B2B", "Finance"],
        avatar: "https://i.pravatar.cc/150?u=sophia",
    },
    // ... 더 많은 데이터 추가 가능
];

export default function EmployeeTable() {
    const renderCell = React.useCallback((user: any, columnKey: React.Key) => {
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
    }, []);

    return (
        <div className="h-full px-1">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <Button color="primary" variant="light" radius="sm">
                        Update
                    </Button>
                    <span className="text-default-400">4 Selected</span>
                    <Button variant="light" radius="sm">
                        Filter 4
                    </Button>
                    <Button variant="light" radius="sm">
                        Sort
                    </Button>
                    <span className="text-default-400">120 Results</span>
                </div>
                <div className="flex gap-4">
                    <Button color="primary" radius="sm">
                        Add New
                    </Button>
                    <Button variant="light" radius="sm">
                        Import/Export
                    </Button>
                    <Button variant="light" radius="sm">
                        View
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table 
                    aria-label="Employee table"
                    className="mt-4 min-w-[1200px]"
                    radius="none"
                    shadow="none"
                    isCompact={true}
                    removeWrapper
                    classNames={{
                        td: [
                            "border border-divider",
                        ],
                        th: "border border-divider bg-white",
                        table: "border border-divider w-full",
                        tr: [
                            "even:bg-gray-50",
                            "odd:bg-white",
                        ],
                        wrapper: "overflow-x-auto",
                    }}
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn  key={column.uid}>{column.name}</TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={[...users, {id: 101}, {id:102}, {id:103}, {id:104}, {id:105}, {id:106}, {id:107}, {id:108}, {id:109}, {id:110}, {id:111}, {id:112}, {id:113}, {id:114}, {id:115}, {id:116}, {id:117}, {id:118}, {id:119}, {id:120}]}>
                        {(item) => 
                            item.id >= 100 ? (
                                <TableRow key={item.id}>
                                    {columns.map((col) => (
                                        <TableCell key={col.uid}>&nbsp;</TableCell>
                                    ))}
                                </TableRow>
                            ) : (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 