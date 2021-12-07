import Box from "@mui/material/Box";
import {
    Button, Card,
    Divider,
    Fab, Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon, Paper,
    Typography
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import {AccountCircle, Fastfood, Add, Restaurant, Close} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {AuthContext, ProductsContext} from "../App";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {CreateProductPage} from "./CreateProductPage";

const ProfileView = () => <AuthContext.Consumer>
    {({authState, authDispatch}) => <Box>
        <Divider/>
        <ListItem>
            <ListItemIcon>
                <AccountCircle sx={{fontSize: 38}}/>
            </ListItemIcon>
            <ListItemText primary="Profile"
                          secondary={`Logged in as ${authState.authenticated ? authState.username : "Guest"}`}/>
            <Button variant={"outlined"} onClick={() => authDispatch({type: 'loggedOut'})}>Logout</Button>
        </ListItem>
    </Box>}
</AuthContext.Consumer>

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

export const DashboardPage = () => {
    const [productCreatorOpened, setProductCreatorOpened] = useState(false);
    const {authState} = useContext(AuthContext);
    const {productsState} = useContext(ProductsContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authState.authenticated)
            navigate('/login');
    }, [authState, navigate]);

    return <div style={{display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh'}}>
        <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
             style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Fastfood/>
                        </ListItemIcon>
                        <ListItemText primary="Products"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Restaurant/>
                        </ListItemIcon>
                        <ListItemText primary="Recipes"/>
                    </ListItemButton>
                </ListItem>
            </List>
            <ProfileView/>
        </Box>
        <Divider variant={'fullWidth'} orientation={'vertical'}/>
        <Box style={{overflowY: 'scroll', height: '100%', width: '100%'}}>
            <div style={{padding: 20}}>
                <EvenGrid>
                    {
                        productsState.products.map((product, index) => <ProductCard
                            key={`product-${index}`}
                            name={product.name}
                            calories={product.nutritionFacts.calories}
                            proteins={product.nutritionFacts.protein}
                            carbohydrates={product.nutritionFacts.carbohydrate}
                            ean={product.ean}
                        />)
                    }
                </EvenGrid>
            </div>
        </Box>
        <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flex: 1, position: 'absolute'}}>
            <BottomSheet title="New product" visible={productCreatorOpened}
                         onDismiss={() => setProductCreatorOpened(false)}>
                <CreateProductPage/>
            </BottomSheet>
        </Box>
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => setProductCreatorOpened(true)}>
            <Add/> New product
        </Fab>
    </div>;
}

const EvenGrid = ({children}) => <Grid container spacing={2}>
    {children.map(child => <Grid item xs={12} sm={6} md={4} lg={3}>{child}</Grid>)}
</Grid>

const ProductSpecRow = ({name, value}) => <div
    style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
    <Typography variant={'body1'} style={{color: 'hsl(0, 0%, 70%)'}}>{name}</Typography>
    <Typography variant={'body1'}>{value}</Typography>
</div>

const ProductCard = ({name, calories, proteins, carbohydrates, ean, imageSrc}) => <Card>
    <div style={{height: 120, width: '100%', backgroundColor: 'gray'}}>
        {imageSrc ? <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={imageSrc} alt={`${name}`}/> :
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
</Card>