import * as React from "react";
import {MovieContext} from "./movieContext.ts";
import {IMovieOnChain} from "@/types/IMovieInfo.ts";

interface MovieProps {
    children: React.ReactNode;
    file: IMovieOnChain;
}

export default function MovieProvider({file, children}: MovieProps) {
    return (
        <MovieContext.Provider value={file}>
            {children}
        </MovieContext.Provider>
    );
}