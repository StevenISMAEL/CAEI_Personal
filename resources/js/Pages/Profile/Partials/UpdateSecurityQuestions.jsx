import React, { useState, useEffect } from "react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import FloatInputText from "@/Components/FloatInputText";
import axios from "axios";

export default function UpdateSecurityQuestions({ className = "" }) {
    const { securityQuestions, auth } = usePage().props;
    const [userQuestions, setUserQuestions] = useState([]);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            security_question_id: "",
            answer: "",
        });

    useEffect(() => {
        axios.get(route("security-question-entries.index")).then((response) => {
            setUserQuestions(response.data.entries);
        });
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("security-question-entries.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("security_question_id", "");
                setData("answer", "");
                axios
                    .get(route("security-question-entries.index"))
                    .then((response) => {
                        setUserQuestions(response.data.entries);
                    });
            },
        });
    };

    const deleteQuestion = (entryId) => {
        if (
            confirm(
                "¿Estás seguro de que quieres eliminar esta pregunta de seguridad?",
            )
        ) {
            axios
                .delete(route("security-question-entries.destroy", entryId))
                .then(() => {
                    setUserQuestions(
                        userQuestions.filter((q) => q.id !== entryId),
                    );
                });
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Preguntas de Seguridad
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Configure sus preguntas de seguridad para mayor protección.
                </p>
            </header>

            <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                    Preguntas actuales:
                </h3>
                <ul className="mt-2 space-y-2">
                    {userQuestions.map((entry) => (
                        <li
                            key={entry.id}
                            className="flex justify-between items-center"
                        >
                            <span>{entry.question.name}</span>
                            <button
                                onClick={() => deleteQuestion(entry.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label
                        htmlFor="security_question_id"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Pregunta de Seguridad
                    </label>
                    <select
                        id="security_question_id"
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={data.security_question_id}
                        onChange={(e) =>
                            setData("security_question_id", e.target.value)
                        }
                        required
                    >
                        <option value="">Seleccione una pregunta</option>
                        {securityQuestions.map((question) => (
                            <option key={question.id} value={question.id}>
                                {question.name}
                            </option>
                        ))}
                    </select>
                    <InputError
                        message={errors.security_question_id}
                        className="mt-2"
                    />
                </div>

                <div>
                    <FloatInputText
                        label="Respuesta"
                        id="answer"
                        className="mt-1 block w-full"
                        value={data.answer}
                        onChange={(e) => setData("answer", e.target.value)}
                        required
                    />
                    <InputError message={errors.answer} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        Agregar Pregunta
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
