import {
    Card, Chip,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem, MenuList,
    Typography
} from "@mui/material";
import {MoreVert, Public, Key, Pending} from "@mui/icons-material";
import {Fragment, useState} from "react";

export function CardMenuItem({onClick, icon, label}) {
    return <MenuItem onClick={onClick}>
        <ListItemIcon>
            {icon}
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
    </MenuItem>
}

export function CardMenu({items}) {
    const [anchor, setAnchor] = useState(null);

    const open = Boolean(anchor);

    const openMenu = (event) => {
        setAnchor(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchor(null);
    };

    return <div>
        <IconButton onClick={openMenu}><MoreVert/></IconButton>
        <Menu anchorEl={anchor} open={open} onClose={closeMenu}>
            <MenuList sx={{width: 320, maxWidth: '100%'}}>
                {items.map(item => <CardMenuItem icon={item.icon} label={item.label} onClick={() => {
                    closeMenu();
                    item.onClick();
                }}/>)}
            </MenuList>
        </Menu>
    </div>
}

export const CardItem = ({name, calories, proteins, carbohydrates, ean, imageSrc, visibility, menu}) => {
    const [buttonsVisibility, setButtonsVisibility] = useState(false);

    return <Card style={{position: 'relative'}} onMouseEnter={() => setButtonsVisibility(true)}
                 onMouseLeave={() => setButtonsVisibility(false)}>
        <Chip label={visibilityToText(visibility)} icon={visibilityToIcon(visibility)}
              color={visibilityToColor(visibility)} variant={buttonsVisibility ? "filled" : "outlined"}
              style={{position: 'absolute', left: 6, top: 6}}/>
        {menu ? <div style={{display: buttonsVisibility ? 'block' : 'none', position: 'absolute', right: 0, top: 0}}>
            {menu}
        </div> : <Fragment/>}
        <div style={{height: 120, width: '100%', backgroundColor: 'gray'}}>
            {imageSrc ?
                <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={imageSrc} alt={`${name}`}/> :
                <div/>}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', padding: 10}}>
            <Typography variant={'h6'} fontWeight={'bold'}>{name}</Typography>
            <Typography variant={'body1'} fontFamily={'monospace'} style={{color: 'hsl(0, 0%, 50%)'}}>{ean}</Typography>
            <Divider orientation={'horizontal'}/>
            <ProductSpecRow name={'Calories'} value={calories}/>
            <ProductSpecRow name={'Proteins'} value={proteins}/>
            <ProductSpecRow name={'Carbs'} value={carbohydrates}/>
        </div>
    </Card>;
}


const ProductSpecRow = ({name, value}) => <div
    style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
    <Typography variant={'body1'} style={{color: 'hsl(0, 0%, 70%)'}}>{name}</Typography>
    <Typography variant={'body1'}>{value}</Typography>
</div>

function visibilityToText(visibility) {
    switch (visibility) {
        case 'waitlist':
            return 'Pending';
        case 'public':
            return 'Public';
        case 'private':
        default:
            return 'Private';
    }
}

function visibilityToColor(visibility) {
    switch (visibility) {
        case 'waitlist':
            return 'warning';
        case 'public':
            return 'success';
        case 'private':
        default:
            return 'info';
    }
}

function visibilityToIcon(visibility) {
    switch (visibility) {
        case 'waitlist':
            return <Pending/>;
        case 'public':
            return <Public/>;
        case 'private':
        default:
            return <Key/>;
    }
}