import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true); 
    const [error, setError] = useState("");
    const onChange = (event) => {
        const { target: {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }
        else if(name === "password"){
            setPassword(value);
        }
    };
    const onSubmit = async(event) => {                                              //Submit(Login or Create)
        event.preventDefault();
        try{
            let data;
            if(newAccount){
                await authService.createUserWithEmailAndPassword(email, password);
            }else{
                await authService.signInWithEmailAndPassword(email, password);
            }
        }
        catch(error){
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (                                                                        //Login Form
        <>
            <form onSubmit={onSubmit} className="container">
                <input                                                              //Email
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                    className="authInput"
                />
                <input                                                              //Password
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    className="authInput"
                    onChange={onChange}
                />
                <input                                                              //Login Or Create Button
                    type="submit"
                    className="authInput authSubmit"
                    value={newAccount ? "Create Account" : "Sign In"} />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign In": "Create Account"}
            </span>
        </>
    );
}
export default AuthForm;