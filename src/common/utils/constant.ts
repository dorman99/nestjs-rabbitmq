export default {
    exchanges: {
        challenge: {
            create: {
                name: 'cms-post-challenge',
                type: 'fanout',
                routingKeys: ['job-1', 'job-2', 'job-3'],
                queue: 'map-new-challenge'
            },
            remove: {
                name: 'cms-remove-challenge',
                type: 'fanout',
                routingKeys: ['job-1', 'job-2', 'job-3'],
                queue: 'map-new-challenge'
            },
            update: {
                name: 'cms-update-challenge',
                type: 'fanout',
                routingKeys: ['job-1', 'job-2', 'job-3'],
                queue: 'map-update-challenge'
            }
        },
        user: {
            register: {
                name: 'app-user-register',
                type: 'direct',
                routingKeys: ['job-1', 'job-2', 'job-3'],
                queue: 'take-all-challenges'
            }
        }
    }
}