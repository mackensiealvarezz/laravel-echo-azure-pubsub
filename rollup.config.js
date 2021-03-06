import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
export default {
    input: './src/azure-pubsub-connector.ts',
    output: [
        { file: './dist/azure-pubsub-connector.js', format: 'esm' },
        { file: './dist/azure-pubsub-connector.common.js', format: 'cjs' },
    ],
    plugins: [
        typescript(),
        nodeResolve(),
    ],
};
