export const formatTIme = (time) => {
    return time ? String(time).slice(0, 5) : ""
}

export const formatDate = (data) => {

    const [year, month, day] = String(data).split("-").map(Number)

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

}

export const todayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const todayDate = `${year}-${month}-${day}`

    return todayDate
}