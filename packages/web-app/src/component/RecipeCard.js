import {getDefaultRecipePhoto, randomPlaceholderGenerator} from "../util/photo";
import {CardItem} from "./CardItem";

export default function RecipeCard({recipe, menu, generatePhoto = randomPlaceholderGenerator()}) {
    return <CardItem
        imageSrc={recipe.photosCount > 0 ? getDefaultRecipePhoto(recipe._id) : generatePhoto(recipe.name)}
        name={recipe.name}
        visibility={recipe.visibility}
        menu={menu}/>
}