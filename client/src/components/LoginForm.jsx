import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/user-api'
import { Login } from '../redux/slices/userSlice';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        try {
            const res = await login(values.email, values.password); //login api
            if (res.EC === 0) {
                localStorage.setItem('access_token', res.DT.access_token);
                dispatch(Login(res.DT)); //Login slice 
                navigate('/');
            } else {
                alert(res.EM);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='d-flex justify-content-center pt-4'>
            <Form
                className='w-50 border pe-5 pt-5'
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={handleLogin}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" label={null}>
                    <Checkbox>Ghi nhớ</Checkbox>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginForm