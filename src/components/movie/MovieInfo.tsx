import Grid from "@mui/material/Grid2";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {CardMedia} from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useContext } from 'react';
import {MovieContext} from "@/provider/movieContext.ts";
import EpisodeButton from "@components/movie/EpisodeButton.tsx";

const Item = styled(Paper)(({theme}) => ({
    // backgroundColor: '#fff',
    // ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    // color: theme.palette.text.secondary,
    // ...theme.applyStyles('dark', {
    //     backgroundColor: '#1A2027',
    // }),
}));


export default function MovieInfo() {
    const movieInfo = useContext(MovieContext);

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="320"
                            image={movieInfo.url}
                            alt=""
                        />
                    </Card>
                </Grid>
                <Grid size={8}>
                    <Stack spacing={2}>
                        <Item>Name: {movieInfo.name}</Item>
                        <Item>Type: {movieInfo.tag}</Item>
                        <Item>Actors: {movieInfo.actors}</Item>
                        <Item>Year: {movieInfo.year}</Item>
                        <Item>Episode: {movieInfo.total_count}</Item>
                   </Stack>
                </Grid>
                <Grid size={12}>
                    <Item>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {movieInfo?.description}
                        </Typography>
                    </Item>

                </Grid>
            </Grid>
        </>
    )
}