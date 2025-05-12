import React, { useState, useEffect } from 'react';
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Alert,
    Container,
    Checkbox
} from '@mantine/core';
import { useNavigate } from 'react-router';
import { FaSignInAlt, FaExclamationTriangle } from 'react-icons/fa';
import useAuthStore from '../store/auth.store';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { login, setRememberMe: storeSetRememberMe, rememberMe: storeRememberMe } = useAuthStore();
    const navigate = useNavigate();

    // Initialize rememberMe from store
    useEffect(() => {
        setRememberMe(storeRememberMe);
    }, [storeRememberMe]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Update rememberMe in store before login
            storeSetRememberMe(rememberMe);
            await login(email, password);
            navigate('/admin/create-hotspot');
        } catch (err) {
            setError(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn.');
        } finally {
            setLoading(false);
        }
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.currentTarget.checked);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Container size="xs" className="py-16">
                <Paper radius="md" p="xl" withBorder className="shadow-lg">
                    <Title order={2} className="text-center mb-6 text-blue-400">Đăng Nhập</Title>

                    {error && (
                        <Alert
                            icon={<FaExclamationTriangle />}
                            title="Lỗi Xác Thực"
                            color="red"
                            className="mb-4"
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label="Email"
                            placeholder="Email của bạn"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-3"
                        />

                        <PasswordInput
                            label="Mật khẩu"
                            placeholder="Mật khẩu của bạn"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-3"
                        />

                        <Checkbox
                            label="Ghi nhớ đăng nhập"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                            className="mb-5"
                        />

                        <Button
                            fullWidth
                            type="submit"
                            loading={loading}
                            leftSection={<FaSignInAlt />}
                            className="bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Đăng Nhập
                        </Button>
                    </form>

                </Paper>
            </Container>
        </div>
    );
};

export default LoginPage;