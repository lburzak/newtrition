import {useEffect, useState} from "react";

export function useRemoteData(fetch, initialData) {
    const [data, setData] = useState(initialData);
    const [invalidated, setInvalidated] = useState(true);

    function invalidate() {
        setInvalidated(true);
    }

    useEffect(() => {
        function refresh() {
            setInvalidated(false);
            fetch().then(result => setData(result.data));
        }

        if (invalidated) refresh()
    }, [invalidated, fetch])

    return [data, invalidate];
}