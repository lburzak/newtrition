import {useParams} from "react-router";
import {CreateProductPage} from "./CreateProductPage";
import {useContext} from "react";
import {DataContext} from "../App";

export default function ViewProductPage() {
    const {id} = useParams()
    const [products] = useContext(DataContext).products
    const product = products.filter(product => product._id === id)[0];
    return <CreateProductPage product={product}/>
}