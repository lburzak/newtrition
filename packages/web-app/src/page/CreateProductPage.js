import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    OutlinedInput,
    TextField
} from "@mui/material";
import {useContext, useEffect, useReducer} from "react";
import Message from "../form/message"
import {DataContext, NewtritionClientContext} from "../App";
import PhotosSlider from "../component/PhotosSlider";

const initialState = {
    fields: {
        name: '',
        ean: '',
        calories: '',
        protein: '',
        carbohydrate: '',
        fat: ''
    },
    photos: [],
    errors: {},
    submitted: false,
    classes: []
}

const DetailInput = ({name, unit, onChange}) => <FormControl variant="outlined">
    <FormHelperText>{name}</FormHelperText>
    <OutlinedInput
        fullWidth
        endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
        inputProps={{inputMode: 'decimal', pattern: '[0-9]*'}}
        onChange={onChange}
    />
</FormControl>

function convertJsonToFormData(obj) {
    const data = new FormData()

    for (const key in obj) {
        data.append(key, obj[key])
    }

    return data
}

function readProductFromInput(state) {
    const {name, calories, carbohydrate, fat, protein, ean, classes} = state.fields;

    const product = {
        name,
        nutritionFacts: JSON.stringify({
            calories,
            carbohydrate,
            fat,
            protein
        }),
        classes: JSON.stringify(classes)
    };

    if (ean.length > 0)
        product.ean = ean

    const data = convertJsonToFormData(product);

    state.photos.forEach(photo => data.append('photos', photo))

    return data;
}

export function CreateProductPage() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const data = useContext(DataContext);
    const [, invalidateProducts] = data.products;
    const [classes, invalidateClasses] = data.classes;
    const client = useContext(NewtritionClientContext);

    const buildFieldChangeHandler = (fieldName) => event => dispatch({
        type: 'updateField',
        payload: {
            field: fieldName,
            content: event.target.value
        }
    });

    const products = client.users.self.products

    useEffect(() => {
        if (state.submitted) {
            const product = readProductFromInput(state)
            products.create(product).then(() => {
                dispatch({type: 'submitFinished'})
                invalidateProducts()
                invalidateClasses()
            })
                .catch(error => {
                    dispatch({type: 'submitFinished'})
                    if (error.response && error.response.status === 400) {
                        dispatch({type: 'showValidationErrors', payload: error.response.data.errors})
                    } else {
                        console.error("Server did not respond")
                    }
                })
        }
    }, [dispatch, invalidateProducts, state, invalidateClasses, products]);

    return <form style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}
                 onSubmit={e => {
                     e.preventDefault();
                     dispatch({type: 'submit'});
                 }}>

        <div style={{paddingBottom: 16}}>
            <PhotosSlider onPhotoAdded={(file) => dispatch({type: 'addPhoto', payload: {file}})}
                          onPhotoChanged={(index, file) => dispatch({type: 'changePhoto', payload: {index, file}})}/>
        </div>

        <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
                <TextField fullWidth label={"Product name"} variant={"outlined"}
                           onChange={buildFieldChangeHandler('name')}/>
            </Grid>
            <Grid item xs={6} md={4}>
                <TextField fullWidth label={"EAN Code"} variant={"outlined"} onChange={buildFieldChangeHandler('ean')}
                           error={state.errors['ean'] !== undefined} helperText={state.errors['ean']}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Calories per 100g" unit="kcal" onChange={buildFieldChangeHandler('calories')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Proteins per 100g" unit="grams" onChange={buildFieldChangeHandler('protein')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Carbohydrates per 100g" unit="grams"
                             onChange={buildFieldChangeHandler('carbohydrate')}/>
            </Grid>
            <Grid item xs={3}>
                <DetailInput name="Fat per 100g" unit="grams" onChange={buildFieldChangeHandler('fat')}/>
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    multiple
                    freeSolo
                    options={classes}
                    onChange={(event, value) => dispatch({
                        type: 'updateField',
                        payload: {field: 'classes', content: value}
                    })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Product classes"
                        />
                    )}
                />
            </Grid>
        </Grid>

        <Button fullWidth variant={"contained"} type={"submit"}>Save</Button>
    </form>;
}

function reducer(state, action) {
    switch (action.type) {
        case 'submit':
            return {
                ...state,
                errors: {},
                submitted: true
            }
        case 'submitFinished':
            return {
                ...state,
                submitted: false
            }
        case 'updateField':
            const newState = {
                ...state,
                fields: {
                    ...state.fields
                }
            };

            newState.fields[action.payload.field] = action.payload.content;

            console.log(newState)

            return newState;
        case 'showValidationErrors':
            const errors = {}
            action.payload.forEach(validationError => {
                errors[validationError.field] = Message.fromValidationError(validationError);
            })
            return {
                ...state,
                errors
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