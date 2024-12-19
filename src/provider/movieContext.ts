import { createContext } from 'react';
import {IMovieOnChain} from "@/types/IMovieInfo.ts";

const defaultMovie : IMovieOnChain = {
    blob_ids: [],
    description: "",
    image: "",
    name: "",
    occupation: "",
}

export const MovieContext = createContext(defaultMovie);