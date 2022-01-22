import {getDefaultRecipePhoto, randomPlaceholderGenerator} from "../util/photo";
import {CardItem, Spec} from "./CardItem";
import {Fragment} from "react";

export default function RecipeCard({recipe, menu, showAuthor = true, generatePhoto = randomPlaceholderGenerator()}) {
    return <CardItem
        imageSrc={recipe.photosCount > 0 ? getDefaultRecipePhoto(recipe._id) : generatePhoto(recipe.name)}
        name={recipe.name}
        visibility={recipe.visibility}
        menu={menu}>
        {showAuthor ? <Spec name={"Author"} value={recipe.owner}/> : <Fragment/>}
    </CardItem>
}