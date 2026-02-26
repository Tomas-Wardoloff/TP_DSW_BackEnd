import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { RequestContext } from '@mikro-orm/core';

import { orm, syncSchema } from './shared/db/orm.js';
import UserRouter from './modules/user/user.routes.js';
import ClubRouter from './modules/club/club.routes.js';
import PostRouter from './modules/post/post.routes.js';
import AuthRouter from './modules/auth/auth.routes.js';
import AgentRouter from './modules/agent/agent.routes.js';
import AthleteRouter from './modules/athlete/athlete.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});

const routers = {
    auth: new AuthRouter().getRouter(),
    users: new UserRouter().getRouter(),
    athletes: new AthleteRouter().getRouter(),
    agents: new AgentRouter().getRouter(),
    clubs: new ClubRouter().getRouter(),
    posts: new PostRouter().getRouter(),
};

app.use('/api/auth', routers.auth);
app.use('/api/users', routers.users);
app.use('/api/athletes', routers.athletes);
app.use('/api/agents', routers.agents);
app.use('/api/clubs', routers.clubs);
app.use('/api/posts', routers.posts);

app.use((_, res) => {
    return res.status(404).send({ message: 'Not found' });
});

await syncSchema(); // never in production

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
