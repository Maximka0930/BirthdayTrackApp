import { UserAllInfoRequest } from "../Contracts/UserAllInfoRequest";


export const getUsersAllInfo= async () => {
    const response = await fetch("http://localhost:5115/UsersAllInfo");
    const data = await response.json();
    return data;
};

export const createNewUser = async (userRequest: UserAllInfoRequest) => {
    // Преобразуем дату из "DD-MM-YYYY" в "YYYY-MM-DD"
    const transformDate = (dateStr: string): string => {
        if (!dateStr) return "";

        const [day, month, year] = dateStr.split('-');
        if (!day || !month || !year) {
            throw new Error("Неверный формат даты. Используйте ДД-ММ-ГГГГ");
        }

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Подготавливаем тело запроса
    const requestBody = {
        ...userRequest,
        DateOfBirth: transformDate(userRequest.DateOfBirth)
    };

    console.log("Отправляемые данные:", requestBody); // Для отладки

    const response = await fetch("http://localhost:5115/UsersAllInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.title || "Ошибка сервера");
    }

    return await response.json();
};

export const updateUser = async (id: string, userRequest: UserAllInfoRequest) => {
    await fetch(`http://localhost:5115/UsersAllInfo/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(userRequest),
    });
};

export const deleteUser = async (id: string) => {
    await fetch(`http://localhost:5115/UsersAllInfo/${id}`, {
        method: "DELETE",
    });
};
