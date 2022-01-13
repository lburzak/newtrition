import {useContext} from "react";
import {NewtritionClientContext} from "../../App";
import {useRemoteData} from "../../hook/remoteData";
import Waitlist from "../../component/Waitlist";

export default function ProductsWaitlistPage() {
    const client = useContext(NewtritionClientContext);
    const [recipes, invalidate] = useRemoteData(() => client.products.get({visibility: 'waitlist'}), [])

    function acceptProduct(id) {
        client.products.byId(id).patch({visibility: 'public'})
            .then(invalidate);
    }

    function declineProduct(id) {
        client.products.byId(id).patch({visibility: 'private'})
            .then(invalidate);
    }

    function showProduct(id) {

    }

    return <Waitlist items={recipes} onAccept={acceptProduct} onDecline={declineProduct} onShow={showProduct}/>
}