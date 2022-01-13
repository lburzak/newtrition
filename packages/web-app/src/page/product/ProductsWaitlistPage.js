import {useContext} from "react";
import {NewtritionClientContext} from "../../App";
import {useRemoteData} from "../../hook/remoteData";
import Waitlist from "../../component/Waitlist";
import useProductDialog from "../../hook/productDialog";

export default function ProductsWaitlistPage() {
    const client = useContext(NewtritionClientContext);
    const [recipes, invalidate] = useRemoteData(() => client.products.get({visibility: 'waitlist'}), [])
    const [productDialog, showProductDialog] = useProductDialog()

    function acceptProduct({id}) {
        client.products.byId(id).patch({visibility: 'public'})
            .then(invalidate);
    }

    function declineProduct({id}) {
        client.products.byId(id).patch({visibility: 'private'})
            .then(invalidate);
    }

    function showProduct(product) {
        showProductDialog(product)
    }

    return <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <Waitlist items={recipes} onAccept={acceptProduct} onDecline={declineProduct} onShow={showProduct}/>
        {productDialog}
    </div>
}