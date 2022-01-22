import CardsList from "../../component/CardsList";
import {useClient} from "../../hook/client";
import {useRemoteData} from "../../hook/remoteData";
import ProductCard from "../../component/ProductCard";

export default function SearchProductsPage() {
    const client = useClient();
    const [products] = useRemoteData(() => client.products.get({visible: true}), [])

    return <CardsList>
        {
            products.map((product, index) => <ProductCard
                key={`product-${index}`}
                product={product}/>)
        }
    </CardsList>
}