import React, { useState } from "react";
import axios from "axios";

const Entity = () => {
    const [fields, setFields] = useState([{ type: "", content: "" }]);
    const [response, setResponse] = useState(null);

    const handleChange = (index, key, value) => {
        const newFields = [...fields];
        newFields[index][key] = value;
        setFields(newFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestData = fields.map(field => ({
            type: field.type.trim(),
            content: field.content.trim()
        }));

        try {
            await axios.post("http://localhost:3307/test", requestData);
            const res = await axios.get("http://localhost:3307/test", requestData);
            const res1 = 
            setResponse(res.data);
            alert("Данные успешно отправлены!");
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    };

    return (
        <div>
            <h2>Динамическая форма</h2>
            <form onSubmit={handleSubmit}>
                {fields.map((field, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <input
                            type="text"
                            placeholder="Название поля"
                            value={field.type}
                            onChange={(e) => handleChange(index, "type", e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Значение"
                            value={field.content}
                            onChange={(e) => handleChange(index, "content", e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit"> Отправить</button>
            </form>
            {response && (
                <div>
                    <h3>Ответ сервера:</h3>
                    <pre>{toString(response)}</pre>
                </div>
            )}
        </div>
    );
};

export default Entity;