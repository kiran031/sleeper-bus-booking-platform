import React, { useState } from 'react';
import { Link } from 'react-router';
import heroBackground from '../assets/images/sleeperbus-hero.png';

const Login = () => {

    const [statusType, setStatusType] = useState("")
    const [statusMessage, setStatusMessage] = useState("")

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const onChangeHandler = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const login = async () => {

        setStatusType("")
        setStatusMessage("")

        try {
            const response = await fetch(
                "http://localhost:8080/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData),
                    credentials: "include"
                }
            );


            const responseText = await response.text()
            let responseData = {}

            try {
                responseData = responseText ? JSON.parse(responseText) : {}
            } catch (error) {
                responseData = { message: responseText };
            }

            if (!response.ok) {
                setStatusType("error");
                setStatusMessage(
                    responseData.message || "Login failed. Please try again."
                );
                setFormData({
                    email: "",
                    password: ""
                });
                return;
            }

            setStatusType("success")
            setStatusMessage(responseData.message || "Login successfull!")


            setFormData({
                email: "",
                password: ""
            });

            console.log(responseData);

        } catch (error) {
            setStatusType("error");
            setStatusMessage(
                "Unable to connect to the server. Please try again."
            );
        }
    };

    const submitHandler = (e) => {

        e.preventDefault();

        const validateErrors = {
            email: "",
            password: ""
        };

        if (formData.email === "") {
            validateErrors.email = "Email is required";
        } else if (
            !/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email)
        ) {
            validateErrors.email = "Please enter a valid Gmail address";
        }

        if (formData.password === "") {
            validateErrors.password = "Password is required";
        }

        const hasError = Object.values(validateErrors)
            .some(error => error !== "");

        setErrors(validateErrors);

        if (hasError) return;

        login();
    };



    return (
        <main
            className="relative min-h-screen w-full overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${heroBackground})`
            }}
        >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/40" />

            <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 items-center gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 lg:px-10 lg:py-4">

                {/* Left branding section */}
                <section className="flex flex-col justify-between gap-7 py-2 sm:py-3 lg:min-h-[600px] lg:py-2">

                    {/* Logo */}
                    <Link to="/" className="flex w-fit items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 shadow-lg shadow-indigo-950/40">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-6 w-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="4" y="3" width="16" height="16" rx="3" />
                                <path d="M4 10h16M8 6h8M7 19v2M17 19v2" />
                                <circle cx="8" cy="15" r="1" />
                                <circle cx="16" cy="15" r="1" />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                                Sleeper<span className="text-indigo-400">Bus</span>
                            </h1>
                            <p className="mt-0.5 text-[9px] font-semibold tracking-[0.25em] text-slate-300">
                                TRAVEL BETTER
                            </p>
                        </div>
                    </Link>

                    {/* Hero message */}
                    <div className="max-w-xl">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-8 bg-indigo-400" />

                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-200 sm:text-xs">
                                Comfortable · Safe · Affordable
                            </p>
                        </div>

                        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">
                            Welcome Back
                            <br />
                            to{" "}
                            <span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                SleeperBus
                            </span>
                        </h2>

                        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200 sm:text-base">
                            Continue your journey with comfort and ease.
                            Login to manage your bookings, explore new routes,
                            and enjoy a smoother travel experience.
                        </p>
                    </div>

                    {/* Brand benefits */}
                    <div className="grid max-w-lg grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { symbol: "↗", title: "Wide Bus", subtitle: "Network" },
                            { symbol: "✓", title: "Safe &", subtitle: "Reliable" },
                            { symbol: "◇", title: "Easy", subtitle: "Bookings" }
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="flex items-center gap-2"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-base font-bold text-indigo-200 backdrop-blur-md sm:h-10 sm:w-10">
                                    {item.symbol}
                                </div>

                                <div>
                                    <p className="text-[11px] font-semibold text-white sm:text-xs">
                                        {item.title}
                                    </p>
                                    <p className="text-[10px] text-slate-300 sm:text-xs">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Login card */}
                <section className="w-full max-w-xl rounded-3xl border border-white/15 bg-slate-950/65 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7 lg:p-8">

                    <div className="mb-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                            Your journey continues
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Welcome Back
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Login to access your account and manage your journeys.
                        </p>
                    </div>

                    <form
                        className="flex flex-col gap-4"
                        noValidate
                        onSubmit={submitHandler}
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-200"
                            >
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                autoComplete="email"
                                placeholder="Enter your email"
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                onChange={onChangeHandler}
                                className={`mt-2 h-11 w-full rounded-xl border bg-white/10 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-300/20 ${errors.email
                                        ? "border-rose-400 focus:border-rose-400"
                                        : "border-white/15 focus:border-cyan-300"
                                    }`}
                            />

                            {errors.email && (
                                <p
                                    id="email-error"
                                    className="mt-1 text-xs leading-5 text-rose-300"
                                >
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-200"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                onChange={onChangeHandler}
                                className={`mt-2 h-11 w-full rounded-xl border bg-white/10 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-300/20 ${errors.password
                                        ? "border-rose-400 focus:border-rose-400"
                                        : "border-white/15 focus:border-cyan-300"
                                    }`}
                            />

                            {errors.password && (
                                <p
                                    id="password-error"
                                    className="mt-1 text-xs leading-5 text-rose-300"
                                >
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Forgot password */}
                        <div className="-mt-1 flex justify-end">
                            <Link
                                to="/login"
                                className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.99]"
                        >
                            Login to your account
                            <span aria-hidden="true">→</span>
                        </button>

                        {/* API success and error messages */}
                        {statusMessage && (
                            <p
                                role={statusType === "error" ? "alert" : "status"}
                                className={`w-full break-words text-center text-sm ${statusType === "error"
                                        ? "text-rose-300"
                                        : "text-green-400"
                                    }`}
                            >
                                {statusMessage}
                            </p>
                        )}

                    </form>

                    {/* Register link */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/15" />

                        <span className="whitespace-nowrap text-[10px] font-medium tracking-wide text-slate-400">
                            NEW TO SLEEPERBUS?
                        </span>

                        <div className="h-px flex-1 bg-white/15" />
                    </div>

                    <Link
                        to="/register"
                        className="flex h-12 w-full items-center justify-center rounded-xl border border-cyan-300/40 bg-white/5 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-white/10"
                    >
                        Create an account
                    </Link>

                    <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                        Your next journey is just a login away.
                    </p>

                </section>
            </div>
        </main>
    );
};

export default Login;