import CardsList from "../../component/CardsList";
import {useRemoteData} from "../../hook/remoteData";
import ProductCard from "../../component/ProductCard";

export default function SearchProductsPage() {
    const [products] = useRemoteData((client) => client.products.get({visible: true}), [])

    return <CardsList>
        {
            products.map((product, index) => <ProductCard
                key={`product-${index}`}
                product={product}/>)
        }
    </CardsList>
}