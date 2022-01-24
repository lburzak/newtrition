import {Fab} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import CardsList from "../../component/CardsList";
import ProductCard from "../../component/ProductCard";
import {CardMenu} from "../../component/CardItem";
import useProductDialog from "../../hook/productDialog";
import {useRemoteData} from "../../hook/remoteData";
import {useClient} from "../../hook/client";
import {createVisibilityAction} from "../../util/domain";

export function ManageProductsPage() {
    const client = useClient()
    const [products, invalidateProducts] = useRemoteData(client.users.self.products.get, [])
    const [productDialog, showProduct] = useProductDialog(invalidateProducts)

    function deleteProduct(id) {
        client.products.byId(id).delete().then(() => invalidateProducts())
    }

    function publishProduct(id) {
        client.products.byId(id).patch({visibility: 'waitlist'}).then(() => invalidateProducts())
    }

    function unpublishProduct(id) {
        client.products.byId(id).patch({visibility: 'private'}).then(() => invalidateProducts())
    }

    return <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <CardsList>
            {
                products.map((product, index) => <ProductCard
                    key={`product-${index}`}
                    product={product}
                    menu={
                        <CardMenu items={[{
                            label: "Edit",
                            icon: <Edit fontSize="small"/>,
                            onClick: () => showProduct(product)
                        }, {
                            label: "Delete",
                            icon: <Delete fontSize="small"/>,
                            onClick: () => deleteProduct(product._id)
                        },
                            createVisibilityAction(product, unpublishProduct, publishProduct)]}/>
                    }/>)
            }
        </CardsList>
        {productDialog}
        <Fab color={'primary'} variant={"extended"} sx={{mr: 1}}
             style={{position: 'absolute', right: 20, bottom: 20}} onClick={() => showProduct({})}>
            <Add/> New product
        </Fab>
    </div>
}