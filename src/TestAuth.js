import React, { useState } from 'react'
import { base, auth } from './base'

export default function TestAuth() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const onSubmit = async () => {
        const res = await auth.createUserWithEmailAndPassword(email, password);
    }

    return (
        <div style={{ border: '2px blue solid', display: 'flex', flexDirection: 'column' }}>
            <input onChange={handleEmail} style={{ height: '48px', fontSize: '22px', maxWidth: '400px' }} />
            <input onChange={handlePassword} style={{ height: '48px', fontSize: '22px', maxWidth: '400px' }} />
            <button onClick={onSubmit} style={{ width: '56', height: '32px' }}>Submit</button>
        </div>
    )
}
