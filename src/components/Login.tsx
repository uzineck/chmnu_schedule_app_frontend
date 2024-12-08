import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../api/client/auth';
import './Login.css';

interface LoginProps {
    onClose: () => void;
}

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний формат email')
        .required('Email обов\'язковий'),
    password: Yup.string()
        .required('Пароль обов\'язковий'),
});

const Login = ({ onClose }: LoginProps) => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const response = await login({
                    email: values.email,
                    password: values.password
                });
                console.log(response);
                if (response.data?.access_token) {
                    localStorage.setItem('accessToken', response.data.access_token);
                    
                    console.log('Успішний вхід:', response);
                    onClose();
                } else {
                    setStatus('Помилка: токени не отримано');
                }
            } catch (error) {
                console.error('Помилка входу:', error);
                setStatus('Невірний email або пароль');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="login-container">
            <h2>Вхід</h2>
            <form onSubmit={formik.handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="error-message">{formik.errors.email}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="error-message">{formik.errors.password}</div>
                    )}
                </div>

                {formik.status && (
                    <div className="error-message">{formik.status}</div>
                )}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Вхід...' : 'Увійти'}
                </button>
            </form>
        </div>
    );
};

export default Login;