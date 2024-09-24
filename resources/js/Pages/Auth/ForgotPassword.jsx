import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, useForm, Link } from "@inertiajs/react";
import FloatInputText from "@/Components/FloatInputText";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Has olvidado tu contraseña" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                ¿Olvidaste tu contraseña? Ningún problema. Simplemente háganos
                saber su dirección de correo electrónico y le enviaremos un
                enlace para restablecer su contraseña que le permitirá elegir
                una nueva.
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-gray-600 dark:text-gray-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <FloatInputText
                    label="Email"
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("login")}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                    >
                        Regresar
                    </Link>
                    <Link
                        href={route("password.security-questions")}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 ms-4"
                    >
                        Preguntas Seg.
                    </Link>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? (
                            <LoadingSpinner text="Cargando..." />
                        ) : (
                            "Restablecer contraseña"
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
