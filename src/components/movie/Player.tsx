import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

interface IPlayerParam {
    videoUrl: string,
}

const Item = styled(Paper)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
}));

export default function (
    {
        videoUrl,
    } : IPlayerParam ) {
    return (
        <Item>
            <video width="320" height="540" controls id="video" preload="auto">
                <source src={videoUrl} type="video/mp4"/>
            </video>
        </Item>

    )
}