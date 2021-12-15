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
import {useContext, useEffect, useReducer, useState} from "react";
import {ProductsContext} from "../App";

const initialState = {
    name: '',
    steps: ["Heat the oven to 180 degrees.", "Put cheese on top.", "Fry the onion.", "Enjoy the dish."],
    ingredients: [
        {name: 'Mleko', amount: 300, unit: 'ml'},
        {name: 'Ser', amount: 200, unit: 'g'}
    ]
};

function reducer(state, action) {
    switch (action.type) {
        case 'updateStep':
            return {
                ...state,
                steps: state.steps.map(
                    (content, index) => index === action.payload.index ? action.payload.content : content
                )
            }
        case 'deleteStep':
            return {
                ...state,
                steps: state.steps.filter((step, index) => index !== action.payload)
            }
        case 'addStep':
            const steps = state.steps;
            steps.push("")

            return {
                ...state,
                steps
            }
        case 'changeName':
            return {
                ...state,
                name: action.payload
            }
        case 'addIngredient':
            const ingredients = state.ingredients;

            ingredients.push({
                name: action.payload.name,
                amount: action.payload.amount,
                unit: action.payload.unit
            })

            return {
                ...state,
                ingredients
            }
        case 'deleteIngredient':
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, index) => index !== action.payload)
            }
        default:
            return state;
        case 'submit':
            return {
                ...state,
                submitted: true
            }
        case 'submitted':
            return {
                ...state,
                submitted: false
            }
    }
}

export function RecipeCreatorPage() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (state.submitted) {
            console.log("submitting", state);
            dispatch({type: 'submitted'});
        }
    }, [state, dispatch])

    return <div style={{display: 'flex', flexDirection: 'column', width: '100%', padding: 20}}>
        <div style={{display: 'flex', flexDirection: 'row', gap: 12}}>
            <TextField style={{flex: 1}} label={"Recipe name"} value={state.name}
                       onChange={(e) => dispatch({type: 'changeName', payload: e.target.value})} fullWidth/>
            <Button variant={'contained'} onClick={() => dispatch({type: 'submit'})} startIcon={<Done/>}>Save recipe</Button>
        </div>
        <Grid container height={'100%'}>
            <Grid item md={6} sm={12} lg={8}>
                <PhotosSection/>
                <StepsSection steps={state.steps} dispatch={dispatch}/>
            </Grid>
            <Grid item md={6} xs={12} lg={4}>
                <IngredientsSection ingredients={state.ingredients} dispatch={dispatch}/>
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

function StepsSection({steps, dispatch}) {
    return <FormSection label={"Steps"}>
        <List>
            {steps.map((step, index) => <StepItem position={index + 1} content={step}
                                                  onContentChanged={(content) => dispatch({
                                                      type: 'updateStep',
                                                      payload: {index, content}
                                                  })}
                                                  onDelete={() => dispatch({type: 'deleteStep', payload: index})}/>)}
            <Button onClick={() => dispatch({type: 'addStep'})} variant={"outlined"} fullWidth>
                <Add/>
            </Button>
        </List>
    </FormSection>
}

function IngredientForm({onCreateIngredient}) {
    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('grams');
    const cannotProceed = !product;
    const {productsState} = useContext(ProductsContext);

    const submit = () => onCreateIngredient({name: product.name, amount, unit});

    return <Grid container spacing={1}>
        <Grid item xs={12}>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                isOptionEqualToValue={(option, value) => option._id === value._id}
                options={productsState.products}
                getOptionLabel={option => option.name}
                onChange={(e, value) => setProduct(value)}
                renderInput={(params) => <TextField {...params} label="Ingredient"/>}
            />
        </Grid>
        <Grid item xs={4}>
            <TextField onChange={(e) => setAmount(e.target.value)} label={"Amount"} disabled={cannotProceed}/>
        </Grid>
        <Grid item xs={4}>
            <FormControl fullWidth disabled={cannotProceed}>
                <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    label="Unit">
                    <MenuItem value={'grams'}>grams</MenuItem>
                    <MenuItem value={'litres'}>litres</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={4} style={{overflow: 'hidden'}}>
            <Button onClick={() => submit()} style={{width: '100%', height: '100%'}} color={'primary'}
                    variant={"contained"}
                    disabled={cannotProceed}>
                Add
            </Button>
        </Grid>
    </Grid>
}

function IngredientsSection({ingredients, dispatch}) {
    return <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
        <Divider style={{marginLeft: 20, marginRight: 20, marginTop: 20}} orientation={"vertical"}/>
        <FormSection label={"Ingredients"} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <div style={{flex: 1}}>
                    <List>
                        {ingredients.map((ingredient, index) => <IngredientItem name={ingredient.name}
                                                                                unit={ingredient.unit}
                                                                                amount={ingredient.amount}
                                                                                onDelete={() => dispatch({
                                                                                    type: 'deleteIngredient',
                                                                                    payload: index
                                                                                })}/>)}
                    </List>
                </div>
                <IngredientForm
                    onCreateIngredient={(ingredient) => dispatch({type: 'addIngredient', payload: ingredient})}/>
            </div>
        </FormSection>
    </div>
}

function IngredientItem({name, amount, unit, onDelete}) {
    return <ListItem>
        <ListItemText primary={name} secondary={`${amount} ${unit}`}/>
        <ListItemIcon style={{display: 'flex', justifyContent: 'center'}}>
            <IconButton>
                <Delete onClick={() => onDelete()}/>
            </IconButton>
        </ListItemIcon>
    </ListItem>
}

function StepItem({position, content, onContentChanged, onDelete}) {
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (content.length === 0)
            setEditMode(true);
    }, [setEditMode, content])

    return <ListItem>
        <ListItemAvatar>
            <Box>
                {position}.
            </Box>
        </ListItemAvatar>
        <ListItemText>
            {editMode ?
                <TextField onChange={(e) => onContentChanged(e.target.value)} variant={'standard'} value={content}/> :
                <Typography>{content}</Typography>}
        </ListItemText>
        <ListItemIcon>
            <IconButton>
                {editMode ? <Done onClick={() => setEditMode(false)}/> : <Edit onClick={() => setEditMode(true)}/>}
            </IconButton>
        </ListItemIcon>
        <ListItemSecondaryAction>
            <IconButton>
                <Delete onClick={() => onDelete()}/>
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
