import { initials } from '../utils/format.js';

export default function Avatar({ name, large }) {
  return <div className={`avatar ${large ? 'avatar-lg' : ''}`}>{initials(name)}</div>;
}
