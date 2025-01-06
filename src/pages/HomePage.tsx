import Divider from "@mui/material/Divider";

import Logo from '@components/Logo.tsx';
import MovieList from "@components/MovieList.tsx";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
}));

export default function HomePage() {
    return (
        <>
            <Logo />
            <div>
                <Divider />
                <MovieList />
                <Divider />
                <Item>
                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        Version: 2024.12.19.02 [testnet]
                    </Typography>
                </Item>
                <Item>
                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        Github: https://github.com/croal99
                    </Typography>
                </Item>
            </div>
        </>
    );
}
