import CardsList from "../../component/CardsList";
import {useContext} from "react";
import {NewtritionClientContext} from "../../App";
import {useRemoteData} from "../../hook/remoteData";
import ProductCard from "../../component/ProductCard";

export default function SearchProductsPage() {
    const client = useContext(NewtritionClientContext);
    const [products] = useRemoteData(() => client.products.get({visible: true}), [])

    return <CardsList>
        {
            products.map((product, index) => <ProductCard
                key={`product-${index}`}
                product={product}/>)
        }
    </CardsList>
}