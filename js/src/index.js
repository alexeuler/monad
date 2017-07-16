import { Option } from './option';

const x = Option.pure(1)
const y = x.map(x => x + 1)
console.log(x.toString(), y.toString());
