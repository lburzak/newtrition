import {Add} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {useState} from "react";
import {styled} from "@mui/material/styles";

export default function PhotosSlider() {
    const [photos, setPhotos] = useState([
        "https://foodwithfeeling.com/wp-content/uploads/2016/06/Pea-Mushroom-Risotto-6.jpg",
        null
    ])

    const updatePhoto = (index, src) => {
        let fReader = new FileReader();
        fReader.readAsDataURL(src);
        fReader.onloadend = function(event){
            const newPhotos = [...photos]
            newPhotos[index] = event.target.result
            if (index === newPhotos.length - 1)
                newPhotos.push(null)
            setPhotos(newPhotos)
        }
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