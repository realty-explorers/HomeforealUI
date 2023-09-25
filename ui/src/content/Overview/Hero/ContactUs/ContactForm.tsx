import TextField from '@mui/material/TextField';
import ThemedButtonLg from "@/components/Buttons/ThemedButtonLg";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from 'react'
import MessageSentComponent from './MessageSentComponent';

const useStyles = makeStyles(() => ({
    label: {

        '& label.Mui-focused': {

            fontSize: '0.9rem',
            fontWeight: 'bold',
            color: '#35455d ',
        },
        '& .MuiOutlinedInput-root:hover': {
            '& fieldset': {
                borderColor: '#C6BEBA',
            }
        },
        '& .MuiOutlinedInput-root.Mui-focused ': {
            '& fieldset': {
                borderColor: '#C6BEBA',

            }

        }
    }
}));

export default function ContactForm() {
    const classes = useStyles();

    const [isClient, setIsClient] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (event: { target: { name: string; value: string; }; }) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const emailValidator = () => {
        const { email } = formData;
        let isEmailValid: boolean;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        isEmailValid = emailRegex.test(email)
        return isEmailValid
    }

    const nameValidator = () => {
        const { name } = formData
        let isNameNotValid: boolean

        if (!name.length) {
            isNameNotValid = true;
            return isNameNotValid;
        }
        if (name.length) {
            isNameNotValid = false
            return isNameNotValid;
        }
    }

    const handleSubmit = () => {
        setSubmitted(true);

        if (nameValidator() === false && emailValidator() === true) {
            console.log(formData)
            setSent(true)
        }
    }

    useEffect(() => {
        setIsClient(true)
    }, [])


    return (
        <>
            {isClient &&
                <div className='h-full w-full min-h[full]  m-12 bg-white rounded'>
                    <div className='flex flex-col m-10'>
                        {
                            !sent ?
                                <>
                                    <div className='h-[80%]'>
                                        <TextField
                                            error={submitted && nameValidator()}
                                            helperText={submitted && nameValidator() ? 'Please enter Name' : ''}
                                            className={`${classes.label} m-2 `}
                                            size="medium"
                                            fullWidth
                                            required
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            error={submitted && !emailValidator()}
                                            helperText={submitted && !emailValidator() ? 'Please enter Email' : ''}
                                            className={`${classes.label} m-2`}
                                            size="medium"
                                            fullWidth
                                            required
                                            label="Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            className={`${classes.label} m-2`}
                                            size="medium"
                                            fullWidth
                                            name="message"
                                            label="Enter your message"
                                            multiline
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div
                                        className='flex justify-center h-[20%] mt-2'>
                                        <span onClick={handleSubmit}>
                                            <ThemedButtonLg text='Submit' />
                                        </span>
                                    </div>
                                </>
                                : <MessageSentComponent />}
                    </div>
                </div>
            }
        </>
    )
}
