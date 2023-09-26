import React from 'react'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function MessageSentComponent() {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef<number>();


    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const loadingAnimation = () => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = window.setTimeout(() => {
                setSuccess(true);
                setLoading(false);
            }, 2000);
        }
    };

    React.useEffect(() => {
        loadingAnimation()
    }, [])

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center', height: 350 }}>

                {success &&
                    <div className='flex flex-col justify-center h-full'>
                        <Typography className='text-center mb-4 ' variant="h3">
                            We received your message!
                        </Typography>
                        <Typography className='text-center' variant="body1" >We appreciate you contacting us.</Typography>
                        <Typography className='text-center' variant="body1" gutterBottom>One of our colleagues will get back in touch with you soon!</Typography>

                    </div>
                }
                {loading && (
                    <CircularProgress
                        size={50}
                        sx={{
                            color: '#1e1125',
                        }}
                    />
                )}
            </Box>
        </>
    )
}
