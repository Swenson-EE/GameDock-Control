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

import { DockerService } from '@backend/services/docker/docker.service.js';
import type { GameServerStatus, IGameServer } from './IGameServer.js';
import type Dockerode from 'dockerode';


export abstract class GameServer implements IGameServer
{
    constructor(
        protected readonly docker: DockerService,
        protected readonly containerName: string
    ) {}

    async start()
    {
        await this.docker.start(this.containerName);
    }

    async stop() 
    {
        await this.docker.start(this.containerName);
    }

    async restart()
    {
        await this.docker.restart(this.containerName);
    }

    async status() 
    {
        const status = this.mapStatus(await this.docker.inspect(this.containerName));
        return status;
    }

    private mapStatus(info: Dockerode.ContainerInspectInfo): GameServerStatus
    {
        return {
            id: info.Id,
            name: info.Name,
            running: info.State.Running,
            status: info.State.Status,
            startedAt: info.State.StartedAt ? new Date(info.State.StartedAt) : undefined,
            finishedAt: info.State.FinishedAt ? new Date(info.State.FinishedAt) : undefined,
            health: info.State.Health?.Status
        }
    }
}

