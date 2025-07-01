import { Avatar, Button } from 'antd';
import { useState } from 'react';

const ROLE_MAPPING = {
    0: { text: "Семья", color: "#FF69B4" }, // Розовый
    1: { text: "Коллеги", color: "#FFA500" }, // Оранжевый
    2: { text: "Друзья", color: "#90EE90" }, // Салатовый
} as const;

function RoleBadge({ roleId }: { roleId: number }) {
    const role = ROLE_MAPPING[roleId as keyof typeof ROLE_MAPPING];

    return (
        <div
            style={{
                display: "inline-flex",
                padding: "8px 16px",
                borderRadius: "8px",
                border: `1.5px solid ${role?.color || "#999"}`, // Граница (1px)
                color: role?.color || "#999", // Цвет текста
                backgroundColor: "transparent", // Прозрачный фон
                fontSize: "14px",
                fontWeight: "bold",
            }}
        >
            {role?.text || "неизвестно"}
        </div>
    );
}

function byteArrayToDataURL(byteArray: string | Uint8Array | number[] | null): string {
    try {
        // Если данные уже в формате base64 строки
        if (typeof byteArray === 'string') {
            // Проверяем, не является ли строка уже data URL
            if (byteArray.startsWith('data:image')) {
                return byteArray;
            }
            // Если это plain base64, добавляем префикс
            return `data:image/jpeg;base64,${byteArray}`;
        }

        // Если null или undefined, возвращаем дефолтное изображение
        if (!byteArray) {
            return "/default-avatar.png";
        }

        // Если пришел number[] - конвертируем в Uint8Array
        const uint8Array = byteArray instanceof Uint8Array
            ? byteArray
            : new Uint8Array(byteArray);

        // Более эффективный вариант преобразования
        const binary = uint8Array.reduce((acc, byte) =>
            acc + String.fromCharCode(byte),
            ''
        );

        const base64 = btoa(binary);
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.error("Error converting byte array to image:", error);
        return "/default-avatar.png";
    }
}

function UserAvatar({ user }: { user: UserAllInfo }) {
    const borderColor = ROLE_MAPPING[user.userStatus as keyof typeof ROLE_MAPPING]?.color || "#000";
    const imageSrc = byteArrayToDataURL(user.dataImage);

    return (
        <Avatar
            size={100}
            src={imageSrc}
            alt={`${user.name} ${user.surName[0]}."`}
            style={{
                minWidth: "64px",
                border: `2px solid ${borderColor}`,
                objectFit: "cover",
                backgroundColor: '#f0f0f0' // Фон для прозрачных изображений
            }}
            onError={() => { console.log('Error loading image'); return false; }}

        />
    );
}

interface Props {
    users: UserAllInfo[],
    handleDelete: (id: string) => void,
    handleOpen: (user: UserAllInfo) => void,
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(dateString));
};

export const UsersCard = ({ users, handleDelete, handleOpen }: Props) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {users.map((user) => (
                <div
                    key={user.id}
                    style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '24px',
                        marginTop: "4px",
                        marginBottom: "4px",
                        border: '0px solid rgb(0, 0, 0)',
                        borderRadius: '16px',
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"

                    }}
                >
                    <UserAvatar user={user} />

                    <div style={{ flexDirection: 'column', marginLeft: "16px", width: '50%' }}>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                            {user.surName} {user.name} {user.patronymic}
                        </div>

                        <div style={{ color: '#666', marginTop: "8px" }}>
                            Дата рождения: {formatDate(user.dateOfBirth)}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', width: '100%' }}>
                            <Button
                                onClick={() => handleOpen(user)}
                                size="middle"
                                style={{
                                    flex: 1,
                                    minWidth: 0
                                }}>
                                Редактировать</Button>
                            <Button
                                onClick={() => handleDelete(user.id)}
                                size="middle"
                                style={{
                                    flex: 1,
                                    minWidth: 0
                                }}
                                danger>
                                Удалить</Button>

                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: "auto",
                    }} >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: "14px",
                            color: "white",
                        }}>
                            <RoleBadge roleId={user.userStatus} />
                        </div>

                    </div>

                </div>
            ))}
        </div>
    );
};