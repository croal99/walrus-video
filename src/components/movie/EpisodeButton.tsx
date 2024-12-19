import { useContext } from 'react';
import {MovieContext} from "@/provider/movieContext.ts";
import Button from "@mui/material/Button";

export default function EpisodeButton() {
    const movieInfo = useContext(MovieContext);

    return (
        <>
            <Button>
                {movieInfo && (movieInfo.name)}

            </Button>
        </>
    )
}