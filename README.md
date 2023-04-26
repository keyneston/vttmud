# VTTMud

Adding a Multi User Dungeon to your Virtual Table Top

## Setup

1. Copy `.env.example` to `.env`
2. Run Postgres
   - Set `DATABASE_URL` in your `.env`
3. Run Redis via docker
   - `docker run --name my-redis -p 6379:6379 --restart always --detach redis`
4. `npm run dev`

### Outstanding Issues

- Discord oauth token
- Image storage access tokens
