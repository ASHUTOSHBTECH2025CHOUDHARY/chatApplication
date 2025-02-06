import React, { useState } from 'react';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { CameraAlt, CameraAlt as CameraIcon } from "@mui/icons-material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useFileHandler} from "6pp"
import { Visuallyhidden } from '../components/styles/StyleComponents';
import { gradiant } from '../constants/Color';
import axios from 'axios';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/Auth';
import toast from 'react-hot-toast';
const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const avtar=useFileHandler("single")
    const toggle = () => {
        setIsLogin(!isLogin);
    };
    const dispatch=useDispatch()
    const loginValidationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const registerValidationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        username: Yup.string().required('Username is required'),
        bio: Yup.string().max(150, 'Bio should not exceed 150 characters'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const handellogin=async(e)=>{
        e.preventDefault(); 
        const confi={
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        }
        try {
            const res=await axios.post(`${server}/user/login`,{username:formik.values.username,password:formik.values.password},confi)  
            dispatch(userExists(true))
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message||"Something went wrong")
        }
    }
    const handelsignup=async(e)=>{
        e.preventDefault(); 

        const confi={
            withCredentials:true,
            headers:{
                "Content-Type":"multipart/form-data"
               }
        }
        
        const fromdata=new FormData();
        fromdata.append("avatar",avtar.file);
        fromdata.append("name",formik.values.name);
        fromdata.append("bio",formik.values.bio);
        fromdata.append("username",formik.values.username);
        fromdata.append("password",formik.values.password);

        try {
            const {data} =await axios.post(`${server}/user/newuser`,fromdata,confi);
            dispatch(userExists(true));
            toast.success(data.message)

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message||"Something went wrong")
        }
    }
    const formik = useFormik({
        initialValues: {
            name: '',
            bio: '',
            username: '',
            password: ''
        },
        validationSchema: isLogin ? loginValidationSchema : registerValidationSchema,
        onSubmit: (values) => {
            console.log('Form values', values);
        },
    });

    return (
        <div style={{
            backgroundImage:gradiant
        }}>
            <Container component="main" maxWidth="xs" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {isLogin ? (
                    <>
                        <Typography variant="h5">Login</Typography>
                        <form onSubmit={handellogin} style={{ width: "100%", marginTop: "1rem" }}>
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                margin="normal"
                                variant="outlined"
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                margin="normal"
                                variant="outlined"
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <Button sx={{ marginTop: "1rem" }} variant="contained" color="primary" type="submit" fullWidth>Login</Button>
                        </form>
                        <Typography textAlign="center" m="1rem">Or</Typography>
                        <Button
                            sx={{ marginTop: "1rem" }}
                            variant="text"
                            onClick={toggle}
                            fullWidth
                        >
                            Register Instead
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h5">Register</Typography>
                        <form onSubmit={handelsignup} style={{ width: "100%", marginTop: "1rem" }}>
                            <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                <Avatar
                                sx={{
                                    width:"10rem",
                                    height:"10rem",
                                    objectFit:"contain"
                                }}
                                src={avtar.preview}
                                />
                                <IconButton sx={{
                                    position:"absolute",
                                    right:0,
                                    bottom:0
                                }}
                                component="label">
                                    <>
                                        <CameraIcon/>
                                        <Visuallyhidden type='file' onChange={avtar.changeHandler}/>
                                    </>
                                </IconButton>
                            </Stack>
                            <TextField
                                required
                                fullWidth
                                label="Name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                margin="normal"
                                variant="outlined"
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                margin="normal"
                                variant="outlined"
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            />
                            <TextField
                                fullWidth
                                label="Bio"
                                name="bio"
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                margin="normal"
                                variant="outlined"
                                error={formik.touched.bio && Boolean(formik.errors.bio)}
                                helperText={formik.touched.bio && formik.errors.bio}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                margin="normal"
                                variant="outlined"
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <Button sx={{ marginTop: "1rem" }} variant="contained" color="primary" type="submit" fullWidth>Sign Up</Button>
                        </form>
                        <Typography textAlign="center" m="1rem">Or</Typography>
                        <Button
                            sx={{ marginTop: "1rem" }}
                            variant="text"
                            onClick={toggle}
                            fullWidth
                        >
                            Login Instead
                        </Button>
                    </>
                )}
            </Paper>
        </Container>
        </div>
    );
};

export default Login;
