import {useEffect, useState} from "react";
import {useClient} from "./client";

export function useRemoteData(fetch, initialData) {
    const [data, setData] = useState(initialData);
    const [invalidated, setInvalidated] = useState(true);
    const client = useClient();

    function invalidate() {
        setInvalidated(true);
    }

    useEffect(() => {
        function refresh() {
            setInvalidated(false);
            fetch(client).then(result => setData(result.data));
        }

        if (invalidated) refresh()
    }, [invalidated, fetch, client])

    return [data, invalidate];
}