import {Add} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {useState} from "react";
import {styled} from "@mui/material/styles";

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result)
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function PhotosSlider({onPhotoAdded, onPhotoChanged, defaultValue}) {
    const [photos, setPhotos] = useState([
        ...defaultValue,
        null
    ])

    const updatePhoto = (index, file) => {
        if (index === photos.length - 1)
            onPhotoAdded(file)
        else
            onPhotoChanged(index, file)

        readFile(file).then(blob => {
            const newPhotos = [...photos]
            newPhotos[index] = blob
            if (index === newPhotos.length - 1)
                newPhotos.push(null)
            setPhotos(newPhotos)
        })
    }

    return <div style={{display: "flex", flexDirection: "row"}}>
        {photos.map((photo, index) =>
            <PhotoTile imageSrc={photo} key={`photos-${index}`} index={index} onChange={src => {
                updatePhoto(index, src)
            }}/>
        )}
    </div>
}

function PhotoTile({imageSrc, onChange, index}) {
    const Input = styled('input')({
        display: 'none',
    });

    return <label htmlFor={"icon-button-file" + index}>
        <Input accept="image/*" id={"icon-button-file" + index} type="file" onChange={event => {
            onChange(event.target.files[0])
        }}/>
        <IconButton component="span" style={{
            borderRadius: 8,
            backgroundColor: 'hsl(0, 0%, 90%)',
            width: 120,
            height: 120,
            display: 'flex',
            justifyContent: 'center',
            alightItems: 'center',
            padding: 0,
            overflow: 'hidden',
            marginRight: 8
        }}>
            {imageSrc ? <img alt="" src={imageSrc} style={{objectFit: 'cover', width: '100%', height: '100%'}}/> :
                <Add style={{color: 'hsl(0, 0%, 70%)'}} sx={{fontSize: 42}}/>}
        </IconButton>
    </label>
}