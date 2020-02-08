import * as shell from 'shelljs';

shell.cp('-R', ['src/server/views', 'src/server/public'], 'dist/');
