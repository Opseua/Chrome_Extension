let Api;
import('./src/recursos/Api.js').then(module => {
    Api = module.default;
});

const req = {
    url: `https://api.telusinternational.ai/cat/v1/workbench/projects/642aec2d1ade244f2ed20682/items/642aec3c1ade244f2ed20c02/submit`,
    method: 'PUT',
    headers: {
        'Host': 'api.telusinternational.ai',
        'content-length': '286',
        'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjIyOTVhYzNjY2NjN2Y0YWFlNTJmMGEzNjA1NWNlNzBiODVmMThkZGYifQ.eyJleHAiOjE2ODE1MDQ3NjQsIm5iZiI6MTY4MTUwMTE2NCwiaWF0IjoxNjgxNTAxMTY0LCJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2FpLmxpb25icmlkZ2UuY29tLyIsInN1YiI6IjYwMzUxN2RjNmMwY2ZkMjIxYzg3Mjg5ZCIsImFjciI6ImF6dXJlX2FkX2IyY19yb3BjIiwiYXVkIjoiaHR0cHM6Ly9haS5saW9uYnJpZGdlLmNvbS8iLCJuYW1lIjoiT3JsYW5kbyBQZXJlaXJhIFNhbnRhbmEiLCJlbWFpbCI6Im9wc2V1YUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiT3JsYW5kbyIsImZhbWlseV9uYW1lIjoiUGVyZWlyYSBTYW50YW5hIiwiaHR0cHM6Ly9haS5saW9uYnJpZGdlLmNvbS9hcC9hcHBfbWV0YWRhdGEiOnsibWVtYmVyc2hpcHMiOlt7ImlkIjoiNWVlMDg5MDMxNmJmNGYwNDQ0NDVkYzUxIiwicm9sZSI6Im9yZ2FuaXphdGlvbl91c2VyIiwidHlwZSI6Im9yZ2FuaXphdGlvbiIsInBlcm1pc3Npb25zIjpbIndvcms6cHJvamVjdHMiLCJ3b3JrOmFzc2Vzc21lbnRzIiwidXBkYXRlOnByb2ZpbGUiLCJyZWFkOndvcmtzaGVldHMiLCJjcmVhdGU6d29ya3NoZWV0X2VudHJpZXMiLCJzdWJtaXQ6d29ya3NoZWV0cyIsInN1Ym1pdDpqb2JfcG9zdHNfYXBwbGljYXRpb25zIiwicmVhZDpqb2JfcG9zdHNfYXBwbGljYXRpb25zIiwicmVhZDpqb2JfcG9zdHMiLCJyZWFkOmpvYl9lbnRyeV9tZXRhZGF0YSJdfV0sInByb2ZpbGUiOnt9fX0.mdtKQTogFmlByLAv8jApDR0jTGrCVkfnfJheXfmnqjrJkwBWq1WuhdK7I7Q-ZwZ7c9sg42ekBOevq4KoWMXqUO6GW_YIFHA-laXS5nfTgl-4iN6rRQu4bqA2i0WNU8i2ds4m-nddLvXbwxUYx_Nk6PWwKzcYvozPpbMIq1AiGscRiFwjCyb3xDehOpZj-LBMyi7GIfTUAR9aW95gSXPMwq-vd9FdTjnegsVL4Ig9_wxowOZqs08Smx8bL_Xe8DVA1ro8lymo61upCZDoNvAAEFjO0RnEUNJ6hK644s9y2LEsO3naUaYyEJ9SlW6MCdNsXUBAAqmTIneB6G4fvJLoiA',
        'user-agent': 'Mozilla/5.0 (Linux; Android 12; SM-A525F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/111.0.5563.57 Mobile Safari/537.36',
        'content-type': 'application/json',
        'accept': '*/*',
        'origin': 'http://localhost',
        'x-requested-with': 'com.telus.ai.collection.samsunh',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'http://localhost/',
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'pt-BR,pt;q\u003d0.9,en-US;q\u003d0.8,en;q\u003d0.7'
    },
    body: {
        "outputs": [
            {
                "media": {
                    "media_id": "4dcbf647-d142-4ee7-b383-3d90d7a62682",
                    "content_type": "audio/wav"
                },
                "audio": {
                    "duration_ms": 5300,
                    "sample_rate_hz": 16000,
                    "channel_count": 1,
                    "sample_size_bits": 16
                },
                "device": {
                    "phone_brand": "samsung",
                    "phone_model": "SM-A525F",
                    "operating_system": "Android 12"
                }
            }
        ]
    }
}

await Api(req);