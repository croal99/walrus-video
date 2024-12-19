import Api from "@/utils/api.ts";
import {IMovieInfo} from "@/types/IMovieInfo.ts";

export const useMovieApi = () => {
    const fetchMovie = async (playerId: string, movieId: string) => {
        console.log(`Fetching movie with id ${playerId} ${movieId}`);
        const res = await Api.get("movie",
            {
                params: {
                    pid: playerId,
                    mid: movieId,
                },
            }
        )

        return res.data as IMovieInfo;
    }

    const fetchMovies = async () => {
        const res = await Api.get("movies")

        return res.data;
    }


    return {
        fetchMovies,
        fetchMovie
    }

}