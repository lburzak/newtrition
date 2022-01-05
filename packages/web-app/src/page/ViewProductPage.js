import {useParams} from "react-router";

export default function ViewProductPage() {
    const {id} = useParams()
    return <div>{id}</div>
}