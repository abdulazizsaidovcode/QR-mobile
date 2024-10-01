import axios from "axios";
import { getConfig, getConfigImg } from "../token";
import { useMutation } from "react-query";

export interface UseGlobalResponse<T> {
    loading: boolean;
    error: any;
    response: T | any | undefined;
    globalDataFunc: () => void;
}

export function useGlobalRequest<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: T,
    configType: 'DEFAULT' | 'IMAGE' = 'DEFAULT'
): UseGlobalResponse<T> {
    const mutation = useMutation({
        mutationFn: async () => {
            let res;
            const config = configType === 'DEFAULT' ? await getConfig() : await getConfigImg();
            switch (method) {
                case 'GET':
                    res = await axios.get(url, config || {});
                    break;
                case 'POST':
                    console.log(data);
                    console.log(url);
                    res = await axios.post(url, data || {}, config || {}); 
                    break;
                case 'PUT':
                    res = await axios.put(url, data || {}, config || {});
                    break;
                case 'DELETE':
                    res = await axios.delete(url, config || {});
                    break;
                default:
                    return alert('Method xaltolik yuz berdi!');
            }

            if (method !== 'GET') {
                if (res.data.error) alert(`${res.data.error.code, res.data.error.message}`);
            }
            return res.data.data;
        },
        onError: (error: any) => console.log(error)
    });

    return {
        loading: mutation.status === 'loading', 
        error: mutation.error,
        response: mutation.data,
        globalDataFunc: mutation.mutateAsync,
    };
}
