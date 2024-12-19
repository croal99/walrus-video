import {Box, Skeleton} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import AppTheme from '@/theme/AppTheme';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function App() {
    return (
        <AppTheme {...props}>
            <div className="flex flex-col h-screen back-ground font-light">
                <div className="flex flex-row gap-3">


                </div>

                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Item>
                                <Box>
                                    <EmailIcon/>ContacUst@Gmail.com
                                    <LocalPhoneIcon/>8 8888 8888
                                </Box>
                            </Item>
                        </Grid>
                        <Grid size={4}>
                            <Item>size=4</Item>
                        </Grid>
                        <Grid size={4}>
                            <Item>size=4</Item>
                        </Grid>
                        <Grid size={8}>
                            <Item>size=8</Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </AppTheme>
    )
}
