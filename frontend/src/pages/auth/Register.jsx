import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../../components/Loader"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import { useRegisterMutation } from "../../redux/api/usersApiSlice"



const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [register, { isLoading }] = useRegisterMutation()
    const { userInfo } = useSelector(state => state.auth)

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])


    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('passwords do not match')
        }
        else {
            try {
                const res = await register({ username, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
                toast.success("user successfully register")
            }
            catch (error) {
                console.log(error);
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    return (
        <section className="pl-[10rem] flex flex-wrap ">
            <div className="mr-[4rem] mt-[5rem]">
                <h1 className="text-2xl font-semibold mb-4"> Register</h1>
                <form onSubmit={submitHandler} className="container w-[40rem]" >

                    <div className="my-[2rem]">
                        <label htmlFor="name"
                        className="block text-sm font-medium text-black"
                        > Name </label>
                        <input type="text" id="name" className="mt-1 p-2 border rounded w-full" 
                        placeholder="Enter name" value={username} onChange={e => setUsername(e.target.value)} />               
                     </div>

                    <div className="my-[2rem]">
                        <label htmlFor="email"
                        className="block text-sm font-medium text-black"
                        > Email </label>
                        <input type="email" id="email" className="mt-1 p-2 border rounded w-full" 
                        placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />               
                     </div>

                    <div className="my-[2rem]">
                        <label htmlFor="password"
                        className="block text-sm font-medium text-black"
                        > Password </label>
                        <input type="password" id="password" className="mt-1 p-2 border rounded w-full" 
                        placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />               
                     </div>

                    <div className="my-[2rem]">
                        <label htmlFor="confirmpassword"
                        className="block text-sm font-medium text-black"
                        > confirm password </label>
                        <input type="password" id="confirmpassword" className="mt-1 p-2 border rounded w-full" 
                        placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />               
                     </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
                    >
                        {isLoading ? "Registering... " : "Register"}
                    </button> 

                    {isLoading && <Loader/>}
                </form>

                <div className="mt-4">
                    <p className="text-black">
                        Already have an account ? {" "}
                    <Link to = {redirect ? `/login?redirect=${redirect}` : '/login'} className="text-pink-500 hover:underline" >
                    login</Link>
                    </p>
                </div>
            </div>
        </section>
    )
}


export default Register