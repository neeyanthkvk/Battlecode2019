import { Pathfinder } from './pathfinder.js';
import { attack_pred } from './predicates.js';
import { calcOpposite, dis } from './helpers.js';
import { constants } from './constants.js';

export function runCrusader(m) {
    m.log(`CRUSADER: (${m.me.x}, ${m.me.y})`);
    if (m.me.turn === 1) {
        switch (m.mission) {
            case constants.ATTACK:
                let opp = calcOpposite(m, m.spawn_castle.x, m.spawn_castle.y);
                m.pathfinder = new Pathfinder(m, attack_pred(m, ...opp));
                break;
        }
    }
    for (let r of m.visible_enemies) {
        let dist = dis(m.me.x, m.me.y, r.x, r.y);
        if (m.stats.ATTACK_RADIUS[0] <= dist && dist <= m.stats.ATTACK_RADIUS[1]) {
            m.log(`ATTACKING: (${r.x}, ${r.y})`);
            return m.attack(r.x - m.me.x, r.y - m.me.y);
        }
    }
    m.log(m.pathfinder);
    let next = m.pathfinder.next_loc(m);
    if (next.fail) { m.log("FAILED"); return; }
    if (next.wait) { m.log("WAITING"); return; }
    if (next.fin) { m.log("FINISHED"); return; }
    return m.move(...next.diff);
}
