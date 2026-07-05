/*
 *   Copyright (c) 2026 Tyler Swenson (tylerjswenson262@gmail.com)
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

import axios, { type AxiosInstance } from "axios";


export class PalworldService
{
    private readonly host_name: string;
    private readonly port: number;
    private credentials;

    private readonly pal_api: AxiosInstance;

    constructor(host_name?: string, port?: number)
    {
        this.host_name = host_name ?? process.env.PALWORLD_API_HOST ?? 'localhost';
        this.port = port ?? parseInt(process.env.PALWORLD_API_PORT ?? '8212');

        this.credentials = btoa(`${process.env.PALWORLD_USERNAME}:${process.env.PALWORLD_ADMIN_PASSWORD}`);

        this.pal_api = axios.create({
            baseURL: `http://${this.host_name}:${this.port}/v1/api`,
            headers: {
                'Authorization': `Basic ${this.credentials}`,
                'Content-Type': 'application/json'
            }
        })

    }

    async info()
    {
        const response = await this.pal_api.get('/info')
        return response.data
    }

    async metrics()
    {
        const response = await this.pal_api.get('/metrics')
        return response.data
    }
}

