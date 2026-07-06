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

import Docker from 'dockerode';

export class DockerService
{
    constructor(private readonly docker: Docker) {}

    async getContainer(containerName: string)
    {
        const container = this.docker.getContainer(containerName);
        await container.inspect(); // Throws if it doesn't exist
        return container;
    }

    async start(containerName: string)
    {
        const container = await this.getContainer(containerName);
        const info = await container.inspect();

        if (!info.State.Running)
        {
            await container.start();
        }

        return await container.inspect();
    }

    async stop(containerName: string)
    {
        const container = await this.getContainer(containerName);
        const info = await container.inspect();

        if (info.State.Running)
        {
            await container.stop();
        }

        return await container.inspect();
    }
    
    async restart(containerName: string) {
        const container = await this.getContainer(containerName);
        await container.restart();
        return await container.inspect();
    }

    async inspect(containerName: string)
    {
        const container = await this.getContainer(containerName);
        return await container.inspect();
    }

    async logs(containerName: string, options?: Docker.ContainerLogsOptions & { follow: false })
    {
        const container = await this.getContainer(containerName);
        return container.logs(options ?? {
            stdout: true,
            stderr: true,
            tail: 100,
            follow: false
        })
    }


    async getStatus(containerName: string) {
        const info = await this.inspect(containerName);

        return {
            running: info.State.Running,
            status: info.State.Status,
            startedAt: info.State.StartedAt,
            finishedAt: info.State.FinishedAt,
            health: info.State.Health?.Status ?? null,
        };
    }
}



