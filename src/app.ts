import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { NotFoundError, RequestContext } from '@mikro-orm/core';

import { orm, syncSchema } from './shared/db/orm.js';
import UserRouter from './modules/user/user.routes.js';
import ClubRouter from './modules/club/club.routes.js';
import PostRouter from './modules/post/post.routes.js';
import AuthRouter from './modules/auth/auth.routes.js';
import AgentRouter from './modules/agent/agent.routes.js';
import SportRouter from './modules/sport/sport.routes.js';
import AthleteRouter from './modules/athlete/athlete.routes.js';
import FriendshipRouter from './modules/friendship/friendship.routes.js';
import { errorMiddleware } from './shared/middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/uploads', express.static('uploads'));

const routers = {
    auth: new AuthRouter().getRouter(),
    users: new UserRouter().getRouter(),
    athletes: new AthleteRouter().getRouter(),
    agents: new AgentRouter().getRouter(),
    clubs: new ClubRouter().getRouter(),
    posts: new PostRouter().getRouter(),
    sports: new SportRouter().getRouter(),
    friendships: new FriendshipRouter().getRouter(),
};

app.use('/api/auth', routers.auth);
app.use('/api/users', routers.users);
app.use('/api/athletes', routers.athletes);
app.use('/api/agents', routers.agents);
app.use('/api/clubs', routers.clubs);
app.use('/api/posts', routers.posts);
app.use('/api/catalog', routers.sports);
app.use('/api/friendships', routers.friendships);

app.use((_, res, next) => {
    next(new NotFoundError('Route not found'));
});

if (process.env.NODE_ENV === 'production') {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
} else {
    await syncSchema();
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.use(errorMiddleware);
