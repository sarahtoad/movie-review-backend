import { app } from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`CineHub API démarrée sur http://localhost:${env.port}`);
});
