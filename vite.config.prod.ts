import commonConfig from './vite.config.common';

export default {
    ...commonConfig,
    build: {
        outDir:'./html',
        emptyOutDir: true,
    },
    base: '/',
};
