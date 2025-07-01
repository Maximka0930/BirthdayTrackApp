"use client";

import { Calendar, Avatar, Badge, List } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getUsersAllInfo } from "../services/UserAllInfo";

export default function BirthdayCalendar() {
    // Пример данных (замените на реальные из API)
    const [users, setUsers] = useState<UserAllInfo[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getUsers = async () => {
            const users = await getUsersAllInfo();
            setLoading(false);
            setUsers(users);
        };

        getUsers();

    }, [])

    // Функция для проверки дня рождения
    const isBirthday = (date: Dayjs, birthday: string) => {
        const birthDate = dayjs(birthday); // Преобразуем строку в Dayjs
        return date.month() === birthDate.month() &&
            date.date() === birthDate.date();
    };

    const dateCellRender = (date: Dayjs) => {
        const birthdaysToday = users.filter(user =>
            isBirthday(date, user.dateOfBirth)
        );

        const ROLE_MAPPING = {
            0: { text: "Семья", color: "#FF69B4" },
            1: { text: "Коллеги", color: "#FFA500" },
            2: { text: "Друзья", color: "#90EE90" },
        } as const;

        function UserCard({ user }: { user: UserAllInfo }) {
            const borderColor = ROLE_MAPPING[user.userStatus as keyof typeof ROLE_MAPPING]?.color || "#000";
            const imageSrc = byteArrayToDataURL(user.dataImage);
            const fullName = `${user.name} ${user.surName}`;
            const shortName = `${user.name} ${user.surName[0]}.`;

            // Определяем, что показывать в зависимости от длины имени
            const displayName = fullName.length > 12 ? user.name : shortName;

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '80px',
                    overflow: 'hidden',
                    padding: '4px'
                }}>
                    <Avatar
                        size={56}
                        src={imageSrc}
                        alt={fullName}
                        style={{
                            border: `2px solid ${borderColor}`,
                            objectFit: 'cover',
                            backgroundColor: '#f0f0f0',
                            marginBottom: '4px'
                        }}
                        onError={() => {
                            console.log('Error loading image');
                            return false;
                        }}
                    />
                    <div
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '12px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: '1.2'
                        }}
                        title={fullName} // Полное имя в тултипе
                    >
                        {displayName}
                    </div>
                </div>
            );
        }

        function byteArrayToDataURL(byteArray: string | Uint8Array | number[] | null): string {
            if (typeof byteArray === 'string') {
                return byteArray.startsWith('data:image')
                    ? byteArray
                    : `data:image/jpeg;base64,${byteArray}`;
            }

            if (!byteArray) return "/default-avatar.png";

            try {
                const uint8Array = byteArray instanceof Uint8Array
                    ? byteArray
                    : new Uint8Array(byteArray);

                const binary = Array.from(uint8Array)
                    .map(byte => String.fromCharCode(byte))
                    .join('');

                return `data:image/jpeg;base64,${btoa(binary)}`;
            } catch (error) {
                console.error("Image conversion error:", error);
                return "/default-avatar.png";
            }
        }

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 0',
                height: '100%',
                overflow: 'hidden'
            }}>
                {birthdaysToday.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        );
    };

    return (
        <div style={{
            padding: 24,
            maxWidth: 900,
            margin: "0 auto",
            fontFamily: 'Arial, sans-serif'
        }}>
            <Calendar
                cellRender={dateCellRender}
                style={{
                    border: "2px solid #f0f0f0",
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: '#fff'
                }}
            />
        </div>
    );
}