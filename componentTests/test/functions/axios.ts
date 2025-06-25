import { client } from './client/client.gen';

client.instance.interceptors.request.use(request => {
    console.log(`Request: ${request.method} ${request.url}`);
    return request;
});

client.instance.interceptors.response.use(response => {
    console.log(`Response: ${JSON.stringify(response, null, 2)}`);
    return response;
});
