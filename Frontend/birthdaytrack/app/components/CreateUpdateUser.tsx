import Modal from "antd/es/modal/Modal";
import { ConfigProvider, DatePicker, DatePickerProps, Input, message, Select, Upload } from "antd";
import { SetStateAction, useEffect, useState } from "react";
import { UserAllInfoRequest } from "../Contracts/UserAllInfoRequest";
import { RcFile } from "antd/es/upload";
import { Dayjs } from "dayjs";
import 'dayjs/locale/ru'; // Подключаем русскую локаль для dayjs
import ru_RU from 'antd/locale/ru_RU'; // Русская локаль для Ant Design


const App = () => {
    return (
        <ConfigProvider locale={ru_RU}>
            <DatePicker />
        </ConfigProvider>
    );
};

export default App;


export enum Mode {
    Create,
    Edit,
    Watch,
}

interface Props {
    mode: Mode;
    value: UserAllInfo;
    isModalOpen: boolean;
    handleCancel: () => void;
    handleCreate: (request: UserAllInfoRequest, imageFile?: File) => void;
    handleUpdate: (id: string, request: UserAllInfoRequest, imageFile?: File) => void;
}

export const CreateUpdateUser = ({
    mode,
    value,
    isModalOpen,
    handleCancel,
    handleCreate,
    handleUpdate
}: Props) => {
    const [formData, setFormData] = useState<UserAllInfo>({
        id: '',
        name: '',
        surName: '',
        patronymic: '',
        dateOfBirth: '',
        userStatus: 0,
        wishes: '',
        hobbies: '',
        dataImage: ''
    });
    const [imageFile, setImageFile] = useState<RcFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthday, setBirthday] = useState(null);

    useEffect(() => {
        setFormData({
            id: value.id || '',
            name: value.name || '',
            surName: value.surName || '',
            patronymic: value.patronymic || '',
            dateOfBirth: value.dateOfBirth || '',
            userStatus: value.userStatus || 0,
            wishes: value.wishes || '',
            hobbies: value.hobbies || '',
            dataImage: value.dataImage || '',
        });

        if (value.dataImage) {
            // Проверяем, есть ли уже префикс data:image
            setPreviewImage(
                value.dataImage.startsWith('data:image')
                    ? value.dataImage
                    : `data:image/jpeg;base64,${value.dataImage}`
            );
        } else {
            setPreviewImage(null);
        }
        setImageFile(null);
    }, [value]);


    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Вы можете загрузить только изображение (JPEG, PNG, etc.)!');
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Изображение должно быть меньше 5MB!');
            return false;
        }

        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Поддерживаются только JPG/PNG форматы!');
            return false;
        }

        setImageFile(file);
        previewFile(file);
        return false;
    };
    // Предпросмотр изображения
    const previewFile = (file: RcFile) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Конвертация изображения в base64 (для хранения в БД)
    const convertImageToBase64 = (file: RcFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };


    const handleInputChange = (field: keyof UserAllInfo) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
        };

    const handleStatusChange = (value: number) => {
        setFormData(prev => ({
            ...prev, UserStatus: value,
            userStatus: value ?? 0
        }));
    };

    const handleOnOk = async () => {
        let base64Image = formData.dataImage;

        // Если есть новое изображение, конвертируем его
        if (imageFile) {
            try {
                base64Image = await convertImageToBase64(imageFile);
                // Удаляем префикс data:image/...;base64, для чистого base64
                base64Image = base64Image.split(',')[1];
            } catch (error) {
                console.error("Ошибка конвертации изображения:", error);
                message.error('Ошибка обработки изображения');
                return;
            }
        }

        const request: UserAllInfoRequest = {
            Id: formData.id,
            Name: formData.name,
            SurName: formData.surName,
            Patronymic: formData.patronymic,
            DateOfBirth: formData.dateOfBirth,
            UserStatus: formData.userStatus,
            Wishes: formData.wishes,
            Hobbies: formData.hobbies,
            DataImage: base64Image, // Используем конвертированное изображение
        };

        try {
            if (mode === Mode.Create) {
                await handleCreate(request, imageFile || undefined);
            } else {
                await handleUpdate(value.id, request, imageFile || undefined);
            }
            handleCancel();
        } catch (error) {
            console.error("Ошибка сохранения:", error);
            message.error('Ошибка при сохранении данных');
        }
    };

    const handleModalCancel = () => {
        setPreviewImage(null);
        setImageFile(null);
        handleCancel();
    };

    const handleDatePickerChange = (date: Dayjs | null) => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                dateOfBirth: date.format('DD-MM-YYYY')
            }));
            setShowDatePicker(false);
        }
    };

    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Автоматическое добавление разделителей
        let formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length > 1) {
            formattedValue = formattedValue.slice(0, 2) + '-' + formattedValue.slice(2);
        }
        if (formattedValue.length > 4) {
            formattedValue = formattedValue.slice(0, 5) + '-' + formattedValue.slice(5, 9);
        }

        setFormData(prev => ({
            ...prev,
            dateOfBirth: formattedValue
        }));
    };

    const convertDateFormatStrict = (dateString: string): string => {
        const parts = dateString.split('-');
        if (parts.length !== 3) return '';

        const [year, month, day] = parts;
        if (year.length !== 4 || month.length !== 2 || day.length !== 2) return '';

        return `${day}-${month}-${year}`;
    };


    const formatDateToDisplay = (dbDate: string): string => {
        if (!dbDate) return "";

        // Просто меняем местами части даты (ГГГГ-ММ-ДД → ДД-ММ-ГГГГ)
        const parts = dbDate.split('-');
        if (parts.length !== 3) return dbDate; // Если формат не совпадает, возвращаем как есть

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    return (
        <Modal
            title={mode === Mode.Create ? "Добавить пользователя" : "Редактировать пользователя"}
            open={isModalOpen}
            cancelText="Отмена"
            onOk={handleOnOk}
            onCancel={handleModalCancel}  // Используем новый обработчик

            width={600}
        >
            <div className="user_modal">
                <div>
                    <div className="circle">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            accept="image/*"
                        >
                            {previewImage ? (
                                <img src={previewImage} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                <div>
                                    <div>Загрузить</div>
                                </div>
                            )}
                        </Upload>
                    </div>
                    {imageFile && (
                        <div className="form-row">
                            <span>Выбран файл: {imageFile.name}</span>
                        </div>
                    )}
                </div>

                <div>
                    <div className="form-row">
                        <Input
                            value={formData.surName}
                            onChange={handleInputChange('surName')}
                            placeholder="Фамилия"
                        />
                    </div>
                    <div className="form-row">
                        <Input
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            placeholder="Имя"
                        />
                    </div>
                    <div className="form-row">
                        <Input
                            value={formData.patronymic}
                            onChange={handleInputChange('patronymic')}
                            placeholder="Отчество"
                        />
                    </div>
                    <div className="form-row" style={{ position: 'relative' }}>
                        <Input
                            value={formData.dateOfBirth} // Просто конвертируем формат
                            onChange={handleDateInputChange}
                            placeholder="День рождения (ДД-ММ-ГГГГ)"
                            maxLength={10} // ДД-ММ-ГГГГ = 10 символов
                        />
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            style={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            📅
                        </button>

                        {showDatePicker && (
                            <div style={{
                                position: 'absolute',
                                zIndex: 1000,
                                top: '100%',
                                left: 0,
                                marginTop: 8,
                                boxShadow: '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)'
                            }}>
                                <DatePicker
                                    open={showDatePicker}
                                    onChange={handleDatePickerChange}
                                    onOpenChange={(open) => setShowDatePicker(open)}
                                    format="DD-MM-YYYY"
                                    inputReadOnly
                                />
                            </div>
                        )}
                    </div>
                    <div className="form-row">
                        <Select<number>
                            value={undefined}
                            onChange={handleStatusChange}
                            style={{ width: '100%' }}
                            placeholder="Выберите статус"
                            options={[
                                { value: 0, label: 'Семья' },
                                { value: 1, label: 'Коллеги' },
                                { value: 2, label: 'Друзья' },
                            ]}
                            allowClear
                        />
                    </div>
                </div>

                <div>
                    <div className="form-row">
                        <Input
                            value={formData.wishes}
                            onChange={handleInputChange('wishes')}
                            placeholder="Пожелания"
                        />
                    </div>
                    <div className="form-row">
                        <Input
                            value={formData.hobbies}
                            onChange={handleInputChange('hobbies')}
                            placeholder="Хобби"
                        />
                    </div>
                </div>


            </div>

            <style jsx>{`
    .circle {
    width: 100px;          
    height: 100px;         
    border-radius: 50%;    
    display: flex;
    align-items: center;   
    justify-content: center; 
    overflow: hidden;      
    background: #f0f0f0;   
    border: 2px solid #ccc; 
  }

  .user_modal {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
  .form-row {
    display: flex;
    flex-direction: column;
    margin: 6px;
  }
`}</style>
        </Modal>
    );
};

