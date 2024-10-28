import { Overview } from './overview.js';
import { Plan } from './plan.js';
import planData from '../plan.toml';
import spec from '../spec.toml';

const plan = new Plan(document.getElementById('plan'), planData);
new Overview(document.getElementById('overview'), spec, plan);
