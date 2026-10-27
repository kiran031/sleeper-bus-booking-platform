import React, { useState } from 'react'

const Doubt = () => {
    const [user, setUser] = useState({
        "name": "",
        "password": ""
    })

    const handleInput = () => {
        setUser(prev=>({...prev,name:"kiran"}))
        setUser(prev=>({...prev, password:"password"}))
    }

    console.log(user);



    return (
        <div>
            <button onClick={handleInput}>Click</button>
        </div>
    )
}

export default Doubt