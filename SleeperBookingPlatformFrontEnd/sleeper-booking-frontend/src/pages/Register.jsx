import React, { useState } from 'react'
import heroBackground from "../assets/images/sleeperbus-hero.png";
import { Link } from "react-router";

const Register = () => {

    const [statusType, setStatusType] = useState("")
    const [statusMessage, setStatusMessage] = useState("")

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({})

    const validateErrors = {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: ""
    }

    const onChangeHandler = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }


    const registerUser = async () => {

        setStatusType("")
        setStatusMessage("")

        try {
            const response = await fetch("http://localhost:8080/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            })

            const responseText = response.text()
            let responseData = {}

            try {
                responseData = responseText ? JSON.parse(responseText) : {}
            } catch (error) {
                responseData = { message: responseText }
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    mobile: "",
                    password: "",
                    confirmPassword: ""
                })

            }

            if (!response.ok) {
                setStatusType("error")
                setStatusMessage(responseData.message || "Registered failed. Please try again.")
                return;
            }

            setStatusType("success")
            setStatusMessage(responseData.message || "Registered successfull!")


            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                mobile: "",
                password: "",
                confirmPassword: ""
            })


        } catch (error) {

            console.log(error);

        }
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        //For first name

        if (formData.firstName === "") {
            validateErrors.firstName = "First name is required";
        } else if (formData.firstName.length < 2 || formData.firstName.length > 20) {
            validateErrors.firstName = "First name must be between 2 and 20 characters";
        } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
            validateErrors.firstName = "First name must contain only letters"
        }

        //For last name

        if (formData.lastName === "") {
            validateErrors.lastName = "Last name is required";
        } else if (formData.lastName.length < 2 || formData.lastName.length > 20) {
            validateErrors.lastName = "Last name must be between 2 and 20 characters";
        } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
            validateErrors.lastName = "Last name must contain only letters"
        }

        //For email
        if (formData.email === "") {
            validateErrors.email = "Email is required"
        } else if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
            validateErrors.email = "Please enter a valid Gmail address";
        }

        //for number
        if (formData.mobile === "") {
            validateErrors.mobile = "Mobile number is required"
        } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
            validateErrors.mobile = "Mobile length should be exactly 10";
        }

        //for Password
        if (formData.password === "") {
            validateErrors.password = "Password is required"
        } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(formData.password)) {
            validateErrors.password = "Password must contain at least 8 characters, one uppercase, one lowercase, and one special character";
        }

        if (formData.confirmPassword === "") {
            validateErrors.confirmPassword = "Confirm password is required";
        } else if (formData.password !== formData.confirmPassword) {
            validateErrors.confirmPassword = "Passwords do not match";
        }

        let hasError = Object.values(validateErrors)
            .some(error => error !== "");

        setErrors(validateErrors)

        if (hasError) return;

        registerUser();

    }

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">

            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroBackground})` }}
                aria-hidden="true"
            />

            {/* Dark gradient overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/40"
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">

                <section className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-14">

                    {/* Left hero section */}
                    <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">

                        <div className="mb-6 inline-flex items-center rounded-full border border-cyan-300/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md">
                            Welcome to SleeperBus
                        </div>

                        <h1
                            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Your journey
                            <span className="block text-cyan-300">
                                starts here.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                            Create your account and discover a more comfortable
                            way to travel. Book your sleeper seat and get ready
                            for your next journey.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                                Comfortable journeys
                            </span>

                            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                                Easy booking
                            </span>

                            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                                Secure account
                            </span>
                        </div>
                    </div>

                    {/* Registration card */}
                    <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/15 bg-slate-950/65 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7 lg:p-8">

                        <div className="mb-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                                Get started
                            </p>

                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Create Account
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Enter your details to create your SleeperBus account.
                            </p>
                        </div>

                        <form
                            noValidate
                            onSubmit={onSubmitHandler}
                            className="space-y-4"
                        >

                            {/* First name and last name */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="min-w-0">
                                    <label
                                        htmlFor="firstName"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={onChangeHandler}
                                        autoComplete="given-name"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                                        placeholder="Enter first name"
                                    />

                                    {errors.firstName && (
                                        <p className="mt-1 text-xs leading-5 text-rose-300 break-words">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="lastName"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={onChangeHandler}
                                        autoComplete="family-name"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                                        placeholder="Enter last name"
                                    />

                                    {errors.lastName && (
                                        <p className="mt-1 text-xs leading-5 text-rose-300 break-words">
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email and mobile */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="min-w-0">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={onChangeHandler}
                                        autoComplete="email"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                                        placeholder="you@gmail.com"
                                    />

                                    {errors.email && (
                                        <p className="mt-1 text-xs leading-5 text-rose-300 break-words">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="mobile"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Mobile Number
                                    </label>

                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={onChangeHandler}
                                        autoComplete="tel"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                                        placeholder="10-digit mobile number"
                                    />

                                    {errors.mobile && (
                                        <p className="mt-1 text-xs leading-5 text-rose-300 break-words">
                                            {errors.mobile}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Password and confirm password */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="min-w-0">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={onChangeHandler}
                                        autoComplete="new-password"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                                        placeholder="Create password"
                                    />

                                    {errors.password && (
                                        <p className="mt-1 text-xs leading-5 text-rose-300 break-words">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium text-slate-200"
                                    >
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={onChangeHandler}
                                        autoComplete="new-password"
                                        className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                                        placeholder="Confirm password"
                                    />

                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-xs leading-5 text-rose-300 break-words">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.99]"
                            >
                                Create Account
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

                        {/* Link to login */}
                        <p className="mt-6 text-center text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>

                        <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                            Your journey to comfortable travel starts with SleeperBus.
                        </p>

                    </div>
                </section>
            </div>
        </main>
    )
}

export default Register