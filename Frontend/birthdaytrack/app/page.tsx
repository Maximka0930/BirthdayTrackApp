"use client";

import Button from "antd/es/button/button"
import { useEffect, useState } from "react";
import { UsersCard } from "./components/UsersCard";
import Title from "antd/es/skeleton/Title";
import { CreateUpdateUser, Mode } from "./components/CreateUpdateUser";
import { UserAllInfoRequest } from "./Contracts/UserAllInfoRequest";
import { createNewUser, deleteUser, getUsersAllInfo, updateUser } from "./services/UserAllInfo";
import Skeleton from "antd/es/skeleton/Skeleton";
import { Radio } from 'antd';

export default function UsersPage() {
    const defaultValues = {
        name: "",
        surName: "",
        patronymic: "",
        dateOfBirth: "",
        userStatus: -1,
        wishes: "",
        hobbies: "",
        dataImage: "",
    } as UserAllInfo;

    const [values, setValues] = useState<UserAllInfo>(defaultValues)
    const [users, setUsers] = useState<UserAllInfo[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserAllInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Mode.Create);
    const [roleFilter, setRoleFilter] = useState<number | null>(null); // null - все роли

    useEffect(() => {
        const getUsers = async () => {
            const users = await getUsersAllInfo();
            setLoading(false);
            setUsers(users);
            setFilteredUsers(users); // Инициализируем отфильтрованный список
        };

        getUsers();
    }, [])

    useEffect(() => {
        // Фильтрация пользователей при изменении фильтра
        if (roleFilter === null) {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(user => user.userStatus === roleFilter));
        }
    }, [roleFilter, users]);

    const handeleCreateUser = async (request: UserAllInfoRequest) => {
        try {
            await createNewUser(request);
            closeModal();
            const users = await getUsersAllInfo();
            setUsers(users);
        } catch (error) {
            console.error("Ошибка при создании:", error);
        }
    }

    const handleUpdateUser = async (id: string, request: UserAllInfoRequest) => {
        await updateUser(id, request);
        closeModal();
        const users = await getUsersAllInfo()
        setUsers(users)
    }

    const handleDeleteUser = async (id: string) => {
        await deleteUser(id);
        closeModal();
        const users = await getUsersAllInfo()
        setUsers(users)
    }

    const openModal = () => {
        setMode(Mode.Create);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setValues(defaultValues);
        setIsModalOpen(false);
    }

    const openEditModal = (user: UserAllInfo) => {
        setMode(Mode.Edit);
        setValues(user);
        setIsModalOpen(true);
    };

    const openModalWatch = (user: UserAllInfo) => {
        setMode(Mode.Watch);
        setValues(user);
        setIsModalOpen(true);
    }

    const handleRoleFilterChange = (e: any) => {
        setRoleFilter(e.target.value);
    };

    const handleOpenAdditionalInfo = (user: UserAllInfo) => {

    };

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 4,
                marginLeft: 16,
                marginRight: 16,
                gap: '8px'
            }}>
                <Button
                    style={{
                        width: '200px', // Фиксированная ширина
                        marginTop: "12px",
                        marginBottom: "8px",
                        whiteSpace: 'nowrap'
                    }}
                    size="middle"
                    onClick={openModal}>
                    Добавить друга
                </Button>

                <Radio.Group
                    onChange={handleRoleFilterChange}
                    value={roleFilter}
                    style={{
                        display: 'flex',
                        flex: 1,
                        marginTop: "12px",
                        marginBottom: "8px",
                    }}
                >
                    {['Все', 'Семья', 'Коллеги', 'Друзья'].map((label, index) => (
                        <Radio.Button
                            key={index}
                            value={index === 0 ? null : index - 1}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                minWidth: '80px' // Минимальная ширина кнопки
                            }}
                        >
                            {label}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>

            <CreateUpdateUser
                mode={mode}
                value={values}
                isModalOpen={isModalOpen}
                handleCreate={handeleCreateUser}
                handleUpdate={handleUpdateUser}
                handleCancel={closeModal} />

            {loading ? (
                <Skeleton active title={{ width: '100%' }} paragraph={{ rows: 0 }} />
            ) : (
                <UsersCard
                    users={filteredUsers}
                    handleOpen={openEditModal}
                    handleDelete={handleDeleteUser}
                />
            )}
        </div>
    )
}