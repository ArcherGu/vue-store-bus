import { version } from './package.json'
import buble from 'rollup-plugin-buble'

const banner = `/*!
 * vue-store-bus v${version}
 * https://github.com/ArcherGu/vue-store-bus.git
 * @license MIT
 */`

export default {
    input: 'src/index.js',
    output: [{
        file: 'dist/vue-store-bus.esm.js',
        format: 'es',
        banner
    }, {
        file: 'dist/vue-store-bus.common.js',
        format: 'cjs',
        banner
    }, {
        file: 'dist/vue-store-bus.js',
        format: 'umd',
        name: 'VueStoreBus',
        banner
    }],
    plugins: [buble()]
}
