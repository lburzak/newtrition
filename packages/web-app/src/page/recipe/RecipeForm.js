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
import {useEffect, useReducer, useState} from "react";
import PhotosSlider from "../../component/PhotosSlider";
import {convertJsonToFormData} from "../../util/formData";
import {range} from "../../util/range";
import {useRemoteData} from "../../hook/remoteData";

export function RecipeForm({onSubmit, defaultRecipe}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    if (!state.initialized && defaultRecipe)
        dispatch({type: 'initialize', payload: stateFromRecipe(defaultRecipe)})

    return <div style={{display: 'flex', flexDirection: 'column', width: '100%', padding: 20}}>
        <div style={{display: 'flex', flexDirection: 'row', gap: 12}}>
            <TextField style={{flex: 1}} label={"Recipe name"} value={state.name}
                       onChange={(e) => dispatch({type: 'changeName', payload: e.target.value})} fullWidth/>
            <Button disabled={state.submitted} variant={'contained'} onClick={() => onSubmit(readRecipeFromInput(state))}
                    startIcon={<Done/>}>Save recipe</Button>
        </div>
        <Grid container height={'100%'}>
            <Grid item md={6} sm={12} lg={8}>
                <PhotosSection dispatch={dispatch}/>
                <StepsSection steps={state.steps} dispatch={dispatch}/>
            </Grid>
            <Grid item md={6} xs={12} lg={4}>
                <IngredientsSection ingredients={state.ingredients} dispatch={dispatch}/>
            </Grid>
        </Grid>
    </div>
}

function stateFromRecipe(recipe) {
    const {name, steps, ingredients, photosCount, id} = recipe;

    return {
        name, steps, ingredients,
        photos: range(photosCount).map(i => `/api/recipes/${id}/photos/${i}`)
    }
}

const initialState = {
    name: '',
    steps: ["Heat the oven to 180 degrees.", "Put cheese on top.", "Fry the onion.", "Enjoy the dish."],
    ingredients: [
        {class: 'Mleko', amount: 300, unit: 'ml'},
        {class: 'Ser', amount: 200, unit: 'g'}
    ],
    submitted: false,
    finished: false,
    photos: []
};

function reducer(state, action) {
    switch (action.type) {
        case 'initialize':
            return {...action.payload, initialized: true}
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
                class: action.payload.name,
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
        case 'addPhoto':
            return {
                ...state,
                photos: [...state.photos, action.payload.file]
            }
        case 'changePhoto':
            const photos = [...state.photos];

            photos[action.payload.index] = action.payload.file
            return {
                ...state,
                photos
            }
        default:
            return state;
    }
}

function readRecipeFromInput(state) {
    const {name, steps, ingredients} = state;

    const recipe = {
        name,
        steps,
        ingredients
    };

    const data = convertJsonToFormData(recipe);

    state.photos.forEach(photo => data.append('photos', photo))

    return data;
}

function PhotosSection({dispatch}) {
    return <FormSection label={"Photos"}>
        <PhotosSlider onPhotoAdded={(file) => dispatch({type: 'addPhoto', payload: {file}})}
                      onPhotoChanged={(index, file) => dispatch({
                          type: 'changePhoto',
                          payload: {index, file}
                      })}/>
    </FormSection>
}

function StepsSection({steps, dispatch}) {
    return <FormSection label={"Steps"}>
        <List>
            {steps.map((step, index) => <StepItem position={index + 1} content={step}
                                                  key={`step-${index}`}
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
    const [unit, setUnit] = useState('g');
    const cannotProceed = !product;
    const [classes] = useRemoteData(client => client.products.classes.get(), [])

    const submit = () => onCreateIngredient({name: product, amount, unit});

    return <Grid container spacing={1}>
        <Grid item xs={12}>
            <Autocomplete
                disablePortal
                options={classes.map(product => product.slice(0, 1).toUpperCase() + product.slice(1))}
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
                    <MenuItem value={'g'}>grams</MenuItem>
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
                        {ingredients.map((ingredient, index) => <IngredientItem name={ingredient.class}
                                                                                unit={ingredient.unit}
                                                                                key={`ingredient-${index}`}
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
            <IconButton onClick={() => onDelete()}>
                <Delete/>
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
            <IconButton onClick={() => setEditMode(!editMode)}>
                {editMode ? <Done/> : <Edit/>}
            </IconButton>
        </ListItemIcon>
        <ListItemSecondaryAction>
            <IconButton onClick={() => onDelete()}>
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
