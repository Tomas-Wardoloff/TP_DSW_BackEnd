import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { EntityManager } from '@mikro-orm/mysql';

import { orm } from './orm.js';
import { User } from '../../modules/user/user.entity.js';
import { Club } from '../../modules/club/club.entity.js';
import { Post } from '../../modules/post/post.entity.js';
import { Sport } from '../../modules/sport/sport.entity.js';
import { Agent } from '../../modules/agent/agent.entity.js';
import { UserType } from '../../modules/user/user.entity.js';
import { Position } from '../../modules/sport/position.entity.js';
import { Athlete } from '../../modules/athlete/athlete.entity.js';

async function seed() {
    const em = orm.em.fork();

    console.log('Starting seed...');

    await seedCatalog(em);
    await seedUsers(em);

    console.log('Seed completed successfully.');
    await orm.close();
}

async function seedCatalog(em: EntityManager) {
    const sportNames = [
        'Soccer',
        'Basketball',
        'Tennis',
        'Swimming',
        'Athletics',
        'Volleyball',
        'Rugby',
        'Handball',
        'Hockey',
        'Cycling',
    ];

    const sports: Record<string, Sport> = {};

    for (const name of sportNames) {
        // Verificamos si ya existe
        const existing = await em.findOne(Sport, { name });
        if (existing) {
            sports[name] = existing;
            continue;
        }
        const sport = em.create(Sport, { name });
        em.persist(sport);
        sports[name] = sport;
    }

    await em.flush();

    const soccerPositions = [
        'Goalkeeper',
        'Central Defender',
        'Lateral Derecho',
        'Lateral Izquierdo',
        'Líbero',
        'Mediocampista Defensivo',
        'Mediocampista Central',
        'Mediocampista Ofensivo',
        'Extremo Derecho',
        'Extremo Izquierdo',
        'Delantero Centro',
        'Segundo Delantero',
    ];

    for (const name of soccerPositions) {
        const existing = await em.findOne(Position, {
            name,
            sport: { id: sports['Soccer'].id },
        });
        if (existing) continue;
        em.persist(em.create(Position, { name, sport: sports['Soccer'] }));
    }

    await em.flush();

    const basketballPositions = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

    for (const name of basketballPositions) {
        const existing = await em.findOne(Position, {
            name,
            sport: { id: sports['Basketball'].id },
        });
        if (existing) continue;
        em.persist(em.create(Position, { name, sport: sports['Basketball'] }));
    }

    await em.flush();
}

async function seedUsers(em: EntityManager) {
    const password = await bcrypt.hash('password123', 10);

    const athleteUserExists = await em.findOne(User, { email: 'atleta@sportlink.com' });

    if (!athleteUserExists) {
        const soccer = await em.findOne(Sport, { name: 'Fútbol' });
        const basketball = await em.findOne(Sport, { name: 'Básquet' });
        const position = await em.findOne(Position, { name: 'Delantero Centro' });

        const athleteUser = em.create(User, {
            email: 'atleta@sportlink.com',
            password,
            phoneNumber: '+5491112345678',
            userType: UserType.ATHLETE,
        });

        const athlete = em.create(Athlete, {
            firstName: 'Juan',
            lastName: 'Pérez',
            birthDate: new Date('1995-03-15'),
            nationality: 'Argentina',
            isSigned: false,
            user: athleteUser,
        });

        athlete.sports.set([soccer!, basketball!]);
        athlete.positions.set([position!]);

        em.persist(athleteUser);
        em.persist(athlete);
        await em.flush();

        console.log('✓ Athlete user seeded — atleta@sportlink.com / password123');
    } else {
        console.log('ℹ Athlete user already exists, skipping');
    }

    const clubUserExists = await em.findOne(User, { email: 'club@sportlink.com' });

    if (!clubUserExists) {
        const clubUser = em.create(User, {
            email: 'club@sportlink.com',
            password,
            userType: UserType.CLUB,
        });

        const club = em.create(Club, {
            name: 'Club Atlético Ejemplo',
            address: 'Av. Corrientes 1234, Buenos Aires',
            openingDate: new Date('1985-06-10'),
            user: clubUser,
        });

        em.persist(clubUser);
        em.persist(club);
        await em.flush();

        console.log('✓ Club user seeded — club@sportlink.com / password123');
    } else {
        console.log('ℹ Club user already exists, skipping');
    }

    const agentUserExists = await em.findOne(User, { email: 'agente@sportlink.com' });

    if (!agentUserExists) {
        const agentUser = em.create(User, {
            email: 'agente@sportlink.com',
            password,
            userType: UserType.AGENT,
        });

        const agent = em.create(Agent, {
            firstName: 'Carlos',
            lastName: 'García',
            user: agentUser,
        });

        // Asociamos el agente al club recién creado
        const club = await em.findOne(Club, { name: 'Club Atlético Ejemplo' });
        if (club) agent.clubs.set([club]);

        em.persist(agentUser);
        em.persist(agent);
        await em.flush();

        console.log('✓ Agent user seeded — agente@sportlink.com / password123');
    } else {
        console.log('ℹ Agent user already exists, skipping');
    }

    await seedPosts(em);
}

async function seedPosts(em: EntityManager) {
    const athleteUser = await em.findOne(User, { email: 'atleta@sportlink.com' });
    const clubUser = await em.findOne(User, { email: 'club@sportlink.com' });
    const agentUser = await em.findOne(User, { email: 'agente@sportlink.com' });

    const postsData = [
        {
            author: athleteUser!,
            content:
                'Terminé el entrenamiento de hoy. Tres horas de trabajo táctico y físico. El equipo está creciendo mucho. 💪',
        },
        {
            author: athleteUser!,
            content:
                'Buscando nuevos desafíos profesionales. Si algún club está interesado en un delantero con experiencia en primera división, no duden en contactarme.',
        },
        {
            author: athleteUser!,
            content:
                'Orgulloso de representar a mi país. Cada partido es una oportunidad de demostrar de qué estamos hechos.',
        },
        {
            author: clubUser!,
            content:
                '¡Abrimos inscripciones para las divisiones juveniles! Buscamos jugadores de entre 14 y 18 años. Vení a probarte este sábado a las 10hs.',
        },
        {
            author: clubUser!,
            content:
                'El Club Atlético Ejemplo cumple 40 años esta semana. Cuatro décadas de historia, esfuerzo y pasión por el deporte. ¡Gracias a todos los que forman parte!',
        },
        {
            author: agentUser!,
            content:
                'Representando a tres atletas en la próxima ventana de transferencias. Si tu club busca refuerzos de calidad, estoy disponible para conversar.',
        },
        {
            author: agentUser!,
            content:
                'El mercado de pases está muy activo este mes. Muchas oportunidades para los jugadores que están dispuestos a dar el salto internacional.',
        },
    ];

    let seeded = 0;
    for (const postData of postsData) {
        const existing = await em.findOne(Post, { content: postData.content });
        if (existing) continue;

        em.persist(em.create(Post, postData));
        seeded++;
    }

    await em.flush();
}

seed().catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
});
