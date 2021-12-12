import {
    Autocomplete, Box,
    Button,
    Divider, FormControl,
    Grid,
    IconButton, InputLabel,
    List,
    ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction,
    ListItemText, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import {Add, Delete, Done, Edit} from "@mui/icons-material";

export function RecipeCreatorPage() {
    return <div style={{display: 'flex', flexDirection: 'column', width: '100%', padding: 20}}>
        <div style={{display: 'flex', flexDirection: 'row', gap: 12}}>
            <TextField style={{flex: 1}} label={"Recipe name"} fullWidth/>
            <Button variant={'contained'} startIcon={<Done/>}>Save recipe</Button>
        </div>
        <Grid container height={'100%'}>
            <Grid item md={6} sm={12} lg={8}>
                <PhotosSection/>
                <StepsSection/>
            </Grid>
            <Grid item md={6} xs={12} lg={4}>
                <IngredientsSection/>
            </Grid>
        </Grid>
    </div>
}

function PhotosSection() {
    return <FormSection label={"Photos"}>
        <IconButton style={{
            borderRadius: 8,
            backgroundColor: 'hsl(0, 0%, 90%)',
            width: 120,
            height: 120,
            display: 'flex',
            justifyContent: 'center',
            alightItems: 'center'
        }}>
            <Add style={{color: 'hsl(0, 0%, 70%)'}} sx={{fontSize: 42}}/>
        </IconButton>
    </FormSection>
}

function StepsSection() {
    return <FormSection label={"Steps"}>
        <List>
            <StepItem position={1} content={"Heat the oven to 180 degrees."}/>
            <StepItem position={2} content={"Put cheese on top."}/>
            <StepItem position={3} content={"Fry the onion."}/>
            <StepItem position={4} editMode content={"Enjoy the dish."}/>
            <Button variant={"outlined"} fullWidth>
                <Add/>
            </Button>
        </List>
    </FormSection>
}

function IngredientsSection() {
    return <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
        <Divider style={{marginLeft: 20, marginRight: 20, marginTop: 20}} orientation={"vertical"}/>
        <FormSection label={"Ingredients"} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <div style={{flex: 1}}>
                    <List>
                        <IngredientItem/>
                        <IngredientItem/>
                        <IngredientItem/>
                        <IngredientItem/>
                    </List>
                </div>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={['Masło', 'Ser', 'Mleko']}
                            renderInput={(params) => <TextField {...params} label="Ingredient"/>}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label={"Amount"} disabled/>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth disabled>
                            <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                value={10}
                                label="Unit">
                                <MenuItem value={10}>grams</MenuItem>
                                <MenuItem value={20}>litres</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} style={{overflow: 'hidden'}}>
                        <Button style={{width: '100%', height: '100%'}} color={'primary'} variant={"contained"}
                                disabled>
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </FormSection>
    </div>
}

function IngredientItem() {
    return <ListItem>
        <ListItemText primary={"Mleko"} secondary={"300 ml"}/>
        <ListItemIcon style={{display: 'flex', justifyContent: 'center'}}>
            <IconButton>
                <Delete/>
            </IconButton>
        </ListItemIcon>
    </ListItem>
}

function StepItem({editMode, position, content}) {
    return <ListItem>
        <ListItemAvatar>
            <Box>
                {position}.
            </Box>
        </ListItemAvatar>
        <ListItemText>
            {editMode ? <TextField variant={'standard'} value={content}/> : <Typography>{content}</Typography>}
        </ListItemText>
        <ListItemIcon>
            <IconButton>
                {editMode ? <Done/> : <Edit/>}
            </IconButton>
        </ListItemIcon>
        <ListItemSecondaryAction>
            <IconButton>
                <Delete/>
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
}

function FormSection({style, label, children}) {
    return <div style={{...style}}>
        <Typography style={{paddingTop: 20, paddingBottom: 6}} variant={'h5'} fontWeight={'bold'}>{label}</Typography>
        {children}
    </div>
}
