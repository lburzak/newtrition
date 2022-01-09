import {CreateProductPage} from "./CreateProductPage";
import {
    Card, Chip,
    Divider,
    Fab,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem, MenuList,
    Paper,
    Typography
} from "@mui/material";
import {Add, Close, Delete, Edit, MoreVert, Public, Key, Pending} from "@mui/icons-material";
import {useContext, useState} from "react";
import {DataContext, NewtritionClientContext} from "../App";
import CardsList from "../component/CardsList";

function getFirstPhotoUrl(id) {
    return `/api/products/${id}/photos/0`;
}

export function ProductsPage() {
    const [editingProduct, setEditingProduct] = useState(null)
    const client = useContext(NewtritionClientContext);
    const [products, invalidateProducts] = useContext(DataContext).products;

    return <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <CardsList>
            {
                products.map((product, index) => <ProductCard
                    key={`product-${index}`}
                    name={product.name}
                    calories={product.nutritionFacts.calories}
                    proteins={product.nutritionFacts.protein}
                    carbohydrates={product.nutritionFacts.carbohydrate}
                    ean={product.ean}
                    visibility={product.visibility}
                    imageSrc={product.photosCount > 0 ? getFirstPhotoUrl(product._id) : undefined}
                    onEdit={() => setEditingProduct(product)}
                    onDelete={() => {
                        client.products.byId(product._id).delete()
                            .catch(error => {
                                if (error.response.status === 404)
                                    console.error(`Attempted to delete non-existing product ${product._id}`)
                            })
                            .then(() => invalidateProducts());
                    }}
                    onPublish={() => {
                        client.products.byId(product._id).patch({visibility: 'waitlist'})
                            .then(() => invalidateProducts());
                    }}
                />)
            }
        </CardsList>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            flex: 1,
            position: 'absolute',
            bottom: 0
        }}>
            { editingProduct ? <BottomSheet title={editingProduct?._id ? "Edit product" : "New product"} visible={editingProduct}
                                            onDismiss={() => setEditingProduct(null)}>
                <CreateProductPage product={editingProduct}/>
            </BottomSheet> : <div/> }

        </div>
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => setEditingProduct({})}>
            <Add/> New product
        </Fab>
    </div>
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

export const ProductCard = ({name, calories, proteins, carbohydrates, ean, imageSrc, visibility, onDelete, onEdit, onPublish = () => {}}) => {
    const [buttonsVisibility, setButtonsVisibility] = useState(false);
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);

    const openMenu = (event) => {
        setAnchor(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchor(null);
    };

    return <Card style={{position: 'relative'}} onMouseEnter={() => setButtonsVisibility(true)}
                 onMouseLeave={() => setButtonsVisibility(false)}>
        <Chip label={visibilityToText(visibility)} icon={visibilityToIcon(visibility)} color={visibilityToColor(visibility)} variant={buttonsVisibility ? "filled" : "outlined"} style={{position: 'absolute', left: 6, top: 6}} />
        <div style={{display: buttonsVisibility ? 'block' : 'none', position: 'absolute', right: 0, top: 0}}>
            <IconButton onClick={openMenu}><MoreVert/></IconButton>
            <Menu anchorEl={anchor} open={open} onClose={closeMenu}>
                <MenuList sx={{width: 320, maxWidth: '100%'}}>
                    <MenuItem onClick={() => {
                        onEdit();
                        closeMenu()
                    }}>
                        <ListItemIcon>
                            <Edit fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        onDelete();
                        closeMenu()
                    }}>
                        <ListItemIcon>
                            <Delete fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        onPublish();
                        closeMenu()
                    }}>
                        <ListItemIcon>
                            <Public fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Publish</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </div>
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

const BottomSheet = ({title, visible, onDismiss, children}) =>
    <div style={{visibility: visible ? 'visible' : 'hidden', zIndex: 2, display: 'flex', justifyContent: 'center'}}>
        <Paper elevation={4} style={{
            minHeight: 400,
            width: '90%',
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 40,
            display: 'flex'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography variant={'h6'}
                                style={{margin: 20, color: 'hsl(0, 0%, 40%)', textAlign: 'start'}}>{title}</Typography>
                    <IconButton onClick={onDismiss}>
                        <Close style={{margin: 20, color: 'hsl(0, 0%, 40%)'}}/>
                    </IconButton>
                </div>
                <div style={{flex: 1}}>
                    {children}
                </div>
            </div>
        </Paper>
    </div>